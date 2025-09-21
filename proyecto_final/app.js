require('dotenv').config();
const express = require('express');
// const mysql = require ('mysql2');
const app = express();
const pool = require('./config/database');
app.use(express.json());
const PORT = process.env.PORT

const ProductosRoute = require('./Route/productos_route');
const LoginRoute = require('./Route/login_route');

const promisePool= pool.promise();

module.exports = promisePool;

app.use('/api',ProductosRoute);

app.use('/api',LoginRoute);




app.get('',(req,res) =>{
    res.send('Configuracion exitosa');
});

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

