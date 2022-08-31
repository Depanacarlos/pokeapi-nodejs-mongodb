require('dotenv').config()
const mongoose = require('mongoose')
const connectionDb =  async ()=> {

    try {
        await mongoose.connect(process.env.URL_DB)
    } catch (error) {
        throw new Error ('Error al conectar BD')
    }

}


module.exports = {
    connectionDb
}
