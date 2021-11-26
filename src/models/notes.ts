import { AxiosError } from "axios";
import { APIGroup, LinkedObject } from "./common";

export type NoteType = "SpecialRequest" | "Amendment" | "Diet" | "Medical" | "CustomerFeedback" 
                     | "Complaint" | "ChildCare" | "TermsAndConditions" | "Insurance" 
                     | "AccessCode" | "ArrivalTime" | "Generic" | "FlightNotes" 
                     | "FlightNotesManual" 
                     | "Membership" | "EveOfDeparture" | "FinalDocuments" 
                     | "SailingQualification" | "Representative" | "CreditControl" 
                     | "PassportAndVisaInformation" | "ImportantInformation" | "Recommended"

export interface Note extends LinkedObject {
    Id: number
    Type: NoteType
    Title: string
    Text: string
}

export interface NotePayload {
    Type: NoteType
    Title: string
    Text: string
}

export class Api extends APIGroup {


    /**
     * Add a note to a resource.
     * 
     * This method accepts any {@link LinkedObject} as a resource to attach a note to and will
     * determine how to add the note based on the resource's `self` link.
     * 
     * Not all {@link LinkedObject}s support notes and an error is thrown if the given resource
     * does not support links.
     * 
     * @param thing Resource to attach a note to
     * @param note Note to create
     */
    public async add(thing: LinkedObject, note: NotePayload): Promise<void> {
        const selfLink = thing.Links.find(link => link.Rel == "self");

        if (!selfLink ) {
            throw new Error("Unable to find self-link for given object")
        }

        try {
            await this.axios.post(`${selfLink}/notes`, note)
        } catch(error) {
            const err = error as AxiosError

            if (err.response?.status === 404) {
                throw new Error("Specified resource does not support notes")
            }
        }
    }

    /**
     * List notes for a resource
     * 
     * @param thing Resource to list notes for
     */
    public async list(thing: LinkedObject): Promise<Array<Note>> {
        const selfLink = thing.Links.filter(link => link.Rel == "self");

        if (selfLink.length !== 1) {
            throw new Error("Unable to find self-link for given object")
        }

        let notes: Array<Note> = []

        try {
            notes = (await this.axios.get<Array<Note>>(`${selfLink[0]}/notes`)).data
        } catch(error) {
            const err: AxiosError = error

            if (err.response?.status === 404) {
                throw new Error("Specified resource does not support notes")
            }
        }

        return notes
    }
    
}