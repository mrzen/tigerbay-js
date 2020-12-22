import { APIGroup, LinkedObject } from "./common";
import { Price } from "./reservations";


/**
 * Parameters to create a new payment
 */
export interface CreatePaymentRequest {
    Amount: PaymentAmount

    /**
     * An optional payment reference
     */
    Reference?: string

    /**
     * URL to return the user to after making the payment
     */
    ReturnUrl: string | URL

    /**
     * ID of the customer contact to associate the payment with
     */
    ContactIdForPayment: number

    /**
     * Payment Type ID
     */
    SetupPaymentTypeId: number
}

export interface PaymentAmount {
    CurrencyCode: string
    Value: number
}

export interface CreatePaymentResponse extends LinkedObject {
    Id: number
    ReservationId: number
    Url: string | URL
    Message: string
}

export interface Payment extends CreatePaymentResponse {
    Status: string
    Reference: string
    SetupPaymentCardId: number
    CreatedDate: Date
    CompletedDate: Date
    Amount: Price
    Charge: Price
    Total: Price
    CreatedByUserId: number
    OwnerUserId: number
    ParentID: number
    PaymentProviderReference?: string
    PaymentTypeReference?: string
    Token?: string
    TransactionReference?: string
    Last4Digits?: string
}

/**
 * API Operations for Payments
 */
export class Api extends APIGroup {

    /**
     * Request a new payment against a reservation
     * 
     * @param reservationId ID of the reservation to add the payment to
     * @param payment Paramters for the payment
     */
    public async create(reservationId: number, payment: CreatePaymentRequest): Promise<CreatePaymentResponse> {
        return (await this.axios.post(`/sales/reservations/${reservationId}/payments`, payment)).data
    }

    public async find(reservationId: number, id: number): Promise<Payment> {
        return (await this.axios.get<Payment>(`/sales/reservations/${reservationId}/payments/${id}`)).data
    }

    /**
     * Finalize an existing payment.
     * 
     * @param reservationId ID of the reservation the payment is against
     * @param paymentId ID of the payment to finalize
     */
    public async finalize(reservationId: number, paymentId: string): Promise<Payment> {
        return (await this.axios.post(`/sales/reservations/${reservationId}/payments/${paymentId}/completionRequest`)).data
    }
}