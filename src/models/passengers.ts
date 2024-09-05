import { AxiosInstance } from "axios";
import { APIGroup, PatchPayload } from "./common";
import { CustomerContact } from "./customers";
import { Note } from "./notes";
import { AddNoteRequest } from "./reservations";

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
    
    /**
     * Update the passenger APIS details.
     */
    public async updateApis(updates: PassengerAPIS): Promise<void> {
        await this.axios.put(`${this.path}/apis`, updates)
    }

    /**
     * List customer contacts
     * 
     * @returns List of passenger contacts
     */
    public async contacts(): Promise<CustomerContact[]> {
        return (await this.axios.get(`${this.path}/Contacts`)).data
    }

    /**
     * Add a new contact to a passenger
     *  
     * @param contact New contact details
     * @returns New contact
     */
    public async addContact(contact: Omit<CustomerContact, 'Id'>): Promise<CustomerContact> {
        return (await this.axios.post(`${this.path}/contacts`, contact)).data
    }

    /**
     * Delete a contact from a passenger
     * 
     * @param id ID of the contact to delete
     */
    public async deleteContact(id: number): Promise<void> {
        return (await this.axios.delete(`${this.path}/contacts/${id}`))
    }

    /**
     * Update a passenger contact
     * 
     * @param id ID of the contact to update
     * @param updates List of updates to perform on the contact
     * @returns 
     */
    public async updateContact(id: number, updates: PatchPayload[]): Promise<CustomerContact> {
        return (await this.axios.patch(`${this.path}/contacts/${id}`, updates)).data
    }

    public async insurances(): Promise<Insurance[]> {
        return (await this.axios.get(`${this.path}/insurances`)).data
    }

    public async addInsurance(insurance: Omit<Omit<Insurance, 'Id'>, 'CreatedDate'>): Promise<Insurance> {
        return (await this.axios.post(`${this.path}/insurances`, insurance)).data
    }

    public async deleteInsurance(id: number): Promise<void> {
        return (await this.axios.delete(`${this.path}/insurances/${id}`))
    }


    public async notes(): Promise<Note[]> {
        return (await this.axios.get(`${this.path}/notes`)).data
    }

    public async addNote(note: AddNoteRequest): Promise<Note> {
        return (await this.axios.post(`${this.path}/notes`, note)).data
    }

    public async deleteNote(id: number): Promise<void> {
        return (await this.axios.delete(`${this.path}/notes/${id}`))
    }

    /**
     * Get the path to the current passenger resource.
     */
    public get path(): string {
        return `/sales/reservations/${this.booking}/passengers/${this.id}`
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
    ExpiryDate: string | Date;
    CreatedDate: string | Date;
    TermsAccepted: boolean;
    IsArchived: boolean;
}