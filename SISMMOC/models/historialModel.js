var express = require('express');
var router = express.Router();
var pg = require("pg");
var conString = require('./conexion.js');
var client = new pg.Client(conString); 
client.connect();

router.get('/historialController', function(req, res) {    // GET de todos los TODOs
	const historialController = [];
	var consult = ''; 
	pg.connect(conString, (err, client, done) => {
		if(req.session.tipoUsuario == 'a'){
			consult ="SELECT historial.hist_fecha, historial.hist_hora, hist_nivel, usuarios.usu_nombre, usuarios.usu_apellido, historial.hist_asunto FROM historial inner join usuarios on historial.usu_id = usuarios.usu_id where usuarios.emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by hist_fecha DESC, hist_hora DESC";
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT historial.hist_fecha, historial.hist_hora, hist_nivel, usuarios.usu_nombre, usuarios.usu_apellido, historial.hist_asunto FROM historial inner join usuarios on historial.usu_id = usuarios.usu_id order by hist_fecha DESC, hist_hora DESC";
		}
		const query = client.query(consult);
		query.on('row', (row) => {
	      historialController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(historialController);
	    });
    });
});
router.post('/historialBuscarController', function(req, res) {    // GET de todos los TODOs
	const historialController = [];
	var user = req.body;
	var consult = ''; 
	pg.connect(conString, (err, client, done) => {
		if(req.session.tipoUsuario == 'a'){
			consult ="SELECT historial.hist_fecha, historial.hist_hora, hist_nivel, usuarios.usu_nombre, usuarios.usu_apellido, historial.hist_asunto FROM historial inner join usuarios on historial.usu_id = usuarios.usu_id where usuarios.emp_id = '"+parseInt(req.session.empresaUsuario)+"' and (UPPER(usuarios.usu_nombre) like UPPER('%"+user.buscar+"%') or UPPER(usuarios.usu_apellido) like UPPER('%"+user.buscar+"%') or UPPER(hist_asunto) like UPPER('%"+user.buscar+"%')) order by hist_fecha DESC, hist_hora DESC";
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT historial.hist_fecha, historial.hist_hora, hist_nivel, usuarios.usu_nombre, usuarios.usu_apellido, historial.hist_asunto FROM historial inner join usuarios on historial.usu_id = usuarios.usu_id where (UPPER(usuarios.usu_nombre) like UPPER('%"+user.buscar+"%') or UPPER(usuarios.usu_apellido) like UPPER('%"+user.buscar+"%') or UPPER(hist_asunto) like UPPER('%"+user.buscar+"%')) order by hist_fecha DESC, hist_hora DESC";
		}
		const query = client.query(consult);
		query.on('row', (row) => {
	      historialController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(historialController);
	    });
    });
});

module.exports = router;  