export enum VOUCHER_TYPE {
    None = 0
    , CashPayment = 1
    , CashReceipt = 2
    , BankPayment = 3
    , BankReceipt = 4
    , Journal = 5
}

export enum VoucherTypeEnum {
    Payment = 1
    , Receipt = 2
    , Journal = 3
}

export enum VOUCHER_TRANSACTION_TYPE {
    None = "None"
    , Cash = "Cash"
    , Bank = "Bank"
    , CreditCard = "CreditCard"
}
export enum TRANSACTION_TYPE {
    None = "None"
    , Cash = "Cash"
    , Bank = "Bank"
    , CreditCard = "CreditCard"
}

export enum VOUCHER_STATUS {
    UnPosted = 0
    , Posted = 2
}