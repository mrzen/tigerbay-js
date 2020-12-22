import { APIGroup, Link, LinkedObject } from "./common";

export interface CreateTaskRequest {
    TaskType: TaskTypeName
    Description: string
    AssignedToUserID?: number
    AssignedToUserGroupID?: number
    ActionDate?: Date 
}

export type TaskTypeName =   "Email" | "PhoneCall" | "Post" | "Meet" | "System"
                           | "InternalProcess" | "Audit" | "SupplierAgreement"
                           | "FlightOnRequestTask"

export interface TaskType {
    ID: number
    Name: TaskTypeName
}

export interface Task extends LinkedObject {
    ID: number
    Description: string
    Status: "Late"
    TaskType: TaskType
    DueDateTime?: Date
    LastModifiedDate: Date
}


export class Api extends APIGroup {

    /**
     * Create a new task for a reservation
     * 
     * @param reservationId ID of the booking to add the task to
     * @param task Details of the new task to add
     */
    public async create(reservationId: string, task: CreateTaskRequest): Promise<Task> {
        const rsp = await this.axios.post<Task>(`/sales/reservations/${reservationId}/tasks`, task) 
        return rsp.data
    }

    /**
     * List tasks for a reservation
     * 
     * @param reservationId ID of the booking to list tasks for
     * @returns List of tasks for the booking
     */
    public async list(reservationId: string): Promise<Array<Task>> {
        const rsp = await this.axios.get<Array<Task>>(`/sales/reservations/${reservationId}/tasks`)
        return rsp.data
    }
}