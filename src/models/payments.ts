import { APIGroup, LinkedObject } from "./common";

export type PaymentStatus = 'Failed' | 'Authorised' | 'Pending' | 'Complete' |
                            'UserCancelled' | 'Initialised'

export type PaymentProvider = 'NotSet' | 'GlobalPayments' | 'Opayo' | 'Test' | 'Syntec' | 'DataCash'

/**
 * Parameters to create a new payment
 */
export interface CreatePaymentRequest {
    TypeId?: number
    Amount?: PaymentAmount
    AuthorisationCode?: string
    TransactionReference?: string
    Reference?: string
    Token?: string
    Last4Digits?: string
    Status?: PaymentStatus
    Provider?: PaymentProvider
    ProviderData: Array<{key: string, value: string}>
}

export interface PaymentAmount {
    CurrencyCode: string
    Value: number
}

export interface PaymentType {
    Id: number
    Name?: string
    PaymentMethod?: 'Manual' | 'PaymentProvider'
}

export interface Payment extends LinkedObject {
    Id: number
    CreatedDateTime: string
    CreatedBy?: { Id?: number }
    Type?: PaymentType
    PaymentAmount: PaymentAmount
    AuthorisationCode?: string
    TransactionReference?: string
    Last4Digits?: string
    Status?: PaymentStatus
    ProviderData?: Array<{key: string, value: string}>
    Provider?: PaymentProvider
    Reference?: string
    CompletedDate?: string
    IsScheduled?: boolean
    ScheduledDate?: string
    IsScheduledPrincipal?: boolean
    IsScheduledPrincipalCandidate?: boolean
    IsScheduledFinal?: boolean
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
    public async create(reservationId: number, payment: CreatePaymentRequest): Promise<Payment> {
        return (await this.axios.post(`/3/sales/reservations/${reservationId}/payments`, payment)).data
    }

    /**
     * 
     * @param reservationId Reservation ID within which to find the payment
     * @param id ID of the payment to find
     * @returns {Promise<Payment>} Payment details
     */
    public async find(reservationId: number, id: number): Promise<Payment> {
        return (await this.axios.get<Payment>(`/3/sales/reservations/${reservationId}/payments/${id}`)).data
    }

    /**
     * List Payments by Reservation
     * 
     * @param reservationId ID of Reservation to list payments for
     * @returns {Promise<Payment[]>} List of payments made against the reservation
     */
    public async list(reservationId: number): Promise<Payment[]> {
        return (await this.axios.get<Payment[]>(`/3/sales/reservations/${reservationId}/payments`)).data
    }

    /**
     * Finalize an existing payment.
     * 
     * @param reservationId ID of the reservation the payment is against
     * @param paymentId ID of the payment to finalize
     * 
     * @deprecated
     */
    public async finalize(reservationId: number, paymentId: string): Promise<Payment> {
        return (await this.axios.post(`/sales/reservations/${reservationId}/payments/${paymentId}/completionRequest`)).data
    }
}