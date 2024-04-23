//importación de módulos
const { Router } = require ('express') 
const UserController = require('../controllers/users.controller.js')
const { passportCall } = require ('../middleware/pasportCall.js') 
const { authorization } = require ('../middleware/authentication.js') 

const usersRouter = Router()
const { getUsers, getUser, createUser, updateUser, deleteUser, changeUserRole } = new UserController ()


//Endpoint para solicitar todos los usuarios
usersRouter.get('/', passportCall('jwt'), authorization(['ADMIN']), getUsers)

//Endpoint para solicitar un usuario
usersRouter.get('/:uid', getUser)

//Endpoint para crear un usuario
usersRouter.post('/', createUser)

//Endpoint para modificar un usuario
usersRouter.put('/:uid', updateUser)

//Endpoint para eliminar un usuario
usersRouter.delete('/:uid', deleteUser)

//Endpoint para cambiar el rol de un usuario
usersRouter.put('/premium/:uid', passportCall('jwt'), authorization(['USER', 'USER_PREMIUM']), changeUserRole)


module.exports = usersRouter