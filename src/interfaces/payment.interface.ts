export interface PaymentCreatePayload {
    collectionId: string;
    childId: string;
    amount: number;
}

export interface WithdrawPaymentPayload {
    paymentId: string;
}
