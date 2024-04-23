//estrategia de passport con jwt
const passport = require ('passport') 
const { Strategy, ExtractJwt } = require ('passport-jwt') 
const { generateToken } = require ('../utils/jsonwebtoken.js')
const GithubStrategy = require('passport-github2') 
const UserManagerMongo = require ('../daos/Mongo/usersDaoMongo.js')
const sessionService = new UserManagerMongo ()
const { configObject } = require ('../config/connectDB.js')
const { UserDto } = require('../dto/userDto.js') 

const JWTStrategy = Strategy
const ExtractJWT  = ExtractJwt

const initializePassport = () => {    
    const cookieExtractor = (req) => {
        let token = null    
        if (req && req.cookies) {
            token = req.cookies['cookieToken'] 
        }
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configObject.jwt_secret_Key
    }, async (jwt_payload, done) => {
        try {            
            return done(null, jwt_payload)
        } catch (error) {
            console.error('Error al verificar el token:', error)
            return done(error)   
        }
    }))


    passport.use('github', new GithubStrategy( {
        clientID: configObject.clientID,
        clientSecret: configObject.clientSecret,
        callbackURL: configObject.callbackURL,
    }, async (accessToken, refreshToken, profile, done)=>{
        console.log('profile: ', profile)
        try {
            
                let user = await sessionService.getBy({email: profile._json.email})
                if (!user) {
                    let newUser = {
                        first_name: profile._json.login,
                        last_name: profile._json.name,
                        email: profile._json.email,
                        password: ''
                    }

                const result = await sessionService.create (newUser)
                user = result
                }

                const userDto = new UserDto(user)

                const token = generateToken({
                    fullname: userDto.full_name,
                    id: user._id,
                    email: userDto.email,
                    role: user.role
                })
                done(null, {token, user: userDto})
        } catch (error) {
            done(error)
    }
}))

    passport.serializeUser((user, done) => {
        done(null, user.token)
    });

    passport.deserializeUser(async (token, done) => {
        try {
        done(null, { token })
    } catch (error) {
        done(error)
    }
    })
}

module.exports = { initializePassport }