
const request = require('request');

const baseUrl = 'https://api.flightstats.com/flex/';
const prefixUrl = '?appId=' + process.env.flightStatsAppId + '&appKey=' + process.env.flightStratsKey;

const fetchflightData = (airline, number, date) => {
    const month = date.getMonth() + 1;
    var url = 'schedules/rest/v1/json/flight/'+ airline +'/'+number+'/departing/'+date.getFullYear()+'/'+ month +'/'+ date.getDate() 
    url = baseUrl + url + prefixUrl
    
    return new Promise(function (resolve, reject) {
        request(url, { json: true }, (err, res, body) => {
            if (err) { 
                resolve({
                    hasErrors: true,
                    message: err
                })
            }
            if (body.hasOwnProperty('scheduledFlights')) {
                resolve({
                    hasErrors: false,
                    data: body.scheduledFlights    
                })
            } else {
                console.log("ERROR: unable to find scheduledFlights in body params: " + JSON.stringify(body) )
                resolve({
                    hasErrors: true,
                    message: "Unable to parse result!",
                })
            }
        });
    });
}

module.exports = {
    fetchflightData
}