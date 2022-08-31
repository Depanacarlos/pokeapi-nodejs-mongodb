const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const dataSchema = new Schema ({
    name:String,
    data:Object,
    date:String,
})

const pokemon = mongoose.model('pokemon',dataSchema)
const encounters = mongoose.model('encounter',dataSchema)
const species = mongoose.model('specie',dataSchema)


module.exports = {
    pokemon,
    encounters,
    species
}