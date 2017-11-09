var express = require('express');
var router = express.Router();
var pg = require("pg");
var conString = require('./conexion.js');
var client = new pg.Client(conString);
var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';
client.connect();

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

router.post('/cambiarPassCrontroller', function(req, res) {    // GET de todos los TODOs
	const user = req.body
	pg.connect(conString, function (err, client, done) {
		client.query("UPDATE usuarios SET usu_contrasena=($1) WHERE usu_id=($2)",
		[encrypt(user.passNew), user.usu_id]);
	});
});
router.get('/usernamesCrontroller', function(req, res) {    // GET de todos los TODOs
	const usuariosController = [];
	pg.connect(conString, (err, client, done) => {
		const query = client.query("SELECT usu_username FROM usuarios where usu_estadolog = 'a'");
		query.on('row', (row) => {
	      usuariosController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(usuariosController);
	    });
    });
});
router.get('/perfilUsuarioCrontroller', function(req, res) {    // GET de todos los TODOs
	const usuariosController = [];
	pg.connect(conString, (err, client, done) => {
		const query = client.query("SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, empresa.emp_nombre, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' and usu_username = '"+req.session.usuario+"'");
		query.on('row', (row) => {
	      usuariosController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(usuariosController);
	    });
    });
});
router.post('/perfilUsuarioCrontroller', function(req, res) {    // GET de todos los TODOs
	const user = req.body;
	pg.connect(conString, (err, client, done) => {
		client.query("UPDATE usuarios SET usu_username=($1), usu_correo=($2), usu_nombre=($3), usu_apellido=($4)  WHERE usu_id=($5)",
		[user.usu_username, user.usu_correo, user.usu_nombre, user.usu_apellido, user.usu_id]);
		
		req.session.usuario = req.body.usu_username;
		const usuariosController = [];
		const query = client.query("SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, empresa.emp_nombre, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' and usu_username = '"+req.session.usuario+"'");
		query.on('row', (row) => {
	      usuariosController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(usuariosController);
	    });
    });

});

router.post('/usuariosBuscarCrontroller', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const user = req.body;
	var consult = ''; 
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		if(req.session.tipoUsuario == 'a'){
			consult = "SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, empresa.emp_nombre, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' and usu_tipo = 'e' and usuarios.emp_id = '"+parseInt(req.session.empresaUsuario)+"' and (UPPER(usu_username) like UPPER('%"+user.buscar+"%') or UPPER(usu_nombre) like UPPER('%"+user.buscar+"%') or UPPER(usu_apellido) like UPPER('%"+user.buscar+"%')) order by usu_id";
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, empresa.emp_nombre, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' and (UPPER(usu_username) like UPPER('%"+user.buscar+"%') or UPPER(usu_nombre) like UPPER('%"+user.buscar+"%') or UPPER(usu_apellido) like UPPER('%"+user.buscar+"%') or UPPER(empresa.emp_nombre) like UPPER('%"+user.buscar+"%')) order by usu_id";
		}
		const usuariosController = [];
		const query = client.query(consult);
		query.on('row', (row) => {
	      usuariosController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(usuariosController);
	    });
	});
});

router.get('/usuariosCrontroller', function(req, res) {    // GET de todos los TODOs
	var consult = '';
	if(req.session.tipoUsuario == 'a'){
		consult = "SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, empresa.emp_nombre, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' and usu_tipo = 'e' and usuarios.emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by usu_id";
	}
	if(req.session.tipoUsuario == 's'){
		consult = "SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, empresa.emp_nombre, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' order by usu_id";
	}
	const usuariosController = [];
	pg.connect(conString, (err, client, done) => {	
		const query = client.query(consult);
		query.on('row', (row) => {
	      usuariosController.push(row);
	    });
		query.on('end', () => {
	      done();
	      usuariosController.push({tipo_usuario: req.session.tipoUsuario});
	      usuariosController.push({tipo_usuario: req.session.empresaUsuario});
	      res.json(usuariosController);
	    });
	});
}); 

router.post('/usuariosCrontroller', function(req, res) {    // POST que crea un TODO y devuelve todos tras la creación
	const user = req.body;
	var consult = '';
	pg.connect(conString, function (err, client, done) {
		if (err) {
		  return next(err);
		}
		if(user.accion == 'ingresar'){
			client.query('INSERT INTO usuarios (usu_username, usu_contrasena, usu_correo, usu_nombre, usu_apellido,  usu_tipo, usu_estadolog, emp_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);', 
			[user.usu_username, encrypt(user.usu_username+"123"), user.usu_correo, user.usu_nombre, user.usu_apellido, user.usu_tipo, 'a', user.emp_id]);			
		}
		if(user.accion == 'editar'){
			client.query("UPDATE usuarios SET usu_username=($1), usu_correo=($2), usu_nombre=($3), usu_apellido=($4),  usu_tipo=($5), emp_id=($6) WHERE usu_id=($7)",
			[user.usu_username, user.usu_correo, user.usu_nombre, user.usu_apellido, user.usu_tipo, user.emp_id, user.usu_id]);
		}
		if(user.accion == 'eliminar'){
			client.query("UPDATE usuarios SET usu_estadolog='i' WHERE usu_id=($1)",[user.usu_id]);
		}
		if(user.accion == 'restablecer'){
			client.query("UPDATE usuarios SET usu_contrasena=($1) WHERE usu_id=($2)",
			[encrypt(user.usu_username+"123"), user.usu_id]);
		}
		if(req.session.tipoUsuario == 'a'){
			consult = "SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, empresa.emp_nombre, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' and usu_tipo = 'e' and usuarios.emp_id = '"+parseInt(req.session.empresaUsuario)+"' order by usu_id";
		}
		if(req.session.tipoUsuario == 's'){
			consult = "SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, empresa.emp_nombre, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' order by usu_id";
		}
		const usuariosController = [];
		const query = client.query(consult);
		query.on('row', (row) => {
	      usuariosController.push(row);
	    });
		query.on('end', () => {
	      done();
	      res.json(usuariosController);
	    });
	});
});

module.exports = router;