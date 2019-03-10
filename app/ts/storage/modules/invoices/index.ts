import { StorageModule, StorageModuleConfig } from '@worldbrain/storex-pattern-modules'

export const VAT_TYPES = {
    'nl:reverse': {
        label: 'Reverse 0%',
    },
    'nl:high': {
        label: 'VAT 21%',
        percentage_history: [
            {since: new Date('2012-10-01'), percentage: 21}
        ]
    }
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
                    categoryLabel: {type: 'string'},
                    qty: {type: 'int'},
                    unitPriceCents: {type: 'int'},
                    vatType: {type: 'string'},
                }
            },
        },
        operations: {}
    })
}
