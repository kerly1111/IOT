var express = require('express');
var router = express.Router();
var pg = require("pg");
var conString = require('./conexion.js');
var client = new pg.Client(conString);
client.connect();

router.get('/empresasController', function(req, res) {    // GET de todos los TODOs
	const empresasController = [];
	var consult = '';
	pg.connect(conString, (err, client, done) => {
		if(req.session.tipoUsuario == 'a' || req.session.tipoUsuario == 'e'){
			consult = "SELECT * FROM empresa where emp_estadolog = 'a' and emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by emp_id";
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT * FROM empresa where emp_estadolog = 'a' order by emp_id";
		}
		const query = client.query(consult);
		query.on('row', (row) => {
	      empresasController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(empresasController);
	    });
    });
});

router.post('/empresaBuscarCrontroller', function(req, res) {    // GET de todos los TODOs
	const emp = req.body 
	const empresasController = [];
	pg.connect(conString, (err, client, done) => {
		const query = client.query("SELECT * FROM empresa where emp_estadolog = 'a' and UPPER(emp_nombre) like UPPER('%"+emp.buscar+"%') order by emp_id");
		query.on('row', (row) => {
	      empresasController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(empresasController);
	    });
    });
});


router.post('/empresasController', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const empresa = req.body
	//console.log(req.body);
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		if(empresa.accion == 'ingresar'){
			client.query('INSERT INTO empresa (emp_nombre , emp_descripcion, emp_estadolog) VALUES ($1, $2, $3);', 
			[empresa.emp_nombre, empresa.emp_descripcion, 'a']);			
		}
		if(empresa.accion == 'editar'){
			client.query("UPDATE empresa SET emp_nombre=($1), emp_descripcion=($2) WHERE emp_id=($3)",
			[empresa.emp_nombre, empresa.emp_descripcion, empresa.emp_id]);
		}
		if(empresa.accion == 'eliminar'){
			client.query("UPDATE empresa SET emp_estadolog='i' WHERE emp_id=($1)",[empresa.emp_id]);
		}
		const empresasController = [];
		const query = client.query("SELECT * FROM empresa where emp_estadolog = 'a' order by emp_id");
		query.on('row', (row) => {
	      empresasController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(empresasController);
	    });
	});
});

module.exports = router;