const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TripSchema = new mongoose.Schema({
    carrierFsCode: {
        type: String,
    },
    flightNumber: {
        type: String,
    },
    departureAirportFsCode: {
        type: String,
    },
    arrivalAirportFsCode: {
        type: String,
    },
    departureTime: {
        type: Date,
    },
    arrivalTime: {
        type: Date,
    },
    stops: {
        type: Number,
        default: 0
    },
    arrivalTerminal:{
        type: Number,
        default: '',
    },
    flightEquipmentIataCode:{
       type: String,
       default: '',
    },
    isCodeshare: {
        type: Boolean,
        default: false
    },
    trafficRestrictions: {
        type: Array,
        default: []
    },
    _creator : { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    trip : { 
        type: Schema.Types.ObjectId, 
        ref: 'Trip' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Flight', TripSchema);
