const express = require ('express');
const routerHelp = express.Router()
const jwt = require('jsonwebtoken');

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
}});

routerHelp.checkToken = (req, res, next) => {
    let authToken = req.headers['authorization']
    if (!authToken) {
        res.status(401).json({message: 'Token de acesso requerida.'})
    }
    else {
        let token = authToken.split(' ')[1]
        req.token = token
    }

    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if(err) {
            res.status(401).json({message: 'Acesso negado.'})
            return
        }
        req.usuarioId = decodeToken.id
        next()
    })
}

routerHelp.isAdmin = (req, res, next) => {
    knex
        .select('*')
        .from('usuario')
        .where({id: req.usuarioId})
        .then((usuarios) => {
            if(usuarios.length) {
                let usuario = usuarios[0]
                let roles = usuario.roles.split(';')
                let adminRole = roles.find(i => i === 'ADMIN')
                if (adminRole === 'ADMIN') {
                    next()
                    return
                }
                else {
                    res.status(403).json({message: 'Role de ADMIN requerida'})
                    return
                }
            }
        })
        .catch(err => {
            res.status(500).json({message : 'Erro ao verificar roles de usuário - ' + err.message })
        })
}

module.exports = routerHelp