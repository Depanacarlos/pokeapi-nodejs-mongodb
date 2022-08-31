const express = require('express')
const pokemon = require('../components/pokemon/network')

const routes = (app) => {
    app.use('/api',pokemon);
}

module.exports = routes;