import qs from "qs";
import { APIGroup } from "./common";
import { AccommodationUnit, Inventory } from "./tours";

export default class CacheApi extends APIGroup {
    public async search(params: CacheSearchRequest): Promise<Departure[]> {
        const query = qs.stringify({searchQuery: params}, {
            skipNulls: true,
        })

        return (await this.axios.get(`/toursearch/departures?${query}`)).data
    }

    public async status(): Promise<CacheStats> {
        return (await this.axios.get('/toursearch/cache/status')).data
    }

    public async find(id: string): Promise<Departure> {
        return (await this.axios.get<Departure>(`/toursearch/departures/${id}`)).data;
    }
}

export interface CacheStats {
    ItemCount: number,
    AverageAgeSeconds: number
}

export interface CacheSearchRequest {
    departureSetupId?: number
    serviceDateRange?: {
        from?: Date
        to?: Date
    }
    priceRange?: {
        from?: number
        to?: number
    }
    adultCount?: number
    tourName?: string
    tourCode?: string
    accommodation?: number
    location?: number
    extra?: number
    tags?: string[]
    departurePoints?: number[]
    locations?: number[]
    extras?: number[]
    years?: number[]
    months?: number[]
    passengercount?: number[]
    currencyCode?: string
}

export interface DeparturePrice {
    Value: number
    CurrencyCode: string
}

export interface FlightStop {
    SetupId: number
    Name: string
    Reference: string
    Type: string
    IsDomestic: boolean
}

export interface Flight {
    SetupId: number
    InventorySummary: Inventory
    PriceSummary: { AdultPrice: DeparturePrice }
    DepartureAirport: FlightStop
    ArrivalAirport: FlightStop
    DepartureDateTime: string
    ArrivalDateTime: string
    FlightNumber: string
    IsEndPoint: boolean
    TransportMode: string
    CabinClass: string
    IsOutOfRange: boolean
    Source: string
}

export interface FlightGroup {
    SetupId: number
    IsDefault: boolean
    IsMandatory: boolean 
    IsInternal: boolean
    IsDomestic: boolean
    MoreSeatsSources: never[]
    PriceSummary: {
        AdultPrice: DeparturePrice
    }
    Flights: Flight[]
}

export interface Departure {
    Id: string
    RefreshId: string
    DepartureSetupId: number
    PriceSetId: number
    TourId: number
    Generated: string | Date
    Name: string
    Code: string
    StartDate: string | Date
    EndDate: string | Date
    Duration: number
    InventorySummary: Inventory
    SingleTravellerUnits: AccommodationUnit[]
    GroupTravellerUnits: AccommodationUnit[]
    TourPrice: DeparturePrice
    PerPersonSingleTravellerTotalPrice: DeparturePrice
    PerPersonGroupTravellerTotalPrice: DeparturePrice
    MinimumSingleRooms: number
    MinimumTwinRooms: number
    MinimumTripleRooms: number
    Tags: string[]
    IsGuaranteed: boolean
    IsCancelled: boolean
    Ttl: number
    FlightGroups: FlightGroup[]
    LinkedCustomers: DepartureLinkedCutomer[]
}

export interface DepartureLinkedCutomer {
    Id: number
    Title: string
    Forename: string
    Surname: string
    Type: string
}
