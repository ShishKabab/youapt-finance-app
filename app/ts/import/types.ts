export interface WaveCustomerItem {
    customer_name? : string
    email? : string
    contact_first_name? : string
    contact_last_name? : string
    customer_currency? : string
    account_number? : string
    phone? : string
    fax? : string
    mobile? : string
    toll_free? : string
    website? : string
    country? : string
    'province/state'? : string
    address_line_1? : string
    address_line_2? : string
    city? : string
    'postal_code/zip_code'? : string
    shipping_address? : string
    'ship-to_contact'? : string
    'ship-to_country'? : string
    'ship-to_province/state'? : string
    'ship-to_address_line_1'? : string
    'ship-to_address_line_2'? : string
    'ship-to_city'? : string
    'ship-to_postal_code/zip_code'? : string
    'ship-to_phone'? : string
    delivery_instructions? : string
}

export interface WaveInvoiceItem {
    customer? : string
    description? : string
    invoice_num? : string
    po_so? : string
    account? : string
    product? : string
    amount? : string
    quantity? : string
    invoice_date? : string
    currency? : string
    due_date? : string
    taxes? : string
}
