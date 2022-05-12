const express = require ('express');
const routerSrv = express.Router()
const jwt = require('jsonwebtoken');
const { checkToken, isAdmin } = require('./routerHelp');

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
}});

routerSrv.get('/servicos', checkToken, (req, res, next) => {
    knex.select('*').from('servico')
        .then( servicos => res.status(200).json(servicos) )
        .catch(err => {
        res.status(500).json({
            message: 'Erro ao obter lista de serviços ' + err.message })
        })
})

routerSrv.get('/servicos/:id', checkToken, (req, res, next) => {   
    knex.select('*')
        .from('servico')
        .where({id: req.params.id})
        .then( servico => {
            if (servico.length) {
                res.status(200).json(servico[0]);
            }
            else{
                res.status(200).json({
                    message: 'Serviço não localizado ou não existente.' })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar serviço - ' + err.message })
        })  
})

routerSrv.post('/servicos', checkToken, (req, res, next) => {
    knex('servico')
        .insert ({  tipo: req.body.tipo, 
                    valor: req.body.valor
             },['id'])
        .then (result => {
            let novoProd = result[0];
            res.status(201).json ({ message: 'Serviço criado com sucesso', id: novoProd.id })
        })
        .catch(err => {
            res.status(404).json({message: 'Falha ao criar o Serviço.' + err.message})
        })
})

routerSrv.put('/servicos/:id', checkToken, isAdmin, (req, res, next) => {
    knex('servico')
        .update ({ tipo: req.body.tipo, 
                   valor: req.body.valor})
        .where({ id: req.params.id})
        .then (result => {
            res.status(201).json ({ message: 'Serviço alterado com sucesso'})
        })
        .catch(err => {
            res.status(404).json({message: 'Falha ao alterar o serviço.'})
        })   
})

routerSrv.delete('/servicos/:id', checkToken, isAdmin, (req, res) => {
    knex('servico')
        .delete ()
        .where({ id: req.params.id})
        .then (result => {
            res.status(201).json ({ message: 'Serviço removido com sucesso'})
        })
        .catch(err => {
            res.status(404).json({message: 'Falha ao remover o serviço.'})
        })    
})

module.exports = routerSrv