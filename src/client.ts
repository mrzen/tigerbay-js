import { Reservations } from './models'
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { USER_AGENT } from './user_agent'
import * as Auth from './auth'
import { Reservation } from './models/reservations'


export * as Auth from './auth'

/**
 * Base Client for TigerBay reservation system
 */
export class Client {

    private config: ClientConfig

    public axios: AxiosInstance

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
     * Create a new Reservation
     * 
     * @param params Reservation Parameters
     * 
     */
    public async createReservation(params: Reservations.CreateReservationRequest): Promise<Reservations.Reservation> {
        const rsp = await this.axios.post<Reservations.Reservation>("/sales/reservations/", params)
        return rsp.data
    }

    public async getReservation(id: string): Promise<Reservations.Reservation> {
        const rsp = await this.axios.get<Reservations.Reservation>(`/sales/reservations/${id}`)
        return rsp.data
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

