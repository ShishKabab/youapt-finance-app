import * as expect from 'expect'
import { Admin } from '.'
import { trimIndentationSpaces } from './utils';

describe('Admin interface', () => {
    async function testImport(admin : Admin) {
        await admin.importWaveInvoices({
            invoicesCsv: trimIndentationSpaces(`
            customer,description,invoice_num,po_so,account,product,amount,quantity,invoice_date,currency,due_date,taxes
            Some customer,,1,,Consulting Income,Technical due diligence,80.00000,1.00000,2018-02-06,EUR,2018-02-20,VAT high
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

        // expect(await admin.storage.manager.collection('address').findObjects({id: customers[0]['address']})).toEqual({
        //     streetLine1: 'Street 22',
        //     streetLine2: null,
        //     streetLine3: null,
        //     city: 'Berlin',
        //     zip: '12163',
        //     state: null,
        //     country: 'Germany',
        // })
        // expect(await admin.storage.manager.collection('address').findObjects({id: customers[1]['address']})).toEqual({
        //     streetLine1: 'Street 23',
        //     streetLine2: null,
        //     streetLine3: null,
        //     city: 'Berlin',
        //     zip: '12163',
        //     state: null,
        //     country: 'Germany',
        // })
    }

    it('should import wave invoices', async () => {
        const admin = new Admin({ dbPath: 'sqlite://' })
        await admin.setup()
        await testImport(admin)
    })

    // it('should prevent duplicates while importing wave invoices', async () => {
    //     const admin = new Admin({ dbPath: 'sqlite://' })
    //     await admin.setup()
    //     await testImport(admin)
    //     await testImport(admin)
    // })
})
