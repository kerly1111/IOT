var express = require('express');
var router = express.Router();
var pg = require("pg");
var conString = require('./conexion.js');
var client = new pg.Client(conString); 
client.connect();

router.get('/cabeceraUsuarioController', function(req, res) {    // GET de todos los TODOs
	const usuariosController = [];
	pg.connect(conString, (err, client, done) => {
		const queryCabecera = client.query("SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, empresa.emp_nombre, empresa.emp_logo, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' and usu_username = '"+req.session.usuario+"'");
		queryCabecera.on('row', (row) => {
	      usuariosController.push(row);
	    });
		queryCabecera.on('end', () => {
	      done();
	      res.json(usuariosController);
	    });
    });
});

module.exports = router;  