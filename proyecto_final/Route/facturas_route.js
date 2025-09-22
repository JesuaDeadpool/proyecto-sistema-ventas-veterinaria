const express = require('express');
const router = express.Router();
const pool = require('../config/database');



router.get('/facturas',(req,res)=>{
    const sql= `Select v.id_venta,v.fecha,
		
		d.nombre as NombreVeterinaria, d.telefono as VeterinariaTelefono,d.correo_electronico as Veterinaria_Correo,
        d.direccion as direccion, 
        
        c.nombre as Cliente, c.telefono as Telefono,
        
        p.nombre as Producto_Nombre, 
        p.precio as Precio,
	
        dv.cantidad as Cantidad,
        dv.subtotal,v.total
        
        From Venta v
        Join Cliente c on v.id_cliente = c.id_cliente
        Join Usuario u on v.id_usuario = u.id_usuario
		Join DetalleVenta dv on dv.id_venta = v.id_venta
        Join Producto p on dv.id_producto = p.id_producto
        Join DatosVeterinaria d on d.id_datos_veterinaria =1`;

    pool.query(sql,[1] ,(err,results) =>{
    if(err){
            res.status(500).json({status:500,message:'Error de Consulta',error:err.message});
        }
    else{
            res.status(200).json({status:200,message:'Conexion Exitosa',data:results});
        }
    });
});

module.exports = router;