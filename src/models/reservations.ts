import QueryString from "qs";
import { Tasks } from "../models";
import { APIGroup, LinkedObject, PassengerAssignment, PatchPayload } from "./common";
import { Note, NoteType } from "./notes";
import { Payment } from "./payments";
import { PassengerAPI } from "./passengers";


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

export interface SetSourceRequest {
    SourceId: number
    SubsourceId: number
    Comment?: string
    FreeText?: ''
}

export interface SetSourceResponse extends SetSourceRequest {
    Id: number
    DateAdded: string
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
     * Attention Required
     *
     * @default false
     * @readonly
     * @since v0.9.5
     */
    AttentionRequired: boolean

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

export interface BookingDocument extends LinkedObject {
    Id: number
    Template: string
    ExternalURI: string
    CreatedByUserId: number
    OwnerUserId: number
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
    Extras?: Array<PassengerAssignment>
}


interface AddComponentRequest {
    CacheId: string
    ParentComponentId?: number
    ReplaceComponentId?: number
}


export interface BookingComponentListEntry extends LinkedObject {
    Id: number
    SetupId: number
    ContinuityId: number
    Name: string
    Description: string
    ComponentType: string
    ComponentSubType: string
    ParentId: number
    Price: Price
    Status: string
    QuotedByUserId: number
    OwnerUserId: number
}

export interface BookingComponent extends BookingComponentListEntry {
    ConfirmationReference: string
    StartDate: Date
    EndDate: Date
    Reference: string
    SupplierId: number
    Tags: string
    PerPassengerPrices: ComponentPassengerPrice[]
    PrimarySetupLocationId: number
    SecondarySetupLocationId: number
    BaseSetupId: number
    Link: string
}

export interface ComponentPassengerPrice {
    PassengerId: number
    Price: Price
}

export interface AddNoteRequest {
    Type: NoteType
    Title: string
    Text: string
}

export interface ReservationUpdateOperation {
    op: 'replace',
    path: string,
    value: any
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
    public async update(id: string, updates: PatchPayload[]): Promise<void> {
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
    public async updatePassenger(id: number, passengerId: number, updates: PatchPayload[]): Promise<void> {
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
     * Set the sources for a booking
     * 
     * @param id Reservation ID
     * @param params Set Source Properties
     * @returns 
     */
    public async setSource(id: string, params: SetSourceRequest): Promise<SetSourceResponse> {
        params.FreeText = '' // This parameter is required but must always be empty.
        return (await this.axios.post<SetSourceResponse>(`/sales/reservations/${id}/sources`, params)).data
    }

    /**
     * Accept terms and conditions for a booking.
     * 
     * @param id Booking ID
     * @returns
     */
    public async acceptConditions(id: string): Promise<void> {
        await this.axios.put(`/sales/reservations/${id}/conditions`, {action: 'accept'})
        return
    }

    /**
     * Confirm a reservation
     *
     * @param id ID of the reservation to confirm
     */
    public async confirm(id: string): Promise<void> {
        const params = { ReservationId: id }
        await this.axios.post(`/sales/reservations/confirmations`, params)
    }

    /**
     * Convert a reservation to an Option
     * 
     * @param id ID of the reservation to option
     */
    public async createOption(id: string|number): Promise<void> {
        const params = { ReservationId: id }
        await this.axios.post('/sales/reservations/options', params)
    }

    /**
     * Get the components which are part of the booking
     *
     * @param bookingId Booking ID
     * @returns List of booking components
     */
    public async components(bookingId: number): Promise<BookingComponentListEntry[]> {
        return (await this.axios.get<BookingComponentListEntry[]>(`/sales/reservations/${bookingId}/components`)).data
    }

    /**
     * Get details of a single component of a booking
     *
     * @param bookingId Booking ID
     * @param componentId Component ID
     * @returns Component Details
     */
    public async component(bookingId: number, componentId: number): Promise<BookingComponent> {
        return (await this.axios.get<BookingComponent>(`/sales/reservations/${bookingId}/components/${componentId}`)).data
    }

    /**
     * Get the passengers on a booking
     *
     * @param id Booking ID
     * @returns List of passengers
     */
    public async passengers(id: number): Promise<Passenger[]> {
        return (await this.axios.get<Passenger[]>(`/sales/reservations/${id}/passengers`)).data
    }

    /**
     * Get an API object for a specific passenger
     * 
     * @param reservation Booking ID
     * @param passenger Passenger ID
     * @returns 
     */
    public passenger(reservation: number, passenger: number): PassengerAPI {
        return new PassengerAPI(this.axios, reservation, passenger)
    }

    /**
     *
     * Add a new note to a reservation
     *
     * @param id Reservation ID
     * @param note Note Data
     * @returns Created Note
     */
    public async addNote(id: number, note: AddNoteRequest): Promise<Note> {
        return (await this.axios.post<Note>(`/sales/reservations/${id}/notes`, note)).data
    }

    /**
     * Get Notes for a reservation
     *
     * @param id Booking ID
     * @returns Booking Notes
     */
    public async notes(id: number): Promise<Note[]> {
        return (await this.axios.get<Note[]>(`/sales/reservations/${id}/notes`)).data
    }

    /**
     * Delete a note based on booking and note ID.
     * 
     * @param bookingId Booking ID
     * @param noteId Note ID
     * @returns 
    */
    public async deleteNote(bookingId: number, noteId: number): Promise<void> {
        return (await this.axios.delete(`/sales/reservations/${bookingId}/notes/${noteId}`)).data
    }

    /**
     * Get payments for a reservation
     *
     * @param id Reservation ID
     * @returns Payments
     */
    public async payments(id: number): Promise<Payment[]> {
        return (await this.axios.get<Payment[]>(`/sales/reservations/${id}/payments`)).data
    }

    public async documents(id: number): Promise<BookingDocument[]> {
        return (await this.axios.get<BookingDocument[]>(`/sales/reservations/${id}/documents`)).data
    }
}
