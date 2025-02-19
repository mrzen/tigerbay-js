import { APIGroup, LinkedObject } from "./common";

export interface MarketingSource {
    Id: number
    Name: string
    Description: string
    Subsources: MarketingSubsource[]
}

export interface MarketingSubsource {
    Id: number
    Name: string
    Description: string
    APIVisible: boolean
}

export interface Location extends LinkedObject {
    Id: number
    Name: string
    Reference: string
    Type: string
    IsDomestic: boolean
}

export default class SetupAPI extends APIGroup {
    public async marketingSources(): Promise<MarketingSource[]> {
        return (await this.axios.get<MarketingSource[]>(`/setup/marketingSources`)).data
    }

    public async tourLocations(tourId: number): Promise<Location[]> {
        return (await this.axios.get<Location[]>(`/setup/tours/${tourId}/locations`)).data
    }
}