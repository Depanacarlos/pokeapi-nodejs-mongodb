const axios = require('axios').default;
var moment = require('moment');
const { pokemon, encounters, species } = require('./model')


const getPokemon = (name, url, type) => {
    return new Promise(async (resolve, reject) => {
        let model = pokemon

        if (type == 'species') {
            try {
                const speciesResponse = await axios(url)
                url = speciesResponse.data.evolution_chain.url
                model = species
            } catch (error) {
                reject(error)
            }
        }

        if (type == 'encounters') {
            url = `${url}/encounters`
            model = encounters
        }

        let dbResponse = await model.findOne({ name: name })


        if (dbResponse != undefined) {
            //añado tiempo de vida a la data
            let timeToUpdateData = moment(dbResponse.date).add(process.env.TIME_UPDATE, process.env.TIME_TYPE)

            if (timeToUpdateData > moment()) return resolve(dbResponse)
            console.log("actualizando...")
        }

        try {
            resolve(await pokeApiFetch(url, name, model))
        } catch (error) {
            reject(error)
        }

    })
}

const pokeApiFetch = async (url, name, model) => {

    try {
        const rawResponse = await axios.get(url)
        if (rawResponse.status != 200) {
            throw new Error(`Error: ${name} not found`)
        }

        let dataResponse =
        {
            name: name,
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            data: rawResponse.data,
        }

        let options = { upsert: true, new: true, setDefaultsOnInsert: true };


        model.findOneAndUpdate({ name: name }, dataResponse, options, (error, result) => {
            if (error) return;
        })


        return dataResponse
    } catch (error) {
        throw error
    }
}

module.exports = {
    getPokemon
}