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

routerPet.get('/pets/:id', checkToken, (req, res, next) => {   
    knex.select('*')
        .from('pet')
        .where({id: req.params.id})
        .then( pet => {
            if (pet.length) {
                res.status(200).json(pet[0]);
            }
            else{
                res.status(200).json({
                    message: 'Pet não localizado ou não existe.' })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar pet - ' + err.message })
        })  
})

routerPet.post('/pets', checkToken, (req, res, next) => {
    knex('pet')
        .insert ({  nome: req.body.nome, 
                    raca: req.body.raca,
                    idade: req.body.idade,
                    peso: req.body.peso,
                    tutor: req.body.tutor
             },['id'])
        .then (result => {
            let novoProd = result[0];
            res.status(201).json ({ message: 'Pet incluído com sucesso', id: novoProd.id })
        })
        .catch(err => {
            res.status(404).json({message: 'Pet não incluído.' + err.message})
        })
})

routerPet.put('/pets/:id', checkToken, isAdmin, (req, res, next) => {
    knex('pet')
        .update ({ nome: req.body.nome, 
                    raca: req.body.raca,
                    idade: req.body.idade,
                    peso: req.body.peso,
                    tutor: req.body.tutor })
        .where({ id: req.params.id})
        .then (result => {
            res.status(201).json ({ message: 'Pet alterado com sucesso'})
        })
        .catch(err => {
            res.status(404).json({message: 'Pet não alterado.'})
        })   
})

routerPet.delete('/pets/:id', checkToken, isAdmin, (req, res) => {
    knex('pet')
        .delete ()
        .where({ id: req.params.id})
        .then (result => {
            res.status(201).json ({ message: 'Pet removido com sucesso'})
        })
        .catch(err => {
            res.status(404).json({message: 'Pet não removido.'})
        })    
})

module.exports = routerPet