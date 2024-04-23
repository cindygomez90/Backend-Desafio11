const twilio = require('twilio')
const { configObject } = require('../config/connectDB.js')


const { twilio_sid, twilio_token, twilio_number } = configObject

//configuración para el envío del msj
const client = twilio(twilio_sid, twilio_token)

sendSms = ( nombre, apellido ) => client.messages.create({
    body: `Gracias por tu compra ${nombre} ${apellido}`,
    from: twilio_number,
    to: '+543513283902'
})

module.exports = { sendSms } 