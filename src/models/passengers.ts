import { AxiosInstance } from "axios";
import { APIGroup } from "./common";
import { CustomerContact } from "./customers";

export class PassengerAPI extends APIGroup {
    private booking: number;
    private id: number;

    constructor(axios: AxiosInstance, booking: number, passenger: number) {
        super(axios)
        this.booking = booking
        this.id = passenger
    }

    public async getApis(): Promise<PassengerAPIS> {
        return (await this.axios.get(`${this.path}/Apis`)).data
    }


    public async contacts(): Promise<CustomerContact[]> {
        return (await this.axios.get(`${this.path}/Contacts`)).data
    }

    public async addContact(contact: Omit<CustomerContact, 'Id'>): Promise<CustomerContact> {
        return (await this.axios.post(`${this.path}/contacts`, contact)).data
    }

    public async updateContact(id: number, contact: Omit<CustomerContact, 'Id'>): Promise<CustomerContact> {
        return (await this.axios.put(`${this.path}/contacts/${id}`, contact)).data
    }

    public async insurances(): Promise<Insurance[]> {
        return (await this.axios.get(`${this.path}/insurances`)).data
    }

    public async addInsurance(insurance: Omit<Insurance, 'Id'>): Promise<Insurance> {
        return (await this.axios.post(`${this.path}/insurances`, insurance)).data
    }

    public async updateInsurance(id: number, insurance: Omit<Insurance, 'Id'>): Promise<Insurance> {
        return (await this.axios.put(`${this.path}/insurances/${id}`, insurance)).data
    }

    /**
     * Update the passenger APIS details.
     * Merges the given APIs details with the existing ones.
     * Any properties in `updates` which are null or undefined will be unchanged.
     */
    public async updateApis(updates: Partial<PassengerAPIS>): Promise<void> {
        const existing = await this.getApis()
        const payload = { ...updates, ...existing }

        await this.axios.put(`${this.path}/apis`, payload)
    }

    /**
     * Get the path to the current passenger resource.
     */
    public get path(): string {
        return `/reservations/${this.booking}/passengers/${this.id}`
    }
}


export interface PassengerAPIS {
    DocumentType: string;
    DocumentNumber: string;
    Nationality: string;
    PlaceOfIssue: string;
    CountryOfResidence: string;
    IssueDate: string;
    ExpiryDate: string;
    DateOfBirth: string;
    PlaceOfBirth: string;
}

export interface Insurance {
    Id: number;
    CompanyName: string;
    CompanyNumber: string;
    NextOfKin: string;
    NextOfKinRelationship: string;
    EmergencyNumber: string;
    PolicyNumber: string;
    Description: string;
    StartDate: string | Date;
    EndDate: string | Date;
    CreatedDate: string | Date;
    TermsAccepted: boolean;
    IsArchived: boolean;
}