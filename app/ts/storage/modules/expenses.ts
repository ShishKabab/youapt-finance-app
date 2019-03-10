import { StorageModule, StorageModuleConfig } from '@worldbrain/storex-pattern-modules'

export class ExpenseStorage extends StorageModule {
    getConfig = () : StorageModuleConfig => ({
        collections: {
            expense: {
                version: new Date('2019-03-10'),
                fields: {
                    occuredOn: {type: 'timestamp'},
                    category: {type: 'string'},
                    vatType: {type: 'string'},
                    priceCentsExVat: {type: 'int', optional: true},
                    priceCentsIncVat: {type: 'int', optional: true},
                },
            },
        },
        operations: {}
    })
}
