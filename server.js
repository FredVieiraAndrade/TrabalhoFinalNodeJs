const express = require ('express')
require('dotenv').config() 
const routerSec = require ('./routes/routerSec')
const routerPet = require ('./routes/routerPet')
const routerSrv = require ('./routes/routerSrv')
const routerCxa = require ('./routes/routerCxa')

const app = express()

app.use (express.json())

app.use ((req, res, next) => {
    let data_req = new Date()
    console.log(`${data_req.toLocaleString()} - ${req.path} - ${req.get('content-type')}`)
    next()
})

app.use('/app', express.static('public'))
app.use('/seguranca', routerSec)
app.use('/api', routerPet, routerSrv, routerCxa)

const PORTA = process.env.PORT || 3000
app.listen (PORTA, () => {
    console.log (`Servidor rodando em http://localhost:${PORTA}`);
})