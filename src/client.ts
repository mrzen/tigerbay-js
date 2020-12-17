import { Notes, Reservations, Tasks, Tours } from './models'
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { USER_AGENT } from './user_agent'
import * as Auth from './auth'
export * from './models'
export * as Auth from './auth'

/**
 * Base Client for TigerBay reservation system
 */
export class Client {

    /**
     * Client configuration parameters
     */
    private config: ClientConfig

    /**
     * Underlying Axios HTTP client. 
     */
    protected axios: AxiosInstance

    constructor(config: ClientConfig) {
        this.config = config
        this.axios = Axios.create()

        this.axios.defaults.baseURL = config.baseUrl.toString()
        this.axios.defaults.timeout = this.config.timeout
        this.axios.defaults.responseType = 'json'
        this.axios.defaults.paramsSerializer = JSON.stringify
        this.axios.defaults.headers = { 
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }

        const authUrl = (config.authUrl || config.baseUrl).toString()

        this.axios.interceptors.request.use(Auth.Authentication(authUrl, config.credentials))
    }

    /**
     * Access Reservation-related API actions
     */
    public get reservations(): Reservations.Api {
        return new Reservations.Api(this.axios)
    }

    /**
     * Access Task-related API actions
     */
    public get tasks(): Tasks.Api {
        return new Tasks.Api(this.axios)
    }

    /**
     * Access Tour-releated API actions
     */
    public get tours(): Tours.Api {
        return new Tours.Api(this.axios);
    }

    /**
     * Access Note-related API actions
     */
    public get notes(): Notes.Api {
        return new Notes.Api(this.axios)
    }

    /**
     * Add a new interceptor before a request is sent
     * 
     * @param func Function for request fufillment
     * @returns Handle for interceptor, used with {@link ejectOnRequest}
     */
    public onRequest(func: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>): number {
        return this.axios.interceptors.request.use(func)
    }

    /**
     * Add a new intercepter for responses
     * 
     * @param onFulfilled Callback when a response is received
     * @param onRejected Callback for when a response fails
     * 
     * @returns Handle for interceptor, used with {@link ejectOnResponse}
     */
    public onResponse(onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>, onRejected?: (error: any) => any): number {
        return this.axios.interceptors.response.use(onFulfilled, onRejected)
    }

    public ejectOnResponse(handle: number): void {
        this.axios.interceptors.response.eject(handle)
    }

    /**
     * Eject in interceptor from the request
     * 
     * @param id Handle of the interceptor to remove
     */
    public ejectOnRequest(id: number): void {
        this.axios.interceptors.request.eject(id)
    }

}

/**
 * API Client Configuration
 * 
 */
export interface ClientConfig {

    /**
     * Base URL for the API
     */
    baseUrl: string | URL


    /**
     * Authentication URL -  Set this if different to baseUrl
     */
    authUrl?: string | URL | undefined


    /**
     * Optional timeout
     */
    timeout?: number


    /**
     * Credentials
     */
    credentials: Auth.CredentialsProvider
}

