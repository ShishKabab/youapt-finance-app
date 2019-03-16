import StorageManager from '@worldbrain/storex'
import { CrmStorage } from './modules/crm'
import { InvoiceStorage } from './modules/invoices'
import { ExpenseStorage } from './modules/expenses'
import { ImportStorage } from './modules/import';

export interface Storage {
    modules : StorageModules
    manager : StorageManager
}

export interface StorageModules {
    crm : CrmStorage
    invoices : InvoiceStorage
    expenses : ExpenseStorage
    import : ImportStorage
}
