Tigerbay JS
===========

[![NPM Package](https://img.shields.io/npm/v/tigerbay)](https://https://www.npmjs.com/package/tigerbay)



JavaScript API Client for [TigerBay](https://www.tigerbay.co.uk/).
This API is designed primarily for use in NodeJS but can be used in the browser.

The API is built with TypeScript and so typings are provided out-of-the-box.


# Usage

### Simple Example (Javascript)

````javascript
import * as TigerBay from 'tigerbay';

// Get the credentials from `TB_CLIENT_ID` and `TB_CLIENT_SECRET`
const credentials = TigerBay.Auth.EnvCredentials();

const client = new TigerBay.Client({
    baseUrl: 'yourdomain.ontigerbay.com',
    credentials: credentials
});

// Get a booking
client.Reservations.find('booking_ref').then(booking => {
    console.log(`Booking Get`);
}).catch(error => {
    console.error(`Unable to get booking: ${error.message}`)
});
````

## Credential Providers

Authentication credentials (`client_id` and `client_secret`) are given to the `Client` through a
`CredentialProvider`, which is a function returning a promise of credentials.
The type signature for a provider is:

`async (): Promise<ClientCredentials>`

The following credential providers are provided out-of-the-box:

### `ConstantCredentials`
Takes in a set of credentials and creates a provider which will always return those credentials.

````javascript
const credentials = TigerBay.Auth.ConstantCredentials({clientId: 'client_id', clientSecret: 'client_secret'})
````

### `EnvCredentials`
Gets the credentials from the process environment. An optional prefix can be given and defaults to `TB`

````javascript
// Uses `REX_CLIENT_ID` and `REX_CLIENT_SECRET`
const credentials = TigerBay.Auth.EnvCredentials('REX');
````

## Resources

The API surface is broken down into resource-oriented modules. These modules are accessed through
a [`TigerBay.Client`](https://mrzen.github.io/tigerbay-js/classes/_client_.client.html) instance.


## Interceptors

The API client is built on [Axios](https://github.com/axios/axios) and exposes methods to add or
remove request and response interceptors:

* [`onRequest`](https://mrzen.github.io/tigerbay-js/classes/_client_.client.html#onrequest) 
* [`onResponse`](https://mrzen.github.io/tigerbay-js/classes/_client_.client.html#onresponse)