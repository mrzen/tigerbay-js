import Axios, { AxiosRequestConfig } from "axios"
import { USER_AGENT } from "./user_agent"
import * as qs from 'qs'

export interface Response {
    access_token: string
    expires_in: number
    token_type: TokenType
}

export interface Request {
    client_id: string
    client_secret: string
    grant_type: GrantType
}

export enum GrantType {
    CLIENT_CREDENTIALS = "client_credentials"
}

export enum TokenType {
    BEARER = "Bearer"
}


export function Authentication(baseUrl: string, provider: CredentialsProvider) {

    let token: string | undefined = undefined
    let tokenExpires: Date | undefined = undefined

    return async function(req: AxiosRequestConfig): Promise<AxiosRequestConfig> {

        if (token && tokenExpires && tokenExpires > new Date() ) {
            req.headers.Authorization = `bearer ${token}`

            return req
        }

       const credentials = await provider()

       const body: Request = {
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret,
            grant_type: GrantType.CLIENT_CREDENTIALS  
       }

       const params: AxiosRequestConfig = {}
       params.responseType = 'json'
       params.headers ||= {}
       params.headers['User-Agent'] = USER_AGENT
       params.headers['Content-Type'] = 'application/x-www-form-urlencoded'
       params.transformRequest = qs.stringify


       // Perform the token request in the global Axios instance to avoid interceptor recursion
       const rsp = await Axios.post<Response>(baseUrl + '/auth/web/connect/token', body, params)

       token = rsp.data.access_token
       tokenExpires = new Date( new Date().getTime() + rsp.data.expires_in * 1000 )

       req.headers.Authorization = `bearer ${token}`
       return req
    }
}

/**
 * A Credentials provider is a function which promises client credentials
 */
export type CredentialsProvider = () => Promise<ClientCredentials>


/**
 * ConstantCredentials creates a new CredentialsProvider which always returns the credentials
 * used to create it.
 * 
 * @param credentials Static credentials to return
 */
export function ConstantCredentials(credentials: ClientCredentials): CredentialsProvider {
    const f = async (): Promise<ClientCredentials> => {
        return credentials 
    }

    return f
}

/**
 * EnvCredentials creates a CredentialsProvider which fetches credentials from the process environment
 * 
 * @param prefix Environment prefix (default: `TB`)
 */
export function EnvCredentials(prefix: string = 'TB'): CredentialsProvider {
    return async (): Promise<ClientCredentials> => {

        const clientId =  process.env[`${prefix}_CLIENT_ID`]

        if (!clientId) {
            throw new Error(`Client ID not set in ${prefix}_CLIENT_ID`)
        }

        const secret = process.env[`${prefix}_CLIENT_SECRET`]

        if (!secret) {
            throw new Error(`Client Secret not set in ${prefix}_CLIENT_SECRET`)
        }

        const c: ClientCredentials = {
            clientId: clientId,
            clientSecret: secret
        }

        return c

    }
}


/**
 * API Client Credentials
 */
export interface ClientCredentials {
    /**
     * API Client ID
     */
    clientId: string

    /**
     * API Client Secret
     */
    clientSecret: string
}