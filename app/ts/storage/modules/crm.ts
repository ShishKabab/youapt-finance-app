import { StorageModule, StorageModuleConfig } from '@worldbrain/storex-pattern-modules'

export class CrmStorage extends StorageModule {
    getConfig = () : StorageModuleConfig => ({
        collections: {
            customer: {
                version: new Date('2019-03-10'),
                fields: {
                    name: {type: 'string'},
                    vatNumber: {type: 'string', optional: true},
                },
            },
            address: {
                version: new Date('2019-03-10'),
                fields: {
                    line1: {type: 'string'},
                    line2: {type: 'string', optional: true},
                    line3: {type: 'string', optional: true},
                    city: {type: 'string'},
                    zip: {type: 'string'},
                    state: {type: 'string'},
                    country: {type: 'string'},
                }
            },
        },
        operations: {}
    })
}
