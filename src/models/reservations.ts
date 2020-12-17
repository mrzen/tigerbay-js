import { APIGroup, Link, PassengerAssignment } from "./common";

/**
 * API Request Parameters to create a new {@link Reservation}
 */
export interface CreateReservationRequest {
    /**
     * ID of the Brand or sales channel
     */
    BrandChannelId: number

    /**
     * ISO code for the currency
     */
    Currency: string
}

/**
 * Booking / Reservatioen
 * 
 */
export interface Reservation {
    
    /**
     * Booking ID 
     * 
     * @readonly
     */
    Id: number

    /**
     * Booking Reference
     */
    BookingReference: string

    /**
     * 
     */
    PartialToken: string

    /**
     * Currency code for the booking and pricing
     */
    CurrencyCode: string

    /**
     * ID of the customer who owns the booking, if any
     */
    CustomerId: number

    /**
     * ID of the agent who owns the booking, if any
     */
    AgentId: number

    /**
     * Start date for the booking (commencement of first service)
     */
    StartDate: Date
    
    /**
     * End date for the booking (conclusion of the last service)
     */
    EndDate: Date
    
    /**
     * Timestamp of when the booking was confirmed
     */
    ConfirmedDate: Date

    /**
     * Number of "Adult" class passengers (see {@link PassengerType})
     */
    AdultCount: number

    /**
     * Number of "Child" class passengers (see {@link PassengerType})
     */
    ChildCount: number

    /**
     * Number of "Infant" class passengers (see {@link PassengerType})
     */
    InfantCount: number

    BrandChannelId: number

    /**
     * Date on which the balance for the booking is due
     */
    BalanceDue: Date
    LocationId: number
    SalesChannelId: number
    ConditionsAccepted: boolean

    /**
     * Total Price for the booking
     */
    TotalPrice: Price

    /**
     * Price for the deposit for the booking
     */
    Deposit: Price

    /**
     * Remaining balance for the booking ({@link TotalPrice} less payments made)
     */
    OutstandingBalance: Price

    /**
     * Value of the commission earned by the agent, if any.
     */
    Commission: Price

    /**
     * Sales tax applicable to the booking
     */
    Vat: Price

    /**
     * Balance of the Agent's account
     */
    AgentBalance: Price

    /**
     * Balance of the Customer's account
     */
    CustomerBalance: Price

    /**
     * System User ID who created the original quote
     */
    QuotedByUserId: number
    
    /**
     * System User ID who owns the booking
     */
    OwnerUserId: number

    /**
     * Current booking status
     */
    Status: string

    PrincipalComponentId: number
    PrincipalComponentName: string
    Links: Array<Link>
}

/**
 * Price information
 */
export interface Price {
    /**
     * ISO currency code for price
     */
    CurrencyCode: string

    /**
     * Details of the currency itself
     */
    CurrencyDetails: CurrencyDetails

    /**
     * Value
     */
    Value: number

    /**
     * Currency & Value pre-formatted for HTML
     */
    HtmlFormat: string
}

export interface CurrencyDetails {
    /**
     * ISO currency code
     */
    Code: string

    /**
     * Currency Name
     */
    Name: string

    /**
     * Default conversion rate
     */
    DefaultRate: number

    /**
     * Full Name of the currency (name and code)
     */
    FullName: string
}

/**
 * Passenger type
 */
export type PassengerType = "Adult" | "Child" | "Infant"

export interface AddPassengerRequest {
    Type: PassengerType
    Title: string
    Forename: string
    Surname: string
    IsLead: boolean
    DateOfBirth: Date
}


export interface Passenger {
    /**
     * Passenger Id
     * 
     * @readonly
     */
    Id: number
}

/**
 * Service Assignment Request
 *
 * Assignment is handled as a mapping of service types to a set of {@link PassengerAssignment}s
 * 
 * @example Setting Flights
 * 
 * ````typescript
 * 
 * const flights: ServiceAssignmentRequest = {
 *      "FlightGroups": [
 *          {
 *              ComponentId: "the_id",
 *              PassengerIds: [1,2,3]
 *          }
 *      ]
 * }
 * ````
 */
export interface ServiceAssignmentRequest {
    FlightGroups?: Array<PassengerAssignment>
    Accommodations?: Array<PassengerAssignment>
}

/**
 * Descriptor of an update operation to be made against a reservation
 */
export interface ReservationUpdateOperation {
    /**
     * Value to set/add
     */
    value: any

    /**
     * Path to the target field
     */
    path: string

    /**
     * Operation to perform
     */
    op: "replace"
}

export class Api extends APIGroup {

    public async create(params: CreateReservationRequest): Promise<Reservation> {
        const rsp = await this.axios.post<Reservation>("/sales/reservations/", params)
        return rsp.data
    }

    /**
     * Get an existing reservation by ID
     * 
     * @param id ID of the booking to get
     */
    public async find(id: string): Promise<Reservation> {
        const rsp = await this.axios.get<Reservation>(`/sales/reservations/${id}`)
        return rsp.data
    }

    /**
     * Add a new passenger to an existing booking
     * 
     * @param bookingId ID of the booking to add the passenger to
     * @param passenger Passenger to add to the booking
     */
    public async addPassenger(bookingId: string, passenger: AddPassengerRequest): Promise<Passenger> {
        const rsp = await this.axios.post(`/sales/reservations/${bookingId}/passengers`, passenger)
        return rsp.data
    }

    public async assign(searchId: string, resultId: string, assignment: ServiceAssignmentRequest): Promise<Record<string, any>> {
        const rsp = await this.axios.post(`/toursSearch/searches/${searchId}/tourDepartures/${resultId}/combinations`, assignment)
        return rsp.data
    }

    /**
     * Perform arbitrary alterations to a booking.
     * 
     * @warning Direct use of this method should be avoided, and convenience methods used where available.
     * 
     * @param id ID of the booking to update
     * @param updates A collection of update operations to perform
     */
    public async update(id: string, updates: Array<ReservationUpdateOperation>): Promise<void> {
        await this.axios.patch(`/sales/reservations/${id}`, updates)
        return 
    }
}