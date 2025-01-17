const express = require('express');
const mysqlConnect = require('../database/bd')
const bodyParser = require('body-parser');

const bcrypt= require('bcrypt');

const jwt= require('jsonwebtoken');

const router = express()

// listar modelos
router.get('/', (req , res)=>{
    res.send('SISTEMA OPERANDO CORRECTAMENTE')
})

// REGISTRO DE USUARIOS
router.post('/registro', bodyParser.json() , (req , res)=>{
    const {apellido, nombre , dni, user, pass, correo, id_rol} =req.body;
    //
    //console.log(req.body)
    let hash= bcrypt.hashSync(pass, 10);
    //
    if(!dni){
        res.json({
            status:false,
            mensaje: "DNI: Este Campo es Obligatorio"
        })
    }
    //  return

    mysqlConnect.query('SELECT * FROM usuarios WHERE user=?', [user], (error, usuarios)=>{
        if(error){
            console.log('Error en la base de datos', error)
        }else{
            if(usuarios.length>0){
                // NO REALIZA EL GRABADO 
                res.json({
                    status:false,
                    mensaje:"Nombre de Usuario Existente" 
                })
            }else{
                mysqlConnect.query('INSERT INTO usuarios (apellido, nombre, dni, user, pass, correo, id_rol ) VALUES (?,?,?,?,?,?,?)', [apellido, nombre, dni, user, hash, correo, id_rol ], (error, registros)=>{
                    if(error){
                        console.log('Error en la base de datos al momento de insertar ----> ', error)
                    }else{
                        res.json({
                            status:true,
                            mensaje: "Los Datos Fueron Ingresados Correctamente"
                        })
                    }
                })
            }
        }
    })
})
router.get('/menu/:id_rol',verificarToken, (req , res)=>{
    const { id_rol } = req.params;
    jwt.verify(req.token, 'siliconKey', (error, valido)=>{
        if(error){
            res.sendStatus(403);
        }else{
            mysqlConnect.query('SELECT * FROM menu WHERE id_rol=?', [id_rol], (error, registros)=>{
                if(error){
                    console.log('Error en la base de datos', error)
                }else{
                    res.json({
                        status:true,
                        menu:registros 
                    })
                }
            })
        }
    })
})

router.post('/login', bodyParser.json() , (req , res)=>{
    const {user, pass} =req.body
    if(!user){
        res.json({
            status:false,
            mensaje:"USUARIO: Este Campo es Obligatorio para Logearse" 
        })
         return; 
    }
    if(!pass){
        res.json({
            status:false,
            mensaje:"PASSWORD: Este Campo es Obligatorio para Logearse" 
        }) 
        return;
    }
    mysqlConnect.query('SELECT * FROM usuarios WHERE user=?', [user], (error, usuario)=>{
        if(error){
            console.log('Error en la base de datos', error)
        }else{
            if(usuario.length>0){
                console.log('estado de la comparacion', usuario[0].pass)
                 const comparacion= bcrypt.compareSync(pass, usuario[0].pass)   
                 console.log('estado de la comparacion', comparacion)
                 if(comparacion)  {

                    // GENERACION DEL TOKEN
                    jwt.sign({usuario}, 'siliconKey', (error, token)=>{

                        res.json({
                            status: true,
                            datos: usuario,
                            token: token
                        }) 
                    })

                    
                 }else{
                    res.json({
                        status:false,
                        mensaje:"CONTRASEÑA INCORRECTA" 
                    }) 
                 }
            }else{
                res.json({
                    status:false,
                    mensaje:"USUARIO INEXISTENTE" 
                }) 
            }
        }
    })
    

})

function verificarToken(req, res, next){
    const bearer= req.headers['authorization'];
    if(typeof bearer!=='undefined'){
        const token =bearer.split(" ")[1]
        req.token= token;
        next()
    }else{
        res.send('DEBE CONTENER UN TOKEN')
    }
 }
module.exports= router;