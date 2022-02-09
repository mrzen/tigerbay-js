import { AxiosInstance } from "axios";

/**
 * A reference to additional data available
 */
export interface Link {
    Rel: string
    Href: string
    Method: string
}

export interface LinkedObject {
    Links: Array<Link>
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


export type PatchOperation = 'replace'

/**
 * Descriptor of an update operation to be made against a reservation
 */
export interface PatchPayload {
    /**
     * Value to set/add
     */
    value: any

    /**
     * Path to the target field
     */
    path: string

    /**
     * Operation to perform
     */
    op: PatchOperation
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
