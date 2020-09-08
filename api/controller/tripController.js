const Trip = require("../models/trip")
const User = require("../models/user")
const Flight = require("../models/flight")

const mongoose = require("mongoose")
const flightStatsApi = require("../service/flightStatsApi")

exports.removeItem = async (req, res, next) => {
    const id = req.params.id;
    const type =  req.params.type;
    
    if (type == "flight") {
        await Flight.deleteOne({ _id: id }, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    res.status(200).json({
        "status": "OK",
        "message": "Item removed",
    });
}

exports.addNewItem = async (req, res, next) => {
    
    const tripId = req.body.tripId
    const item = req.body.item
    const userId = req.body.userId

    const user = await User.findById(userId)
    if (user === null) {
        res.status(300).json({
            "status": "NOK",
            "message" : 'Unable to find user by id',
        });
    }
    
    var trip = await Trip.findById(tripId)

    if (trip === null) {
        trip = new Trip({
            _id: new mongoose.Types.ObjectId(),
            name: 'Name your trip',
            _creator: user._id
        })
        trip.save().then().catch(err => {
            console.log(err)
            res.status(300).json({
                "status": "NOK",
                "message": "Failed to find your flight. Please verify if you filled in the correct flight details and try again.",
            });
        })
    }
    

    if (item.itemType == "flight") {
        var flightBumber = item.flightNumber.replace(/ /g,'')
        const airline = flightBumber.substring(0,2)
        const fNumber = flightBumber.substring(2)
        const departureDate = new Date(item.departureDate)
        
        if (typeof airline !== 'string' || typeof fNumber !== 'string' && typeof departureDate !== 'object') {
            res.status(300).json({
                "status": "NOK",
                "message": "Unfortunately, we were not able to find your flight. Please double-check if you filled in the correct details of your flights.",
                "tripId": trip._id,
                "tripName": trip.name
            });
            return null;
        }

        // fetch flight data from API
        try {
            // flightStatsApi.fetchflightData(airline, fNumber, departureDate).then(flightDetails => {
            //     if (typeof flightDetails == 'object' && flightDetails.hasOwnProperty('data')) {
                    
                    // const flightData = flightDetails.data[0]
                    // console.log(flightData)

                    const flightData = {
                        carrierFsCode: 'BA',
                        flightNumber: '206',
                        departureAirportFsCode: 'MIA',
                        arrivalAirportFsCode: 'LHR',
                        departureTime: '2021-07-24T17:05:00.000',
                        arrivalTime: '2021-07-25T06:40:00.000',
                        stops: 0,
                        arrivalTerminal: '3',
                        flightEquipmentIataCode: '777',
                        isCodeshare: false,
                        isWetlease: false,
                        serviceType: '',
                        serviceClasses: [],
                        trafficRestrictions: [],
                        codeshares: [],
                    };

                    var flight = new Flight({
                        carrierFsCode: flightData.carrierFsCode,
                        flightNumber: flightData.flightNumber,
                        departureAirportFsCode: flightData.departureAirportFsCode,
                        arrivalAirportFsCode: flightData.arrivalAirportFsCode,
                        departureTime: flightData.departureTime,
                        arrivalTime: flightData.arrivalTime,
                        stops: flightData.stops,
                        arrivalTerminal: flightData.arrivalTerminal,
                        // test departure terminal
                        departureTerminal: flightData.departureTerminal,
                        flightEquipmentIataCode: flightData.flightEquipmentIataCode,
                        isCodeshare: flightData.isCodeshare,
                        trafficRestrictions: flightData.trafficRestrictions,
                        _creator: user._id,
                        trip: trip._id
                    })
                    
                    flight.save().then( () => {
                        res.status(200).json({
                            "status": "OK",
                            "message": "Success.",
                            "item": {
                                itemType: 'flight',
                                item: flight
                            },
                            "tripId": trip._id,
                            "tripName": trip.name
                        });
                    }).catch(err => console.log(err) )
                    
            //     } else {
            //         res.status(300).json({
            //             "status": "NOK",
            //             "message": "Failed to find your flight. Please verify if you filled in the correct flight details and try again.",
            //             "tripId": trip._id,
            //             "tripName": trip.name
            //         });
            //     }
            // });
        } catch (error) {
            console.log(error)
            res.status(300).json({
                "status": "NOK",
                "message": "Failed to find your flight. Please verify if you filled in the correct flight details and try again.",
                "tripId": trip._id,
                "tripName": trip.name
            });
        }
    }
}