import { APIGroup } from "./common";

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

export default class SetupAPI extends APIGroup {
    public async marketingSources(): Promise<MarketingSource[]> {
        return (await this.axios.get<MarketingSource[]>(`/setup/marketingSources`)).data
    }
}