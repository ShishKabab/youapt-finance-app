import { InvoiceLineItemCategory } from "./types";

export const INVOICE_LINE_CATEGORIES : {[id : string] : InvoiceLineItemCategory} = {
    'software:services': {
        label: 'Software consultancy / development'
    },
    'software:due-diligence': {
        label: 'Technical due diligence',
    },
    'expenses:travel': {
        label: 'Travel expenses'
    },
}
