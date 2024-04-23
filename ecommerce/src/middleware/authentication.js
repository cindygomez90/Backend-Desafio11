const authorization = (roleArray) => {
    return async (req, res, next) => {
        console.log('Usuario después de la autenticación:', req.user)
        console.log('Roles permitidos:', roleArray)

        if (roleArray[0] === 'PUBLIC') return next()

        if (!req.user) return res.status(401).json({ status: 'error', error: 'Unauthorized' })
        
        if (!roleArray.includes(req.user.role)) {
            console.log('Usuario no tiene permisos:', req.user.role)
            return res.status(403).json({ status: 'error', error: 'No permissions' })
        }
        next()
    }
}


module.exports = { authorization }
