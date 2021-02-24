import * as TigerBay from '../src/client'
import * as AxiosLogger from 'axios-logger'

async function searchTours(): Promise<TigerBay.Models.Cache.Departure[]> {

    const credentials = TigerBay.Auth.ConstantCredentials({ clientId: 'website', clientSecret: 'Secret' })
    const client = new TigerBay.Client({
        baseUrl: 'https://hfholidays-preview.ontigerbay.co.uk/nimble',
        authUrl: 'https://hfholidays-preview.ontigerbay.co.uk',
        credentials: credentials,
    })

    client.onRequest(AxiosLogger.requestLogger)

    return await client.cache.search({
        serviceDateRange: {
            from: new Date()
        },
        currencyCode: 'GBP'
    })
}

searchTours().then(departures => {
    console.log(`Got ${departures.length} departures`)

    departures.forEach( departure => {
        let { Code, id, StartDate, EndDate, PerPersonGroupTravellerTotalPrice } = departure;

        console.log( { Code, id, StartDate, EndDate, PerPersonGroupTravellerTotalPrice })
    })
}).catch(error => {
    console.error(`Unable to search departures: ${error.message}`)
})