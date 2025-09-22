require('dotenv').config();
const express = require('express');
const mysql = require ('mysql2');
const app = express();
const pool = require('./config/database');
const bcrypt = require('bcrypt');

app.use(express.json());

const PORT = process.env.PORT;
const productosroute = require('./Route/productos_route');
const autho_login = require('./Route/login_route');
const facturas_route = require('./Route/facturas_route');

app.use('/api',productosroute);

app.use('/api/',autho_login);

app.use('/api',facturas_route);

app.get('/api/gethash/:pass',async (req,res) =>{
        const pass =req.params.pass;
        const saltRound =10;
        const hash = await bcrypt.hash(pass,saltRound);
        res.status(200).json({status:200,message:'Exitosamente',data:hash});

});



app.get('',(req,res) =>{
    res.send('Configuracion exitosa');
});

app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

