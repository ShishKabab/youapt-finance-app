import StorageManager from '@worldbrain/storex'
import { CrmStorage } from './modules/crm'
import { InvoiceStorage } from './modules/invoices'
import { ExpenseStorage } from './modules/expenses'

export interface Storage {
    modules : StorageModules
    manager : StorageManager
}

export interface StorageModules {
    crm : CrmStorage
    invoices : InvoiceStorage
    expenses : ExpenseStorage
}
