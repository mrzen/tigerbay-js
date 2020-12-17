import { APIGroup } from "./common";

export type NoteType = "SpecialRequest" | "Amendment" | "Diet" | "Medical" | "CustomerFeedback" 
                     | "Complaint" | "ChildCare" | "TermsAndConditions" | "Insurance" 
                     | "AccessCode" | "ArrivalTime" | "Generic" | "FlightNotes" 
                     | "FlightNotesManual" 
                     | "Membership" | "EveOfDeparture" | "FinalDocuments" 
                     | "SailingQualification" | "Representative" | "CreditControl" 
                     | "PassportAndVisaInformation" | "ImportantInformation" | "Recommended"

export interface Note {
    Type: NoteType
    Title: string
    Text: string
}

export class Api extends APIGroup {
    
}