function generateUniqueCode() {    
    const timestamp = new Date().getTime()
    const randomPart = Math.floor(Math.random() * 10000)
    return `CODE-${timestamp}-${randomPart}`
}


module.exports = { generateUniqueCode }