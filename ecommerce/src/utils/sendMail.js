const nodemailer = require('nodemailer')
const { configObject } = require('../config/connectDB.js')


//configuración del transporte
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user,
        pass: configObject.gmail_pass
    },
    tls: {  //agregado porque no funcionaba por certificado SSL
        rejectUnauthorized: false 
    }
})

//configuración de lo que tiene que enviar
sendMail = async (to, subject, html) => await transport.sendMail({
    from: 'Pruebas Coder <gomez.cindyjanet@gmail.com>',
    to,
    subject ,
    html,
    //usar si se deseara adjuntar archivo
    /*attachments: [{     
        filename: 'nodejs.png',
        path: __dirname + '/nodejs.png',
        cid: 'nodejs'
    }]*/
})

module.exports =  { sendMail } 