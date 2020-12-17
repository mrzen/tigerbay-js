import * as TigerBay from '../src/client'
import * as AxiosLogger from 'axios-logger'
import Faker from 'faker'
import { Passenger } from '../src/models/reservations';

async function makeBooking(): Promise<TigerBay.Reservations.Reservation> {

    const today = new Date();
    const credentials = TigerBay.Auth.ConstantCredentials({ clientId: 'website', clientSecret: 'Secret' });

    const client = new TigerBay.Client({
        baseUrl: 'https://hfholidays-preview.ontigerbay.co.uk/nimble',
        authUrl: 'https://hfholidays-preview.ontigerbay.co.uk',
        credentials: credentials,
    })

    client.onRequest(AxiosLogger.requestLogger);
    // client.onResponse(AxiosLogger.responseLogger);

    let booking = await client.reservations.create({ BrandChannelId: 8, Currency: "GBP" });

    const passengers: Array<Passenger> = [await client.reservations.addPassenger(booking.BookingReference, {
        IsLead: true,
        DateOfBirth: new Date( today.getFullYear() - 32, today.getMonth(), today.getDay()),
        Forename: Faker.name.firstName(),
        Surname: Faker.name.lastName(),
        Type: "Adult",
        Title: Faker.name.prefix()
    })]

    for(let i = 0; i < 3; i++) {
        const dob = new Date(today.getFullYear() - Math.ceil(Math.random()*60), Math.floor(Math.random()*12), Math.floor(Math.random()*30) )

        passengers.push( await client.reservations.addPassenger(booking.BookingReference, {
            IsLead: false,
            DateOfBirth: dob,
            Forename: Faker.name.firstName(),
            Surname: Faker.name.lastName(),
            Type: dob.getFullYear() < (today.getFullYear() - 18) ? "Adult": "Child",
            Title: Faker.name.prefix()
        }))
    }

    const search = await client.tours.search({
        ReservationId: booking.Id,
        TourReference: 'POLCL',
        SalesChannel: "Web",
        DateRange: {
            From: new Date("2021-05-17"),
            To: new Date("2021-05-17")
        }
    });

    if (search.TourDeparturesCount == 0) {
        throw new Error(`No departures found for search`)
    }

    const departure = (await client.tours.departures(search.Id))[0];

    // const flights = await client.tours.flights(search.Id, departure.Id);

    // const defaultFlight = flights.filter(flight => flight.RateOption === "Default")[0]

    // // await client.reservations.assign(search.Id, departure.Id, {
    // //     "FlightGroups": [{
    // //         ComponentId: defaultFlight.Id,
    // //         PassengerIds: passengers.map(p => p.Id)   
    // //     }]
    // // })

    const accommodation = await client.tours.accommodation(search.Id, departure.Id)

    const defaultAccommodation = accommodation.filter(a => a.IsDefault)[0];

    client.reservations.assign(search.Id, departure.Id, {
    })

    
    return await client.reservations.find(booking.BookingReference);
}


makeBooking().then(booking => {
    console.log(`Created booking: ${booking.BookingReference}`)
    console.log(`Total Price: ${booking.TotalPrice.Value}`)
}).catch(error => {
    console.error(`Unable to create booking: ${error.message}`)

    console.log(error.response);
})