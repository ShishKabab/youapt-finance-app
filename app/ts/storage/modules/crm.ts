import { StorageModule, StorageModuleConfig } from '@worldbrain/storex-pattern-modules'

export interface Address {
    id? : any
    streetLine1 : string
    streetLine2? : string
    streetLine3? : string
    city : string
    zip : string
    state : string
    country : string
}

export class CrmStorage extends StorageModule {
    getConfig = () : StorageModuleConfig => ({
        collections: {
            customer: {
                version: new Date('2019-03-10'),
                fields: {
                    name: {type: 'string'},
                    contactName: {type: 'string', optional: true},
                    vatNumber: {type: 'string', optional: true},
                },
                relationships: [
                    {childOf: 'address'},
                ]
            },
            address: {
                version: new Date('2019-03-10'),
                fields: {
                    streetLine1: {type: 'string'},
                    streetLine2: {type: 'string', optional: true},
                    streetLine3: {type: 'string', optional: true},
                    city: {type: 'string'},
                    zip: {type: 'string'},
                    state: {type: 'string'},
                    country: {type: 'string'},
                }
            },
        },
        operations: {
            createCustomer: {
                operation: 'createObject',
                collection: 'customer'
            },
            findCustomerByName: {
                operation: 'findObject',
                collection: 'customer',
                args: { name: '$name:string' }
            },
            createAddress: {
                operation: 'createObject',
                collection: 'address'
            },
        }
    })

    async insertCustomer(customer : { name : string, contactName : string, vatNumber : string, address : any }) {
        await this.operation('createCustomer', customer)
    }

    async insertAddress(address : Address, options: { customerName : string, ifExists: 'update' }) {
        const existingCustomer = await this.operation('findCustomerByName', { name: options.customerName });
        if (existingCustomer) {
            await this.operation('updateAddress', {id: existingCustomer.address, ...address})
            return { id: existingCustomer.address }
        } else {
            return { id: (await this.operation('createAddress', address)).object.id }
        }
    }
}
