const express = require ('express');
const routerPet = express.Router()
const jwt = require('jsonwebtoken');
const { checkToken, isAdmin } = require('./routerHelp');

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
}});

routerPet.get('/pets', checkToken, (req, res, next) => {
    knex.select('*').from('pet')
        .then( pets => res.status(200).json(pets) )
        .catch(err => {
        res.status(500).json({
            message: 'Erro ao obter lista de pets ' + err.message })
        })
})

module.exports = routerPet