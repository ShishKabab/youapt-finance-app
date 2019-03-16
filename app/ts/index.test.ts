import * as expect from 'expect'
import { Admin } from '.'
import { trimIndentationSpaces } from './utils';

describe('Admin interface', () => {
    async function testImport(admin : Admin) {
        await admin.importWaveInvoices({
            invoicesCsv: trimIndentationSpaces(`
            customer,description,invoice_num,po_so,account,product,amount,quantity,invoice_date,currency,due_date,taxes
            Other customer,Other work,2,,Sales,Software dev / consultancy,2000.00000,1.00000,2018-03-21,EUR,2018-03-25,Reverse
            Some customer,,1,,Consulting Income,Technical due diligence,80.00000,1.00000,2018-02-06,EUR,2018-02-20,VAT high
            Other customer,Some travel expenses,2,,Sales,Travel Expenses,20.000,1.00000,2018-03-21,EUR,2018-03-25,Reverse
            `),
            customersCsv: trimIndentationSpaces(`
            customer_name,email,contact_first_name,contact_last_name,customer_currency,account_number,phone,fax,mobile,toll_free,website,country,province/state,address_line_1,address_line_2,city,postal_code/zip_code,shipping_address,ship-to_contact,ship-to_country,ship-to_province/state,ship-to_address_line_1,ship-to_address_line_2,ship-to_city,ship-to_postal_code/zip_code,ship-to_phone,delivery_instructions
            Some customer,,John,Doe,EUR,,,,,,,Germany,,Street 22,,Berlin,12163,False,,,,,,,,,
            Other customer,,VAT DE11111,,EUR,,,,,,,Germany,Berlin,Street 23,,Berlin,12163,False,,,,,,,,,
            `),
        })

        const customers = await admin.storage.manager.collection('customer').findObjects({})
        expect(customers).toEqual([
            {
                id: expect.anything(),
                name: 'Some customer',
                contactName: 'John Doe',
                address: expect.anything(),
            },
            {
                id: expect.anything(),
                name: 'Other customer',
                vatNumber: 'DE11111',
                address: expect.anything(),
            },
        ])

        expect(await admin.storage.manager.collection('address').findObjects({})).toEqual([
            {
                id: customers[0]['address'],
                streetLine1: 'Street 22',
                city: 'Berlin',
                zip: '12163',
                country: 'Germany',
            },
            {
                id: customers[1]['address'],
                streetLine1: 'Street 23',
                city: 'Berlin',
                state: 'Berlin',
                zip: '12163',
                country: 'Germany',
            }
        ])

        const invoices = await admin.storage.manager.collection('invoice').findObjects({})
        expect(invoices).toEqual([
            {
                id: expect.anything(),
                customer: customers[1]['id'],
                number: '2',
                sentOn: (new Date('2018-03-21')).getTime(),
                dueOn: (new Date('2018-03-25')).getTime(),
            },
            {
                id: expect.anything(),
                customer: customers[0]['id'],
                number: '1',
                sentOn: (new Date('2018-02-06')).getTime(),
                dueOn: (new Date('2018-02-20')).getTime(),
            },
        ])

        const invoiceLines = await admin.storage.manager.collection('invoiceLine').findObjects({})
        expect(invoiceLines).toEqual([
            {
                id: expect.anything(),
                label: "Other work",
                category: "software:services",
                qty: 1,
                unitPriceCents: 200000,
                vatType: "nl:reverse",
                invoice: invoices[0]['id']
            },
            {
                id: 2,
                label: "",
                category: "software:due-diligence",
                qty: expect.anything(),
                unitPriceCents: 8000,
                vatType: "nl:high",
                invoice: invoices[1]['id']
            },
            {
                id: expect.anything(),
                label: "Some travel expenses",
                category: "expenses:travel",
                qty: 1,
                unitPriceCents: 2000,
                vatType: "nl:reverse",
                invoice: invoices[0]['id']
            }
        ])
    }

    it('should import wave invoices', async () => {
        const admin = new Admin({ dbPath: 'sqlite://' })
        await admin.setup()
        await testImport(admin)
    })

    it('should prevent duplicates while importing wave invoices', async () => {
        const admin = new Admin({ dbPath: 'sqlite://' })
        await admin.setup()
        await testImport(admin)
        await testImport(admin)
    })
})
