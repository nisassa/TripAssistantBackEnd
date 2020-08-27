const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TripSchema = new mongoose.Schema({
    name: {
        type: String,
        default: '',
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    _creator : { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    flights: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Flight' 
    }]

}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);
