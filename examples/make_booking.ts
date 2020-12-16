import * as TigerBay from '../src/client'


const credentials = TigerBay.Auth.ConstantCredentials({clientId: 'website', clientSecret: 'Secret'});


const client = new TigerBay.Client({
    baseUrl: 'https://hfholidays-preview.ontigerbay.co.uk/nimble',
    authUrl: 'https://hfholidays-preview.ontigerbay.co.uk',
    credentials: credentials,
})


client.getReservation('4092').then(res => {
    console.log("Got reservation")
    console.log(res)
}).catch(err => {
    console.error(`Unable to get reservation: ${err.message}`)
    console.info(err);
})