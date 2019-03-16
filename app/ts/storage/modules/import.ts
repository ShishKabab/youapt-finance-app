import { StorageModule, StorageModuleConfig } from '@worldbrain/storex-pattern-modules'

export class ImportStorage extends StorageModule {
    getConfig = () : StorageModuleConfig => ({
        collections: {
            itemImport: {
                version: new Date('2019-03-10'),
                fields: {
                    identifier: {type: 'string', pk: true},
                },
            },
        },
        operations: {
            createItem: {
                operation: 'createObject',
                collection: 'itemImport'
            },
            findItem: {
                operation: 'findObject',
                collection: 'itemImport',
                args: { identifier: '$identifier:string' }
            },
        }
    })

    async insertItem(item : { provider : string, type : string, objectIdentifier : string }) {
        await this.operation('createItem', { identifier: `${item.provider}:::${item.type}:::${item.objectIdentifier}` })
    }

    async isItemImported(item : { provider : string, type : string, objectIdentifier : string }) : Promise<boolean> {
        return !!await this.operation('findItem', { identifier: `${item.provider}:::${item.type}:::${item.objectIdentifier}` })
    }
}
