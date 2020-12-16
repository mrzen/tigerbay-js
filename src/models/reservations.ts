import { Link } from "./common";

export interface CreateReservationRequest {
    BrandChannelId: number
    Currency: string
}

export interface Reservation {
    Id: number
    BookingReference: string
    PartialToken: string
    CurrencyCode: string
    CustomerId: number
    AgentId: number
    StartDate: Date
    EndDate: Date
    ConfirmedDate: Date
    AdultCount: number
    ChildCount: number
    InfantCount: number
    BrandChannelId: number
    BalanceDue: Date
    LocationId: number
    SalesChannelId: number
    ConditionsAccepted: boolean
    TotalPrice: Price
    Deposit: Price
    OutstandingBalance: Price
    Commission: Price
    Vat: Price
    AgentBalance: Price
    CustomerBalance: Price
    QuotedByUserId: number
    OwnerUserId: number
    Status: string
    PrincipalComponentId: number
    PrincipalComponentName: string
    Links: Array<Link>
}

export interface Price {
    CurrencyCode: string
    CurrencyDetails: CurrencyDetails
    Value: number
    HtmlFormat: string
}

export interface CurrencyDetails {
    Code: string
    Name: string
    DefaultRate: number
    FullName: string
}