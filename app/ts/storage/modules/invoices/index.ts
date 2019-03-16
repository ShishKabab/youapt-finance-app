import { StorageModule, StorageModuleConfig } from '@worldbrain/storex-pattern-modules'

export interface InvoiceLine {
    invoice : any
    label : string
    category : string
    qty : number
    unitPriceCents : number
    vatType : string
}

export class InvoiceStorage extends StorageModule {
    getConfig = () : StorageModuleConfig => ({
        collections: {
            invoice: {
                version: new Date('2019-03-10'),
                fields: {
                    number: {type: 'string', pk: true},
                    sentOn: {type: 'timestamp'},
                    dueOn: {type: 'timestamp'},
                    payedOn: {type: 'timestamp', optional: true},
                },
                relationships: [
                    {childOf: 'customer'}
                ]
            },
            invoiceLine: {
                version: new Date('2019-03-10'),
                fields: {
                    label: {type: 'string'},
                    category: {type: 'string'},
                    qty: {type: 'int'},
                    unitPriceCents: {type: 'int'},
                    vatType: {type: 'string'},
                },
                relationships: [
                    { childOf: 'invoice' }
                ]
            },
        },
        operations: {
            createInvoice: {
                operation: 'createObject',
                collection: 'invoice'
            },
            findInvoiceByNumber: {
                operation: 'findObject',
                collection: 'invoice',
                args: {
                    number: '$number:string'
                }
            },
            updateInvoice: {
                operation: 'updateObject',
                collection: 'invoice',
                args: [
                    { id: '$id:pk' },
                    {
                        number: '$number:string',
                        sentOn: '$sentOn:timestamp',
                        dueOn: '$dueOn:timestamp',
                        payedOn: '$payedOn:timestamp',
                    }
                ]
            },
            createInvoiceLine: {
                operation: 'createObject',
                collection: 'invoiceLine',
            },
            findLineByInvoiceAndLabel: {
                operation: 'findObject',
                collection: 'invoiceLine',
                args: {
                    invoice: '$invoice:pk',
                    label: '$label:string',
                }
            }
        }
    })

    async insertInvoice(invoice : { customer : any, number : string, sentOn : number, dueOn : number, payedOn? : number }, options : { ifExists: 'update' }) {
        const existingInvoice = await this.operation('findInvoiceByNumber', { number: invoice.number });
        if (existingInvoice) {
            await this.operation('updateInvoice', { id: existingInvoice.id, ...invoice })
            return { id: existingInvoice.id }
        } else {
            return { id: (await this.operation('createInvoice', invoice)).object.id }
        }
    }

    async insertInvoiceLine(invoiceLine : InvoiceLine, options : { ifExists : 'do-nothing' }) {
        const existingInvoiceLine = await this.operation('findLineByInvoiceAndLabel', { invoice: invoiceLine.invoice, label: invoiceLine.label })
        if (!existingInvoiceLine) {
            await this.operation('createInvoiceLine', invoiceLine)
        }
    }
}
