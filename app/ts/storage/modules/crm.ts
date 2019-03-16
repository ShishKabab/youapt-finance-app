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
                    state: {type: 'string', optional: true},
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
            updateCustomer: {
                operation: 'updateObject',
                collection: 'customer',
                args: [
                    {id: '$id'},
                    {
                        name: '$name:string',
                        contactName: '$contactName:string',
                        vatNumber: '$vatNumber:string',
                    }
                ]
            },
            createAddress: {
                operation: 'createObject',
                collection: 'address'
            },
            updateAddress: {
                operation: 'updateObject',
                collection: 'address',
                args: [
                    {id: '$id'},
                    {
                        streetLine1: '$streetLine1:string',
                        streetLine2: '$streetLine2:string',
                        streetLine3: '$streetLine3:string',
                        city: '$city:string',
                        zip: '$zip:string',
                        state: '$state:string',
                        country: '$country:string',
                    }
                ]
            },
        }
    })

    async getCustomerByName(name : string) {
        return await this.operation('findCustomerByName', { name })
    }

    async insertCustomer(customer : { name : string, contactName : string, vatNumber : string, address : any }, options : { ifExists : 'update' }) {
        const existingCustomer = await this.operation('findCustomerByName', { name: customer.name });
        if (existingCustomer) {
            await this.operation('updateCustomer', { id: existingCustomer.id, ...customer})
        } else {
            await this.operation('createCustomer', customer)
        }
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
