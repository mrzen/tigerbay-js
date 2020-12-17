import { AxiosInstance } from "axios";

/**
 * A reference to additional data available
 */
export interface Link {
    Rel: string
    Href: string
    Method: string
}



/**
 * A timespan between two dates
 */
export interface DateRange {
    From: Date
    To: Date
}

/**
 * Warning
 */
export interface Warning {
    Title: string
    Message: string
}


export interface PassengerAssignment {
    ComponentId: string
    PassengerIds: Array<number>
}

/**
 * Represents a group of actions in the API
 */
export abstract class APIGroup {

    protected axios: AxiosInstance

    constructor(axios: AxiosInstance) {
        this.axios = axios
    }
}
