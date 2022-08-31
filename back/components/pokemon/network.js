const express = require('express')
const controller = require('./controller')
const routes = express.Router()

routes.get('/pokemon/:name', async (req,res)=>{
    const {name} = req.params
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`

    try {
        res.status(200).json(await controller.getPokemon(name,url))
    } catch (error) {
        res.status(404).json(error)
    }
})

routes.get('/species/:name', async (req,res)=>{
    const {name} = req.params
    let url = `https://pokeapi.co/api/v2/pokemon-species/${name}`
    try {
        res.status(200).json(await controller.getPokemon(name,url,'species'))
    } catch (error) {
        res.status(404).json(error)
    }
})

routes.get('/encounters/:name', async (req,res)=>{
    const {name} = req.params
    let url = `https://pokeapi.co/api/v2/pokemon/${name}`
    try {
        res.status(200).json(await controller.getPokemon(name,url,'encounters'))
    } catch (error) {
        res.status(404).json(error)
    }
})

module.exports = routes;