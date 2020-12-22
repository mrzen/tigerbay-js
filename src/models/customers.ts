import qs from "qs";
import { APIGroup, Link, LinkedObject } from "./common";

export interface CustomerSearchRequest {
    username?: string
    email?: string
    surname?: string
    postCode?: string
    dateOfBirth?: Date
}

export type Gender = "NotSet" | "Male" | "Female"

export interface Customer extends LinkedObject {
    Id: number
    Title: string
    Forename: string
    Surname: string
    Gender: Gender
    Username: string
    EmailAddress: string
    DateOfBirth: Date
    Tags: string
    AgentId: number
    DoNotEmail: boolean
    DoNotMail: true
    Reference: string
    ExternalReference: string
}

export interface CreateCustomerRequest {
    Username?: string
    Title: string
    Forename: string
    Surname: string
}

export type ContactType = "Primary"

export interface CustomerContact {
    Title: string
    Forename: string
    Surname: string
    Address0?: string
    Address1?: string
    Address2?: string
    Address3?: string
    TownCity?: string
    County?: string
    PostCode?: string
    Country?: string
    PersonalMobile?: string
    PersonalLandline?: string
    PersonalEmail?: string
    BusinessMobile?: string
    BusinessLandline?: string
    BusinessEmail?: string
    Type: ContactType
    Description?: string
}

export class Api extends APIGroup {

    /**
     * Search existing customers
     * 
     * @param params Search query parameters
     */
    public async search(params: CustomerSearchRequest): Promise<Array<Customer>> {

        const query = qs.stringify({search: params})

        return (await this.axios.get<Array<Customer>>(`/sales/customers/search?${query}`)).data
    }

    /**
     * Create a new customer
     * 
     * @param params Customer information
     */
    public async create(params: CreateCustomerRequest): Promise<Customer> {
        return (await this.axios.post<Customer>(`/sales/customers`, params)).data
    }

    public async createContact(customerId: number, contact: CustomerContact): Promise<Customer> {
        return (await this.axios.post<Customer>(`/sales/customers/${customerId}/contacts`, contact)).data
    }
}