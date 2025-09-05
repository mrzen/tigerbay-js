import { APIGroup, LinkedObject } from "./common";

export interface Agent extends LinkedObject {
  Id: number
  Name: string
  Reference: string
  Type: string
  Tags: string
  DefaultCurrencyCode: string
  GroupId: number
  IsArchived?: boolean
  CommissionMode?: number
  BillingType?: string
  VatNumber?: string
  ExternalReference?: string
}

export interface AgentStaff extends LinkedObject {
  Id: number
  Name: string
  Reference: string
  Email: string
}

export class AgentApi extends APIGroup {
  /**
   * Get agents
   */
  public async agents(): Promise<Array<Agent>> {
    return (await this.axios.get<Array<Agent>>('/sales/agents')).data
  }

  /**
   * Get agent detail
   */
  public async agent(id: number): Promise<Agent> {
    return (await this.axios.get<Agent>(`/sales/agents/${id}`)).data
  }

  /**
   * Get agent staff members
   */
  public async agentStaff(id: number): Promise<AgentStaff> {
    return (await this.axios.get<AgentStaff>(`/sales/agents/${id}/staff`)).data
  }
}