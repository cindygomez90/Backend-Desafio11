const { userService } = require ('../repositories/index.js')
const { CustomError } = require ('../utils/errors/customError.js')
const { EErrors } = require ('../utils/errors/enums.js')
const { generateUserErrorInfo } = require ('../utils/errors/info.js')

class UserController {
    constructor () {
        this.userService = userService
    }

    getUsers = async (request, responses)=>{
        try {
            const users = await this.userService.getUsers()
            responses.json({
                status: 'success',
                result: users
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    getUser =  async (request, responses)=>{
        try {
            const { uid } = request.params
            const user = await this.userService.getUser ({_id: uid})
            responses.json({
                status: 'success',
                result: user
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    createUser = async (request, responses, next)=>{      
        try {
            const { first_name, last_name, email, password } = request.body
            
            
            //si alguno de los campos no viene se va a instanciar el error
            if(!first_name || !last_name || !email) {
                CustomError.createError({
                    name: 'Error en la creación de usuario',
                    cause: generateUserErrorInfo({
                        first_name,
                        last_name,
                        email
                    }),
                    message: 'Error al crear el usuario',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            const newUser = {
                first_name,
                last_name,
                email,
                password
            }
            
            const result = await this.userService.createUser (newUser)
    
            responses.status(200).send({
                status: 'success',
                usersCreate: result
            })
        } catch (error) {
            next(error)  
        }
    }
    
    updateUser = async (request, responses)=>{
        try {
            const {uid} = request.params
            const userUpdate = request.body
            const result = await this.userService.updateUser (uid, userUpdate)
            responses.status (200).send ({
                status:'sucess',
                message: result
            })
        } catch (error) {
            console.log(error)
        }
    }
    
    deleteUser = async (request, responses)=>{
        try {
            const { uid}  = request.params
            const result = await this.userService.deleteUser (uid)
            responses.status(200).send({
                status: 'succes',
                message: result
            })
        } catch (error) {
            console.log(error)
        }
    }

    changeUserRole = async (req, res) => {
        try {
            const { uid } = req.params
            const { role } = req.body

            const user = await this.userService.getUser ({_id: uid})
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado',
                })
            }

            user.role = role
            await user.save()

            res.json({
                status: 'success',
                message: 'Rol de usuario actualizado',
            })

        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: 'error',
                message: 'Error al cambiar el rol del usuario',
            })
        }
    }
}


module.exports = UserController