import QueryString from "qs";
import { Tasks } from "../models";
import { APIGroup, LinkedObject, PassengerAssignment } from "./common";


export interface FindReservationRequest {
    bookingReference: string | null
    leadPassengerSurname: string | null
    departureDateMinimum: Date | null
    departureDateMaximum: Date | null
    customerId: number | null
}

export interface FindReservationResponse extends LinkedObject {
    Id: number
    PassengerCount: number
    ComponentCount: number
    QuotedByUserId: number
    OwnerUserId: number
}

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
    CurrencyCode: string
}

/**
 * Booking / Reservatioen
 * 
 */
export interface Reservation extends LinkedObject {
    
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
    CurrencyDetails: CurrencyDetails | null

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

interface AddComponentRequest {
    CacheId: string
    ParentComponentId?: number
    ReplaceComponentId?: number
}

export class Api extends APIGroup {

    public async create(params: CreateReservationRequest): Promise<Reservation> {
        const rsp = await this.axios.post<Reservation>("/sales/reservations/", params)
        return rsp.data
    }

    public async search(params: FindReservationRequest): Promise<FindReservationResponse[]> {
        const query = QueryString.stringify(params, { skipNulls: true })
        return (await this.axios.get<FindReservationResponse[]>(`/sales/reservations?${query}`)).data
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

    /**
     * Assign passengers to services
     * 
     * ````typescript
     * const assignments: ServiceAssignmentRequest = {
     *      "Accommodations": [
     *          {   
     *              "ComponentId": idOfTheComponent,
     *              "PassengerIds": [passenger_1, passenger_2, passenger_3]
     *          }  
     *      ]
     * }
     * 
     * try {
     *      await client.reservations.assign(searchId, resultId, assignments)
     * } catch(error) { 
     *      console.error(`Unable to assign passengers: ${error.message}`) 
     * }
     * ````
     * 
     * @param searchId Search result set ID
     * @param resultId Result/Departure ID
     * @param assignment Details of the services to be assigned
     */
    public async assign(searchId: string, resultId: string, assignment: ServiceAssignmentRequest): Promise<Record<string, any>> {
        const rsp = await this.axios.post(`/toursSearch/searches/${searchId}/tourDepartures/${resultId}/combinations`, assignment)
        return rsp.data
    }


    /**
     * Add a service component to a reservation
     * 
     * @param reservationId ID of the reservation to add the component to
     * @param componentId The ID of the component to add
     * @param parentComponentId If specified, the added component will be a child component of the component with this ID
     * @param replaceComponentId If specified, the added component will replace the component with this ID
     */
    public async addComponent(reservationId: string | number, componentId: string, parentComponentId?: number, replaceComponentId?: number): Promise<boolean> {
        const req: AddComponentRequest = {
            CacheId: componentId,
            ParentComponentId: parentComponentId,
            ReplaceComponentId: replaceComponentId,
        }

        try {
            const rsp = await this.axios.post(`/sales/reservations/${reservationId}/components`, req)
        } catch(err) {
            console.error(err)
        }
        
        return true
    }

    /**
     * Perform arbitrary alterations to a booking.
     * 
     * @warning Direct use of this method should be avoided, and convenience methods used where available.
     * 
     * @example
     * 
     * ````typescript
     * 
     * const updates: Array<TigerBay.Models.Reservations.ReservationUpdateOperation> = [
     *  {
     *      "op": "replace",
     *      "path": "/customerId",
     *      "value": 4830
     *  },
     *  {
     *      "op": "replace",
     *      "path": "/ConditionsAccepted",
     *      "value": true
     *  }
     * ]
     * 
     * await client.reservations.update(bookingId, updates)
     * ````
     * 
     * @param id ID of the booking to update
     * @param updates A collection of update operations to perform
     */
    public async update(id: string, updates: Array<ReservationUpdateOperation>): Promise<void> {
        await this.axios.patch(`/sales/reservations/${id}`, updates, {
            headers: {
                "Content-Type": "application/json-patch+json"
            }
        })
        return 
    }

    /**
     * Perform arbitrary updates to a booking passenger.
     * 
     * See {@link update} for more detailed information on updates
     * 
     */
    public async updatePassenger(id: number, passengerId: number, updates: ReservationUpdateOperation[]): Promise<void> {
        await this.axios.patch(`/sales/reservations/${id}/passengers/${passengerId}`, updates, {
            headers: {
                "Content-Type": "application/json-patch+json"
            }
        });
        return
    }

    /**
     * Get the tasks attached to a reservation
     * 
     * @param id Reservation ID
     */
    public async tasks(id: string): Promise<Array<Tasks.Task>> {
        return (await this.axios.get<Array<Tasks.Task>>(`/sales/reservations/${id}/tasks`)).data
    }

    /**
     * Confirm a reservation
     * 
     * @param id ID of the reservation to confirm
     */
    public async confirm(id: string): Promise<void> {
        const params = {ReservationId: id}
        await this.axios.post(`/sales/reservations/confirmations`, params)
    }
}