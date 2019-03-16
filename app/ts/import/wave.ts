import { StorageModules } from "../storage";
import { WaveInvoiceItem, WaveCustomerItem } from "./types";
import { Address } from "../storage/modules/crm";

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
    await storageModules.crm.insertCustomer(customer)
}

export function importWaveInvoice(waveItem : WaveInvoiceItem, storageModules : StorageModules) {
    // console.log('got item', waveItem)
}
