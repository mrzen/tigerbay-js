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
        return (await this.axios.get(`${this.path}/Contacts`))
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