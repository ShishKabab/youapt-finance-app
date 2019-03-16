import { StorageModules } from "../storage";
import { WaveInvoiceLineItem, WaveCustomerItem } from "./types";
import { Address } from "../storage/modules/crm";
import { InvoiceLine } from "../storage/modules/invoices";

export const WAVE_VAT_MAP = {
    'VAT high': 'nl:high',
    'Reverse': 'nl:reverse',
}

export const WAVE_INVOICE_LINE_CATEGORY_MAP = {
    'Software dev / consultancy': 'software:services',
    'Technical due diligence': 'software:due-diligence',
    'Travel Expenses': 'expenses:travel',
}

export async function importWaveCustomer(waveItem : WaveCustomerItem, storageModules : StorageModules) {
    const address : Address = {
        streetLine1: waveItem.address_line_1,
        streetLine2: waveItem.address_line_2,
        city: waveItem.city,
        zip: waveItem["postal_code/zip_code"],
        state: waveItem["province/state"],
        country: waveItem.country,
    }
    const { id: addressId } = await storageModules.crm.insertAddress(address, { customerName: waveItem.customer_name, ifExists: 'update' })

    const type = waveItem.contact_first_name && waveItem.contact_last_name ? 'with-contact' : 'with-vat-number'
    const customer = { name: waveItem.customer_name, contactName: null, vatNumber : null, address: addressId }
    if (type === 'with-contact') {
        customer.contactName = `${waveItem.contact_first_name} ${waveItem.contact_last_name}`
    } else {
        const fullVatNumber = waveItem.contact_first_name
        if (fullVatNumber.substr(0, 'VAT '.length) !== 'VAT ') {
            throw new Error(`Got item with invalid VAT number in contact_first_name field: ${JSON.stringify(waveItem, null, 4)}`)
        }
        customer.vatNumber = waveItem.contact_first_name.substr('VAT '.length)
    }
    await storageModules.crm.insertCustomer(customer, { ifExists: 'update' })
}

export async function importWaveInvoice(waveItem : WaveInvoiceLineItem, storageModules : StorageModules) {
    const customer = await storageModules.crm.getCustomerByName(waveItem.customer)
    if (!customer) {
        throw new Error(`Found line number for unknown customer: '${waveItem.customer}'`)
    }

    const invoice = {
        customer: customer.id,
        number: waveItem.invoice_num,
        sentOn: new Date(waveItem.invoice_date).getTime(),
        dueOn: new Date(waveItem.due_date).getTime(),
        payedOn: null,
    }

    const { id: invoiceId } = await storageModules.invoices.insertInvoice(invoice, { ifExists: 'update' })
    const invoiceLine : InvoiceLine = {
        invoice: invoiceId,
        label: waveItem.description,
        category: WAVE_INVOICE_LINE_CATEGORY_MAP[waveItem.product],
        qty: parseInt(waveItem.quantity),
        unitPriceCents: parseFloat(waveItem.amount) * 100,
        vatType: WAVE_VAT_MAP[waveItem.taxes],
    }
    await storageModules.invoices.insertInvoiceLine(invoiceLine, { ifExists: 'do-nothing' })
}
