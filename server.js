const express = require ('express')
require('dotenv').config() 
const routerSec = require ('./routes/routerSec')
const routerPet = require ('./routes/routerPet')
const routerSrv = require ('./routes/routerSrv')
const routerRequestSrv = require ('./routes/routerRequestSrv')
const swaggerUi = require('swagger-ui-express');
const  YAML  =  require ( 'yamljs' ) ; 
const  swaggerDocument  =  YAML.load ( './public/swagger.yaml' ) ;

const app = express()

app.use (express.json())

app.use ((req, res, next) => {
    let data_req = new Date()
    console.log(`${data_req.toLocaleString()} - ${req.path} - ${req.get('content-type')}`)
    next()
})

app.use('/app', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/seguranca', routerSec)
app.use('/api', routerPet, routerSrv, routerRequestSrv)

const PORTA = process.env.PORT || 3000
app.listen (PORTA, () => {
    console.log (`Servidor rodando em http://localhost:${PORTA}`);
})