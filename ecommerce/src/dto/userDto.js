class UserDto {
    constructor (user) { 
        console.log('Valores de first_name y last_name:', user.first_name, user.last_name)
        console.log('Usuario recibido:', user)         
        this.full_name = `${user.first_name} ${user.last_name}`
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.password = user.password
        this.role = user.role       
    }
}


module.exports = { UserDto }