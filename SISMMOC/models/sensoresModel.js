var express = require('express');
var router = express.Router();
var pg = require("pg");
var conString = require('./conexion.js');
var client = new pg.Client(conString);
client.connect();

router.post('/sensorBuscarCrontroller', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const sensor = req.body;
	var consult = '';
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		if(req.session.tipoUsuario == 'a'){
			consult = "SELECT sensor.sen_id, sensor.sen_nombre, sensor.sen_pin, sensor.sen_marca, sensor.sen_unidad_medida, mote.mote_id, mote.mote_nombre, sensor.sen_tipo_pin, estacion_meteorlogica.emp_id FROM sensor inner join mote on mote.mote_id = sensor.mote_id inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where sen_estadolog = 'a' and estacion_meteorlogica.emp_id = '"+parseInt(req.session.empresaUsuario)+"' and ( UPPER(sensor.sen_nombre) like UPPER('%"+sensor.buscar+"%') or UPPER(sensor.sen_marca) like UPPER('%"+sensor.buscar+"%') or UPPER(sensor.sen_unidad_medida) like UPPER('%"+sensor.buscar+"%') or UPPER(mote.mote_nombre) like UPPER('%"+sensor.buscar+"%')) order by sen_id"; 
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT sensor.sen_id, sensor.sen_nombre, sensor.sen_pin, sensor.sen_marca, sensor.sen_unidad_medida, mote.mote_id, mote.mote_nombre, sensor.sen_tipo_pin, estacion_meteorlogica.emp_id FROM sensor inner join mote on mote.mote_id = sensor.mote_id inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where sen_estadolog = 'a' and ( UPPER(sensor.sen_nombre) like UPPER('%"+sensor.buscar+"%') or UPPER(sensor.sen_marca) like UPPER('%"+sensor.buscar+"%') or UPPER(sensor.sen_unidad_medida) like UPPER('%"+sensor.buscar+"%') or UPPER(mote.mote_nombre) like UPPER('%"+sensor.buscar+"%')) order by sen_id"; 
		}
		const sensoresController = [];
		const query = client.query(consult);
		query.on('row', (row) => {
	      sensoresController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(sensoresController);
	    });
	});
});

router.get('/sensoresCrontroller', function(req, res) {    // GET de todos los TODOs
	const sensoresController = [];
	var consult = '';
	pg.connect(conString, (err, client, done) => {
		if(req.session.tipoUsuario == 'a'){
			consult = "SELECT sensor.sen_id, sensor.sen_nombre, sensor.sen_pin, sensor.sen_marca, sensor.sen_unidad_medida, mote.mote_id, mote.mote_nombre, sensor.sen_tipo_pin, estacion_meteorlogica.emp_id, estacion_meteorlogica.est_id FROM sensor inner join mote on mote.mote_id = sensor.mote_id inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where sen_estadolog = 'a' and estacion_meteorlogica.emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by sen_id"; 
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT sensor.sen_id, sensor.sen_nombre, sensor.sen_pin, sensor.sen_marca, sensor.sen_unidad_medida, mote.mote_id, mote.mote_nombre, sensor.sen_tipo_pin, estacion_meteorlogica.emp_id, estacion_meteorlogica.est_id FROM sensor inner join mote on mote.mote_id = sensor.mote_id inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id  where sen_estadolog = 'a' order by sen_id"; 
		}
		const query = client.query(consult);
		query.on('row', (row) => {
	      sensoresController.push(row);
	    });
		query.on('end', () => {
	    	done();
	     	sensoresController.push({tipo_usuario: req.session.tipoUsuario});
	      	sensoresController.push({tipo_usuario: req.session.empresaUsuario});
	      	res.json(sensoresController);
	    });
    });
});

router.post('/sensorPines', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const sensor = req.body;
	var consult = '';
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		const pinesController = [];
		const query = client.query("SELECT * FROM sensor where sen_estadolog = 'a' and mote_id = '"+sensor.mote_id+"' and sen_tipo_pin = '"+sensor.sen_tipo_pin+"'");
		query.on('row', (row) => {
	      pinesController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(pinesController);
	    });
	});
});

router.post('/datosMote', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const sensor = req.body;
	var consult = '';
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		const moteController = [];
		const query = client.query("SELECT * FROM mote where mote_estadolog = 'a' and mote_id = '"+sensor.mote_id+"'");
		query.on('row', (row) => {
	      moteController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(moteController);
	    });
	});
});


router.post('/sensoresCrontroller', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const sen = req.body;
	var consult = '';
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		if(sen.accion == 'ingresar'){
			client.query('INSERT INTO sensor (sen_nombre, sen_pin, sen_marca, sen_unidad_medida, sen_tipo_pin, sen_estadolog ,mote_id) VALUES ($1, $2, $3, $4, $5, $6, $7);', 
			[sen.sen_nombre, sen.sen_pin, sen.sen_marca, sen.sen_unidad_medida, sen.sen_tipo_pin, 'a', sen.mote_id]);				
		}
		if(sen.accion == 'editar'){
			client.query("UPDATE sensor SET sen_nombre=($1), sen_pin=($2), sen_marca=($3), sen_unidad_medida=($4),  sen_tipo_pin=($5), mote_id=($6) WHERE sen_id=($7)",
			[sen.sen_nombre, sen.sen_pin, sen.sen_marca, sen.sen_unidad_medida, sen.sen_tipo_pin, sen.mote_id, sen.sen_id]);
		}
		if(sen.accion == 'eliminar'){
			client.query("UPDATE sensor SET sen_estadolog='i' WHERE sen_id=($1)",[sen.sen_id]);
		}
		if(req.session.tipoUsuario == 'a'){
			consult = "SELECT sensor.sen_id, sensor.sen_nombre, sensor.sen_pin, sensor.sen_marca, sensor.sen_unidad_medida, mote.mote_id, mote.mote_nombre, sensor.sen_tipo_pin, estacion_meteorlogica.emp_id FROM sensor inner join mote on mote.mote_id = sensor.mote_id inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where sen_estadolog = 'a' and estacion_meteorlogica.emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by sen_id"; 
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT sensor.sen_id, sensor.sen_nombre, sensor.sen_pin, sensor.sen_marca, sensor.sen_unidad_medida, mote.mote_id, mote.mote_nombre, sensor.sen_tipo_pin FROM sensor inner join mote on mote.mote_id = sensor.mote_id  where sen_estadolog = 'a' order by sen_id"; 
		}
		const sensoresController = [];
		const query = client.query(consult);
		query.on('row', (row) => {
	      sensoresController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(sensoresController);
	    }); 
	});
}); 
module.exports = router;