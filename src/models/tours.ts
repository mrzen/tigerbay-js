import { APIGroup, DateRange, LinkedObject, Warning } from "./common";
import { Price } from "./reservations";


export class Api extends APIGroup {

    /**
     * Search for available tour departures based on a reservation
     * 
     * @param params Search Parameters
     */
    public async search(params: TourSearchRequest): Promise<TourSearchResponse> {
        const rsp = await this.axios.post<TourSearchResponse>('/toursSearch/searches', params)

        return rsp.data
    }

    /**
     * Get the results for a search
     * 
     * @param searchId ID of the result set, created with {@link search}
     */
    public async departures(searchId: string): Promise<Array<Departure>> {
        const rsp = await this.axios.get<Array<Departure>>(`/toursSearch/searches/${searchId}/tourDepartures`)
        return rsp.data
    }
    
    /**
     * Get the flight options for a departure
     * 
     * @param searchId ID of the result set, created with {@link search}
     * @param resultId ID of the result item, found with {@link departures}
     */
    public async flights(searchId: string, resultId: string): Promise<Array<Flight>> {
        const rsp = await this.axios.get<Array<Flight>>(`/toursSearch/searches/${searchId}/tourDepartures/${resultId}/flightgroups`)
        return rsp.data
    }

    /**
     * Get accommodation
     * 
     * @param searchId ID of the result set, created with {@link search}
     * @param resultId ID of the result item, found with {@link departures}
     */
    public async accommodation(searchId: string, resultId: string): Promise<Array<AccommodationUnit>> {
        return (await this.axios.get<Array<AccommodationUnit>>(`/toursSearch/searches/${searchId}/tourDepartures/${resultId}/accommodationUnits`)).data
    }
}

export interface AccommodationUnit extends LinkedObject {
    readonly Id: string
    SetupId: number
    Name: string
    UnitDescription: string
    Reference: string
    UnitName: string
    UnitNumber: string
    UnitType: string
    BedType: string
    Occupancy: Occupancy
    AdultOccupancy: Occupancy
    ChildOccupancy: Occupancy
    InfantOccupancy: Occupancy
    StandardOccupancy: number
    Source: string
    AccommodationUnitReference: string
    Duration: DateRange
    Pricing: FlightPricing
    InventoryDetails: Inventory
    Accommodation: Accommodation
    IsMandatory: boolean
    IsDefault: boolean
    BoardBasisBreakdown: Array<BoardBasis>
}

export interface BoardBasis {
    Name: string
    Reference: string
    Description: string
    StartDate: Date
    EndDate: Date
}

export interface Accommodation extends LinkedObject {
    SetupId: number
    Reference: string
    Name: string
    Type: string
}

export interface Occupancy {
    From: number
    To: number
}

export interface Departure extends LinkedObject {
    readonly Id: string
    SetupId: number
    Name: string
    Reference: string
    Duration: DepartureDuration
    Pricing: DeparturePricing
    Warnings: Array<Warning>
    Tour: Tour
    StartLocationId: number
    EndLocationId: number
    Tags: Array<string>
    AllocationOnRequest: boolean
}

export interface Tour extends LinkedObject {
    SetupId: number
}

export interface DeparturePricing {
    TotalPrice: Price
    WasPrice: Price
}

export interface DepartureDuration {
    Days: number
    NightS: number
    Description: string
    From: Date
    To: Date
}

export interface TourSearchRequest {

    /**
     * ID of the reservation to make the search against
     */
    ReservationId: number

    /**
     * SKU/Reference of the tour to search for
     */
    TourReference?: string

    /**
     * Range of dates to search for departures in
     */
    DateRange: DateRange

    /**
     * List of promotional codes to apply to pricing
     */
    PromotionalCodes?: Array<string>

    /**
     * Sales channel to use against the search
     */
    SalesChannel: string
}

export interface TourSearchResponse extends LinkedObject {
    /**
     * ID of the search result set, entries are only valid in context of this ID
     */
    Id: string

    /**
     * ID of the reservation the search was run against
     */
    ReservationId: number

    /**
     * Number of departures found
     */
    TourDeparturesCount: number
}

export interface Flight {
    Id: string
    MasterGRoupId: number
    RateOption: "Default" | "Optional"
    MoreSeatsEnabled: boolean
    Flights: Array<FlightLeg>
}

export type TransportMode = "Flight"

export interface FlightLeg extends LinkedObject {
    Id: string
    FlightNumber: string
    SetupId: number
    DepartureDatetime: Date
    DepartureAirport: string
    ArrivalAirport: string 
    ArrivalDateTime: Date
    TransportMode: TransportMode
    Seat: string
    InventoryDetails: Inventory
    Pricing: FlightPricing
    OperatingCarrier: FlightCarrier
    IsMandatory: boolean
    IsDefault: boolean
}

export interface FlightCarrier {
    Name: string
    Reference: string
}

export interface Inventory {
    Available: number
    IsOnRequest: boolean
    IsFreeSell: boolean
    IsClosed: boolean
}


export interface FlightPricing {
    TotalPrice: Price
    WasPrice: Price
    OverrideRules: OverrideRules | null
}

export type OverrideRuleType = "PerPerson"

export interface OverrideRules {
    Type: OverrideRuleType
    AdultPrice: Price
    ChildPrice: Price
    InfantPrice: Price
    UnitPrice: Price
}