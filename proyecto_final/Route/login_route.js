require('dotenv').config();
const express = require('express');
const route = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const bcrypt = require('bcrypt');


route.post('/login', (req, res)=>{
    const usuario = req.body;

    if(!usuario.nombre || !usuario.correo_electronico || !usuario.contraseña){
        return res.status(404).json({status:404, message:'Usuario Contraseña y correo electronico son requeridos..'});
    }

    const sql = 'select * from Usuario where nombre = ? and correo_electronico=? and contraseña = ?';

    pool.query(sql, [usuario.nombre, usuario.correo_electronico, usuario.contraseña],(err, results)=>{

        if(err){
            return res.status(500).json({status:500, message:'Ocurrio un error de conexión con el servidor..'});
        }

        if(results.length === 0){
            return res.status(401).json({status:401, message:'Credenciales invalidas..'});
        }

        const token = jwt.sign(
            {usuario: usuario.nombre},
            process.env.SecretKey,
            {expiresIn:'10m'}
        ); 

        res.status(200).json({satus:200,message:'Success',token:token});
    });
});



module.exports = route;