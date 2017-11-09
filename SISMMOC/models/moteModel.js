var express = require('express');
var router = express.Router();
var pg = require("pg");
var conString = require('./conexion.js');
var client = new pg.Client(conString);
client.connect();

router.post('/motesBuscarCrontroller', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const mot = req.body;
	var consult = '';
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		if(req.session.tipoUsuario == 'a'){
			consult = "SELECT mote.mote_id, mote.mote_nombre, mote.mote_npines_analogicos, mote.mote_npines_digitales, mote.mote_mac,  estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre, estacion_meteorlogica.emp_id FROM mote inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where mote_estadolog = 'a' and estacion_meteorlogica.emp_id = '"+parseInt(req.session.empresaUsuario)+"' and (UPPER(mote_nombre) like UPPER('%"+mot.buscar+"%') or UPPER(mote_mac) like UPPER('%"+mot.buscar+"%') or UPPER(estacion_meteorlogica.est_nombre) like UPPER('%"+mot.buscar+"%')) order by mote_id";
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT mote.mote_id, mote.mote_nombre, mote.mote_npines_analogicos, mote.mote_npines_digitales, mote.mote_mac,  estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre FROM mote inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where mote_estadolog = 'a' and (UPPER(mote_nombre) like UPPER('%"+mot.buscar+"%') or UPPER(mote_mac) like UPPER('%"+mot.buscar+"%') or UPPER(estacion_meteorlogica.est_nombre) like UPPER('%"+mot.buscar+"%')) order by mote_id";
		}
		const moteController = [];
		const query = client.query(consult);
		query.on('row', (row) => {
	      moteController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(moteController);
	    });
	});
});

router.get('/motesCrontroller', function(req, res) {    // GET de todos los TODOs
	const moteController = [];
	var consult = '';
	pg.connect(conString, (err, client, done) => {
		if(req.session.tipoUsuario == 'a'){
			consult = "SELECT mote.mote_id, mote.mote_nombre, mote.mote_npines_analogicos, mote.mote_npines_digitales, mote.mote_mac,  estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre, estacion_meteorlogica.emp_id FROM mote inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where mote_estadolog = 'a' and estacion_meteorlogica.emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by mote_id"; 
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT mote.mote_id, mote.mote_nombre, mote.mote_npines_analogicos, mote.mote_npines_digitales, mote.mote_mac,  estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre FROM mote inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where mote_estadolog = 'a' order by mote_id"; 
		}
		const query = client.query(consult);
		query.on('row', (row) => {
	      moteController.push(row);
	    });
		query.on('end', () => {
	      	done();
	      	moteController.push({tipo_usuario: req.session.tipoUsuario});
	      	moteController.push({tipo_usuario: req.session.empresaUsuario});
	      res.json(moteController);
	    });
    }); 
});


router.post('/motesCrontroller', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación 
	const mot = req.body;
	var consult = '';
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		if(mot.accion == 'ingresar'){
			client.query('INSERT INTO mote (mote_nombre, mote_npines_analogicos, mote_npines_digitales, mote_mac, mote_estadolog, est_id) VALUES ($1, $2, $3, $4, $5, $6);', 
			[mot.mote_nombre, mot.mote_npines_analogicos, mot.mote_npines_digitales, mot.mote_mac, 'a', mot.est_id]);			
		}
		if(mot.accion == 'editar'){
			client.query("UPDATE mote SET mote_nombre=($1), mote_npines_analogicos=($2), mote_npines_digitales=($3), mote_mac=($4),  est_id=($5) WHERE mote_id=($6)",
			[mot.mote_nombre, mot.mote_npines_analogicos, mot.mote_npines_digitales, mot.mote_mac, mot.est_id, mot.mote_id]);
		}
		if(mot.accion == 'eliminar'){
			client.query("UPDATE mote SET mote_estadolog='i' WHERE mote_id=($1)",[mot.mote_id]);
		}
		if(req.session.tipoUsuario == 'a'){
			consult = "SELECT mote.mote_id, mote.mote_nombre, mote.mote_npines_analogicos, mote.mote_npines_digitales, mote.mote_mac,  estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre, estacion_meteorlogica.emp_id FROM mote inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where mote_estadolog = 'a' and estacion_meteorlogica.emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by mote_id"; 
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT mote.mote_id, mote.mote_nombre, mote.mote_npines_analogicos, mote.mote_npines_digitales, mote.mote_mac,  estacion_meteorlogica.est_id, estacion_meteorlogica.est_nombre FROM mote inner join estacion_meteorlogica on estacion_meteorlogica.est_id = mote.est_id where mote_estadolog = 'a' order by mote_id"; 
		}
		const moteController = [];
		const query = client.query(consult);
		query.on('row', (row) => {
	      moteController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(moteController);
	    });
	});
});

module.exports = router;