var express = require('express');
var router = express.Router();
var pg = require("pg");
var conString = require('./conexion.js');
var client = new pg.Client(conString);
client.connect();

router.post('/estMeteorologicasBuscarCrontroller', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const est = req.body;
	var consult = '';
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		if(req.session.tipoUsuario == 'a'  || req.session.tipoUsuario == 'e'){
			consult = "SELECT estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre, estacion_meteorlogica.est_ciudad, estacion_meteorlogica.est_latitud, estacion_meteorlogica.est_longitud, estacion_meteorlogica.est_direccion, empresa.emp_nombre, empresa.emp_id FROM estacion_meteorlogica inner join empresa on empresa.emp_id = estacion_meteorlogica.emp_id where est_estadolog = 'a' and estacion_meteorlogica.emp_id = '"+parseInt(req.session.empresaUsuario)+"' and (UPPER(est_nombre) like UPPER('%"+est.buscar+"%') or UPPER(est_ciudad) like UPPER('%"+est.buscar+"%') or UPPER(est_direccion) like UPPER('%"+est.buscar+"%')) order by est_id";
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre, estacion_meteorlogica.est_ciudad, estacion_meteorlogica.est_latitud, estacion_meteorlogica.est_longitud, estacion_meteorlogica.est_direccion, empresa.emp_nombre, empresa.emp_id FROM estacion_meteorlogica inner join empresa on empresa.emp_id = estacion_meteorlogica.emp_id where est_estadolog = 'a' and (UPPER(est_nombre) like UPPER('%"+est.buscar+"%') or UPPER(est_ciudad) like UPPER('%"+est.buscar+"%') or UPPER(est_direccion) like UPPER('%"+est.buscar+"%') or  UPPER(empresa.emp_nombre) like UPPER('%"+est.buscar+"%')) order by est_id";
		}
		const estMeteorologicasController = [];
		const query = client.query(consult);
		query.on('row', (row) => {
	      estMeteorologicasController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(estMeteorologicasController);
	    });
	});
});

router.get('/estMeteorologicasController', function(req, res) {    // GET de todos los TODOs
	const estMeteorologicasController = [];
	var consult = '';
	pg.connect(conString, (err, client, done) => {
		if(req.session.tipoUsuario == 'a' || req.session.tipoUsuario == 'e'){
			consult = "SELECT estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre, estacion_meteorlogica.est_ciudad, estacion_meteorlogica.est_latitud, estacion_meteorlogica.est_longitud, estacion_meteorlogica.est_direccion, empresa.emp_nombre, empresa.emp_id FROM estacion_meteorlogica inner join empresa on empresa.emp_id = estacion_meteorlogica.emp_id where est_estadolog = 'a' and estacion_meteorlogica.emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by est_id";
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre, estacion_meteorlogica.est_ciudad, estacion_meteorlogica.est_latitud, estacion_meteorlogica.est_longitud, estacion_meteorlogica.est_direccion, empresa.emp_nombre, empresa.emp_id FROM estacion_meteorlogica inner join empresa on empresa.emp_id = estacion_meteorlogica.emp_id where est_estadolog = 'a' order by est_id";
		}
		const query = client.query(consult);
		query.on('row', (row) => {
	      estMeteorologicasController.push(row);
	    });
		query.on('end', () => {
	      	done();
	      	estMeteorologicasController.push({tipo_usuario: req.session.tipoUsuario});
	      	estMeteorologicasController.push({tipo_usuario: req.session.empresaUsuario});
	      	res.json(estMeteorologicasController);
	    });
    });
});


router.post('/estMeteorologicasController', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const est = req.body;
	var consult = '';
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		if(est.accion == 'ingresar'){
			client.query('INSERT INTO estacion_meteorlogica (est_nombre, est_ciudad, est_latitud, est_longitud, est_direccion,  est_estadolog, emp_id) VALUES ($1, $2, $3, $4, $5, $6, $7);', 
			[est.est_nombre, est.est_ciudad, est.est_latitud, est.est_longitud, est.est_direccion, 'a', est.emp_id]);			
		}
		if(est.accion == 'editar'){
			client.query("UPDATE estacion_meteorlogica SET est_nombre=($1), est_ciudad=($2), est_latitud=($3), est_longitud=($4), est_direccion=($5),  emp_id=($6) WHERE est_id=($7)",
			[est.est_nombre, est.est_ciudad, est.est_latitud, est.est_longitud, est.est_direccion, est.emp_id, est.est_id]);
		}
		if(est.accion == 'eliminar'){
			client.query("UPDATE estacion_meteorlogica SET est_estadolog='i' WHERE est_id=($1)",[est.est_id]);
		}
		if(req.session.tipoUsuario == 'a'  || req.session.tipoUsuario == 'e'){
			consult = "SELECT estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre, estacion_meteorlogica.est_ciudad, estacion_meteorlogica.est_latitud, estacion_meteorlogica.est_longitud, estacion_meteorlogica.est_direccion, empresa.emp_nombre, empresa.emp_id FROM estacion_meteorlogica inner join empresa on empresa.emp_id = estacion_meteorlogica.emp_id where est_estadolog = 'a' and estacion_meteorlogica.emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by est_id";
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre, estacion_meteorlogica.est_ciudad, estacion_meteorlogica.est_latitud, estacion_meteorlogica.est_longitud, estacion_meteorlogica.est_direccion, empresa.emp_nombre, empresa.emp_id FROM estacion_meteorlogica inner join empresa on empresa.emp_id = estacion_meteorlogica.emp_id where est_estadolog = 'a' order by est_id";
		}
		const estMeteorologicasController = [];
		const query = client.query(consult);
		query.on('row', (row) => {
	      estMeteorologicasController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(estMeteorologicasController);
	    });
	});
});
 
module.exports = router;