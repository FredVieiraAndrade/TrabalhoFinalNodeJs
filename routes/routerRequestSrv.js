const express = require('express');
const routerRequestSrv = express.Router()
const jwt = require('jsonwebtoken');
const { checkToken, isAdmin } = require('./routerHelp');

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
});

routerRequestSrv.get('/os', checkToken, (req, res, next) => {
    knex.select('*').from('ordemServico')
        .then(requestSrv => res.status(200).json(requestSrv))
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao obter lista de ordens de serviço ' + err.message
            })
        })
})

routerRequestSrv.get('/os/:id', checkToken, (req, res, next) => {
    knex.select('*')
        .from('ordemServico')
        .where({ id: req.params.id })
        .then(requestSrv => {
            if (requestSrv.length) {
                res.status(200).json(requestSrv[0]);
            }
            else {
                res.status(200).json({
                    message: 'Ordem de serviço não localizada ou não existe.'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar ordem de serviço - ' + err.message
            })
        })
})

routerRequestSrv.post('/os', checkToken, (req, res, next) => {
    knex('ordemServico')
        .insert({
            data_servico: req.body.data_servico,
            id_pet: req.body.id_pet,
            id_servico: req.body.id_servico,
            quantidade_servico: req.body.quantidade_servico,
            observacao: req.body.observacao
        }, ['id'])
        .then(result => {
            let novoProd = result[0];
            res.status(201).json({ message: 'Ordem de serviço criada com sucesso', id: novoProd.id })
        })
        .catch(err => {
            res.status(404).json({ message: 'Falha ao criar ordem de serviço.' + err.message })
        })
})

routerRequestSrv.put('/os/:id', checkToken, isAdmin, (req, res, next) => {
    knex('ordemServico')
        .update({
            data_servico: req.body.data_servico,
            id_pet: req.body.id_pet,
            id_servico: req.body.id_servico,
            quantidade_servico: req.body.quantidade_servico,
            observacao: req.body.observacao
        })
        .where({ id: req.params.id })
        .then(result => {
            res.status(201).json({ message: 'Ordem de serviço alterada com sucesso' })
        })
        .catch(err => {
            res.status(404).json({ message: 'Falha ao alterar ordem de serviço.' })
        })
})

routerRequestSrv.delete('/pets/:id', checkToken, isAdmin, (req, res) => {
    knex('ordemServico')
        .delete()
        .where({ id: req.params.id })
        .then(result => {
            res.status(201).json({ message: 'Ordem de serviço removida com sucesso' })
        })
        .catch(err => {
            res.status(404).json({ message: 'Falha ao remover ordem de serviço.' })
        })
})

module.exports = routerRequestSrv