const express = require('express');
const route = express.Router();
const pool = require('../config/database');

const authologin = require('../authomiddleware/autho_login');


/*Obtener lista de Productos*/
route.get('/productos',(req,res)=>{
    const sql= "Select * from Producto";

    pool.query(sql, (err,results) =>{
        if(err){
            res.status(500).json({status:500,message:'Error de Consulta',error:err.message});
        }
        else{
            res.status(200).json({status:200,message:'Conexion Exitosa',data:results});
        }
    });
});

/*Insertar Productos en tabla Producto*/
route.post('/productos',authologin,(req,res) =>{
    const producto = req.body;

    if(producto.precio<0 || producto.stock<0){
        return res.status(400).json({status:400,message:'Los campos ingresados no pueden ser menores a cero'});
    } 

    
    const sql="Insert into producto (nombre,precio,stock) values (?,?,?)";

    pool.query(sql,[producto.nombre,producto.precio,producto.stock],(err,results)=>{
        if(err){
        res.status(500).json({status:500,message:'Error en la Solicitud'});
        }
        else{
            res.status(201).json({status:201,message:'Registro Producto Exitoso',data:producto});
        }
    });
});

/*Actualizar Productos en tabla Producto*/
route.put('/productos/:id',authologin,(req,res) =>{
    const id = parseInt(req.params.id);
    const producto = req.body;

    const sql = 'Update producto set nombre = ? , precio = ? , stock = ? where id_producto= ?';

    pool.query(sql,[producto.nombre, producto.precio, producto.stock,id],(err,results) =>{
        if(err){
            return res.status(500).json({status:500, message:'Error al Actualizar'});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({status:404, message:'Registro no encontrado'});
        }
            return res.status(200).json({status:200, message:'Registro Actualizado'});
    });
});

/*Eliminar Productos en tabla Producto*/
route.delete('/productos/:id',authologin,(req,res) =>{
        const id = parseInt(req.params.id);

        const sql = 'delete from producto where id_producto = ?';

        pool.query(sql,[id],(err,results)=>{
        if(err){
            return res.status(500).json({status:500, message:'Error al Eliminar'});
        }

        if(results.affectedRows === 0){
            return res.status(404).json({status:404, message:'Registro no encontrado'});
        }
            return res.status(200).json({status:200, message:'Registro Eliminado Exitosamente'});
        });
});

module.exports = route;