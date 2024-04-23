const bcrypt = require('bcrypt')
const { generateToken }  = require ('../utils/jsonwebtoken.js')
const { userService, productService } = require ('../repositories/index.js')
const { UserDto } = require('../dto/userDto.js')
const jwt = require('jsonwebtoken')
const { sendMail } = require('../utils/sendMail.js')
const { isValidPassword } = require('../utils/hashBcrypt.js')

class SessionController {

    constructor () {
        this.userService = userService
        this.productService = productService
    }

    register = async (request, responses)=>{
        try {        
            const {first_name, last_name, email, password, role} = request.body       
            console.log (first_name, last_name, email, password, role)
            if (first_name === '' || password === '') {
                return responses.send ('Faltan llenar campos obligatorios')
            } 
    
            const existingUser = await this.userService.getUser({ email })
            if (existingUser) {
                return responses.send({
                    status: 'error',
                    error: 'El correo electrónico ya está registrado',
                })
            }
    
            const hashedPassword = await bcrypt.hash(password, 10)
        
            const newUser = {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                role: role || 'USER'
            }
            const result = await this.userService.createUser (newUser)
            
            const userDto = new UserDto(result)
            const token = generateToken({
                id: result._id
            })
            responses.cookie('cookieToken', token, {
                maxAge: 60 * 60 * 1000 * 24,       
                httpOnly: true  
            }).send({   
                status: 'success',
                usersCreate: userDto, 
                token   
            })
        } catch (error) {
            responses.send ({
                status:'error', 
                error:error.message
            })        
        }
    }

    failregister = async (request, responses) => {
        responses.send({error: 'falla en el register'})
    }

    login = async (request, responses)=>{
        const {email, password} = request.body       
        
        const user = await this.userService.getUser ({email}) 
        console.log (user)
        if (!user) {
            return responses.send ({
                status: 'error', 
                error: 'Usuario con ese mail no existe'
            })
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password)
    
        if (!isPasswordValid) {
            return responses.send({ status: 'error', error: 'Contraseña incorrecta' })
        }
        
        const userDto = new UserDto(user)

        const token = generateToken({
            fullname: userDto.full_name,
            id: user._id,
            email: userDto.email,
            role: userDto.role
        })
        responses.cookie('cookieToken', token, {
            maxAge: 60*60*1000*24,  
            httpOnly: true 
        })
    
        const products = await this.productService.getProducts()
        responses.render('products', { user: userDto, products})
    }

    faillogin = async (request, responses) => {
        responses.send({error: 'falla en el register'})
    }

    current = async (request, responses) => {       
        try {
            console.log('Objeto user recibido:', request.user)
            const userDto = new UserDto (request.user)
            
            if (!userDto) {
                return responses.status(404).json({
                    status: 'error', 
                    error: 'Usuario no encontrado' 
                })
            }
            const responseData = {
                fullname: userDto.full_name,
                email: userDto.email,
                role: userDto.role
            }

            responses.json(responseData)
            
        } catch (error) {
            console.error('Error al recuperar datos del usuario:', error)
            responses.status(500).json({ 
                status: 'error', 
                error: 'Error del servidor' 
            })
        }
    }

    logout = (request, responses) => {
        responses.clearCookie('cookieToken') 
        responses.redirect('/login')
    }

    GitHub = async(request, responses) => {
        console.log('request.user:', request.user)
        const user = request.user.user
        const products = await this.productService.getProducts()
        responses.render('products', { user: user, products })
    }

    requestPasswordReset = async (req, res) => {
        try {
            const { email } = req.body
            const user = await this.userService.getUser({ email })

            if (!user) {
            return res.status(404).json({ message: 'No se encontró un usuario con este correo electrónico.' })
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
            const resetLink = `${process.env.BASE_URL}/api/sessions/reset-password?token=${token}`

            await sendMail(
                user.email, 
                'Restablecer contraseña', 
                `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p><a href="${resetLink}">${resetLink}</a>`)

            //console.log("Enlace para restablecer contraseña:", resetLink)
            
            return res.status(200).json({ message: 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.' })

        } catch (error) {            
            console.error(error)
            return res.status(500).json({ message: 'Ocurrió un error al solicitar el restablecimiento de contraseña.' })
        }
    }

    resetPassword = async (req, res) => {
        try {
            const { token } = req.query
            return res.render('resetPassword', { token })
    
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Ocurrió un error al cargar la vista de restablecimiento de contraseña.' })
        }
    }
    
    processResetPassword = async (req, res) => {
        try {
            const { token } = req.query
            const { newPassword, repeatPassword } = req.body
    
            if (newPassword !== repeatPassword) {
                return res.status(400).json({ message: 'Las contraseñas no coinciden.' })
            }
    
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const user = await this.userService.getUser({ _id: decodedToken.userId })
    
            if (!user) {
                return res.status(404).json({ message: 'No se encontró un usuario asociado a este token.' })
            }

            if (isValidPassword(newPassword, user.password)) {
                return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la anterior.' })
            }
    
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await this.userService.updateUser(decodedToken.userId, { password: hashedPassword })
    
            return res.status(200).json({ 
                message: 'Contraseña restablecida exitosamente.' 
                })
    
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ message: 'El enlace para restablecer la contraseña ha expirado. Por favor, solicite uno nuevo.' })
            }
            console.error(error)
            return res.status(500).json({ message: 'Ocurrió un error al restablecer la contraseña.' })
        }
    }
}

module.exports = SessionController