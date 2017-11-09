var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session'); 
var pg = require("pg");
var conString = require('./../models/conexion.js');
var client = new pg.Client(conString);
client.connect();
var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cookieParser());
router.use(session({
    secret: 'abcd1234',
    resave: false, 
    saveUninitialized: true
})); 

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

router.get('/', function(req, res) {
	 delete req.session.usuario;
	 res.render('index.html');
});
router.get('/logeo', function(req, res) {
	 res.render('login.html');
});
router.get('/inicio', function(req, res) {
	 res.render('inicio.html');
});
router.post('/autentificacion', function(req, res) {
	pg.connect(conString, (err, client, done) => {
		client.query("SELECT usuarios.usu_id, usuarios.usu_username, usuarios.usu_correo, usuarios.usu_nombre, usuarios.usu_apellido, usuarios.usu_foto, usuarios.usu_tipo, usuarios.usu_contrasena, empresa.emp_nombre, empresa.emp_logo, empresa.emp_id FROM usuarios inner join empresa on empresa.emp_id = usuarios.emp_id where usu_estadolog = 'a' and usu_username = '"+req.body.username+"' and usu_contrasena = '"+encrypt(req.body.password)+"'", function(error, resultado, fila){
			if(!error){
				if(resultado.rows.length > 0){
					var usuid ='';
					var nombre ='';
					for (var item in resultado.rows) {
						var pru = JSON.stringify(resultado.rows[item]);
						usuid=JSON.parse(pru).usu_id;
						nombre = JSON.parse(pru).usu_nombre+" "+JSON.parse(pru).usu_apellido;
						req.session.tipoUsuario = JSON.parse(pru).usu_tipo;
						req.session.empresaUsuario = JSON.parse(pru).emp_id;	 	
                	}
					req.session.usuario = req.body.username;
					var asunto='Inicio de sesion del usuario '+nombre+' cuyo username es '+req.body.username;
					var date=new Date();
					var fecha= date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
					var hora=date.getHours()+":"+date.getMinutes();
					client.query('INSERT INTO historial(hist_asunto, hist_nivel, usu_id, hist_hora, hist_fecha) VALUES ($1, $2, $3, $4, $5);', 
					[asunto, '1', usuid, hora, fecha]); 										
					res.redirect('/inicio');
				}else{
					res.redirect('/logeo');
				}
			}else{
				console.log('Error');
			}
		});
    });
});
router.get('/usuarios', function(req, res) {
	res.render('Admins/usuarios.html');
});
router.get('/perfil', function(req, res) {
	res.render('perfil.html');
});
router.get('/empresas', function(req, res) {
	res.render('Admins/empresas.html');
});
router.get('/estMeteorologica', function(req, res) {
	res.render('Admins/estMeteorologica.html');
});
router.get('/motes', function(req, res) {
	res.render('Admins/motes.html');
});
router.get('/sensores', function(req, res) {
	res.render('Admins/sensores.html');
});
router.get('/monitoreo', function(req, res) {
	res.render('monitoreo.html');
});
router.get('/dashboard', function(req, res) {
	res.render('dashboard.html');
});
router.get('/historial', function(req, res) {
	res.render('historial.html');
});
router.get('/luz', function(req, res) {
	res.render('monitoreoLuz.html');
});
router.get('/humedad', function(req, res) {
	res.render('monitoreoHumedad.html');
});
router.get('/presion', function(req, res) {
	res.render('monitoreoPresion.html');
});
router.get('/lluvia', function(req, res) {
	res.render('monitoreoLluvia.html');
});
module.exports = router;
