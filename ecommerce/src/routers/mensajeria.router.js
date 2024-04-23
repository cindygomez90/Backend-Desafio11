const { Router } = require ("express")
const mensajeriaRouter = Router ()
const { sendMail } = require ('../utils/sendMail.js')
const { sendSms } = require ('../utils/sendSms.js')

//Endpoint para enviar un mail
mensajeriaRouter.get('/mail', (req, res) => {
    /*   const destinatario = 'gomez.cindy@hotmail.com'
    const subject = 'Email de prueba ecommerce Coder'
    const html = '<div><h1>Este es un mail de prueba</h1></div>'

    sendMail(destinatario, subject, html)

    res.send('email enviado')
})*/

//modifiqué código para tener datos dinámicos (reestablcer contraseña)
    try {
        const { destinatario, subject, html } = req.body 
        sendMail(destinatario, subject, html)
        res.status(200).json({ message: 'Correo electrónico enviado correctamente.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Ocurrió un error al enviar el correo electrónico.' })
    }
})


//Endpoint para enviar un sms
mensajeriaRouter.get('/sms', (req, res) => { 
    sendSms('Cindy', 'Gómez')
    res.send('sms enviado')
})

module.exports = mensajeriaRouter