import * as bluebird from 'bluebird'
import * as csv from 'csv'
import StorageManager from "@worldbrain/storex"
import { SequelizeStorageBackend } from '@worldbrain/storex-backend-sequelize'
import { Storage } from "./storage"
import { CrmStorage } from "./storage/modules/crm";
import { InvoiceStorage } from "./storage/modules/invoices";
import { ExpenseStorage } from "./storage/modules/expenses";
import { registerModuleMapCollections } from "@worldbrain/storex-pattern-modules";
import { importWaveInvoice, importWaveCustomer } from './import/wave';

export class Admin {
    storage : Storage

    constructor(config : {dbPath : string}) {
        const backend = new SequelizeStorageBackend({ sequelizeConfig: config.dbPath })
        const storageManager = new StorageManager({backend: backend as any})
        this.storage = {
            manager: storageManager,
            modules: {
                crm: new CrmStorage({storageManager}),
                invoices: new InvoiceStorage({storageManager}),
                expenses: new ExpenseStorage({storageManager}),
            }
        }
    }

    async setup() {
        registerModuleMapCollections(this.storage.manager.registry, this.storage.modules as any)
        await this.storage.manager.finishInitialization()
        await this.storage.manager.backend.migrate()
    }

    async importWaveInvoicesFromPath(waveExportDirPath : string) {
    }

    async importWaveInvoices(options : {invoicesCsv : string, customersCsv : string}) {
        const invoiceItems = await bluebird.promisify(csv.parse)(options.invoicesCsv, {columns : true})
        const customerItems = await bluebird.promisify(csv.parse)(options.customersCsv, {columns : true})
        for (const customerItem of customerItems) {
            await importWaveCustomer(customerItem, this.storage.modules)
        }
        for (const invoiceItem of invoiceItems) {
            await importWaveInvoice(invoiceItem, this.storage.modules)
        }
    }
}
