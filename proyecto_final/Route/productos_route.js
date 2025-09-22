const express = require('express');
const router = express.Router();
const pool = require('../config/database');

const authologin = require('../authomiddleware/autho_login');


/*Obtener lista de Productos*/
router.get('/productos',(req,res)=>{
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
router.post('/productos',authologin,(req,res) =>{
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
router.put('/productos/:id',authologin,(req,res) =>{
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
router.delete('/productos/:id',authologin,(req,res) =>{
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

/* Creacion de una venta con detalles de productos, cantidades, y total*/

router.post('/ventas',(req,res) =>{
        const ventas = req.body;
        const productos =ventas.productos

        let total=0;
        let subtotal=0;
        

        productos.forEach(producto => {
           /* Consigo el precio de los productos vendidos*/
            const sql_precio_producto="Select precio, stock from producto where id_producto=?"

            pool.query(sql_precio_producto,[producto.id_producto],(err,results)=>{

                if(err === results.length ===0){
                    return res.status(400).json({status:400,message:'Producto no Encontrado'});
                } 
        });
                
        const precio = results[0].precio;
        const stock = results[0].stock;

        if (productos.cantidad > stock){
            return res.status(400).json({status:400,message:'Stock insuficiente'});
        }

        ventas.total = ventas.cantidad * productos.precio;
        


        const sql_venta='Insert into Venta(id_usuario,id_cliente,fecha,total) values (?,?,?,?)';
        
            pool.query(sql_venta,[ventas.id_usuario,ventas.id_cliente,ventas.fecha,ventas.total],(err,results)=>{

                if(err){
                    return res.status(400).json({status:400,message:'Error al obtener datos de venta'});
                }

            });  

        
    const sql_detalle_venta= 'Insert into DetalleVenta(id_venta,id_producto,cantidad,subtotal) values (?,?,?,?);';

        pool.query(sql_detalle_venta, [detalleventa.id_venta,detalleventa.id_producto,detalleventa.cantidad,detalleventa.subtotal],(err,results)=>{

                    if(err){
                        return res.status(400).json({status:400,message:'Error al insertar datos de venta'});
                    }

            });


        const sql_update_stock='Update Producto set stock=stock-? where id_producto=? and stock>=?';
            
             pool.query(sql_update_stock, [producto.stock,producto.id_producto],(err,results)=>{

                    if(err){
                        return res.status(400).json({status:400,message:'Error al actualizar datos de stock'});
                    }
                    return res.status(200).json({status:200,message:'Stock actualizado exitosamente'});
            });
        
        });
        
});



module.exports = router;