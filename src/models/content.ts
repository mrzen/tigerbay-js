import { AxiosInstance } from "axios";
import { APIGroup, LinkedObject } from "./common";


export default class ContentAPI extends APIGroup {
    private bundleReference: string;

    constructor(axios: AxiosInstance, bundleReference: string) {
        super(axios)
        this.bundleReference = bundleReference
    }

    async content(): Promise<ContentBundle> {
        return (await this.axios.get(`/cms/contentBundles/${this.bundleReference}`)).data
    }
}

export interface ContentBundle {
    Attributes: ContentAttribute[]
    Files: ContentFile[]
}

export interface ContentAttribute {
    Key: string
    Value: string
}

export interface ContentFile extends LinkedObject {
    ID: number
    Description: string
    Tags: string[]
    LinkDetail: {
        Reference: string
        Description: string
        SortOrder: number
        Tags: string[]
    }
}