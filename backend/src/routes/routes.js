const express = require('express');

const conexionamysql = require('../database/db')
const bodyParser = require('body-parser');

const router = express()


router.get('/', (req , res)=>{
    res.send('Hola chimi 2')
})

// listar productos
router.get('/productos', (req , res)=>{
    conexionamysql.query('SELECT * FROM productos', (error, registros)=>{
        if(error){
            console.log('Error en la base de datos', error)
        }else{
            res.json(registros)
        }
    })
})

// traer datos de producto por ID
router.get('/productos/:id_pro', (req , res)=>{
    const {id_pro} = req.params
    conexionamysql.query('SELECT * FROM productos WHERE id_pro=?', [id_pro], (error, registros)=>{
        if(error){
            console.log('error en a base de datos', error)
        }else{
            res.json(registros)
        }
    })
})


/////// insert de modulos
router.post('/productos', bodyParser.json(), (req , res)=>{
    const { nombre , id_pro } = req.body;

    console.log(req.body);

    conexionamysql.query('INSERT INTO productos (nombre, id_pro) VALUES (?,?)', [nombre, id_pro], (error, registros)=>{
        if(error){
            console.log('error en la base de datos %s', error.message)
            res.status(500).send('el insert no se realizo');
        }else{
            res.send('el insert se realizo correctamente')
        }
        })
});

/////// edicion de modulos
router.put('/productos/:id_pro', bodyParser.json(), (req , res)=>{
    const { nombre } = req.body;
    const { id_pro } = req.params;

    console.log(req.body);

    conexionamysql.query('UPDATE productos SET nombre = ? WHERE id_pro = ?', [nombre, id_pro], (error, registros) => {
        if(error){
            console.log('error en la base de datos %s', error.message)
            res.status(500).send('la edicion no se realizo');
        }else{
            res.status(200).send('la edicion se realizo correctamente')
        }
        })
});

/////// delete de modulos
router.delete('/productos/:id_pro', bodyParser.json(), (req , res) => {
    const { id_pro } = req.params;

    conexionamysql.query('DELETE FROM productos WHERE id_pro = ?', [id_pro], (error, registros) => {
        if (error) {
            console.log('error en la base de datos %s', error.message);
            res.status(500).send('El registro ' + id_pro + ' no se eliminó correctamente');
        } else {
            res.status(200).send('El registro ' + id_pro + ' se eliminó correctamente');
        }
    });
});

// listar clientes
router.get('/clientes', (req , res)=>{
    conexionamysql.query('SELECT * FROM clientes', (error, registros)=>{
        if(error){
            console.log('Error en la base de datos', error)
        }else{
            res.json(registros)
        }
    })
})

// traer datos de clientes por ID

router.get('/clientes/:id_cli', (req , res)=> {
    const { id_cli } = req.params;
    conexionamysql.query('SELECT * FROM clientes WHERE id_cli=?', [id_cli], (error, registros)=>{
        if(error){
            console.log('error en a base de datos', error)
        }else{
            res.json(registros)
        }
    })
})

/////// insert de clientes


router.post('/clientes', bodyParser.json(), (req , res)=>{
    const { nombre , apellido, direccion, correo, cli_estado, id_cue } = req.body;

    console.log(req.body);

    conexionamysql.query('INSERT INTO clientes (nombre, apellido, direccion, correo, cli_estado, id_cue) VALUES (?, ?, ?, ?, ?, ?)', [nombre, apellido, direccion, correo, cli_estado, id_cue], (error, registros)=>{
        if(error){
            console.log('error en la base de datos %s', error.message)
            res.status(500).send('el insert no se realizo');
        }else{
            res.send('el insert se realizo correctamente')
        }
        })
});

/////// edicion de clientes

router.put('/clientes/:id_cli', bodyParser.json(), (req , res) => {
    const { id_cli } = req.params;
    const { nombre, apellido, direccion, correo, cli_estado, id_cue } = req.body;

    console.log(req.body);


    conexionamysql.query('UPDATE clientes SET nombre = ?, apellido = ?, direccion = ?, correo = ?, cli_estado = ?, id_cue = ? WHERE id_cli = ?',
    [nombre, apellido, direccion, correo, cli_estado, id_cue, id_cli], (error, registros) => {
        if(error){
            console.log('error en la base de datos %s', error.message)
            res.status(500).send('la edicion no se realizo');
        }else{
            res.status(200).send('la edicion se realizo correctamente')
        }
        })
});

/////// delete de cientes
router.delete('/clientes/:id_cli', bodyParser.json(), (req , res) => {
    const { id_cli } = req.params;

    conexionamysql.query('DELETE FROM clientes WHERE id_cli = ?', [id_cli], (error, registros) => {
        if (error) {
            console.log('error en la base de datos %s', error.message);
            res.status(500).send('El registro ' + id_cli + ' no se eliminó correctamente');
        } else {
            res.status(200).send('El registro ' + id_cli + ' se eliminó correctamente');
        }
    });
});

module.exports= router;
