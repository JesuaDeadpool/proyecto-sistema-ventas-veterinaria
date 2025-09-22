require('dotenv').config();
const express = require('express');
const mysql = require ('mysql2');
const app = express();
const PORT = 3000;
const pool = require('./config/database');

app.use(express.json());

app.get('',(req,res) =>{
    res.send('Configuracion exitosa');
});

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

