var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');

var urls = require('./routes/urls');
var users = require('./routes/users');
var usuariosModels = require('./models/usuariosModel');
var empresasModels = require('./models/empresasModel');
var estMeteorologicasModels = require('./models/estMeteorologicaModel');
var moteModels = require('./models/moteModel');
var sensoresModels = require('./models/sensoresModel');
var cabeceraModels = require('./models/cabeceraModel');
var historialModels = require('./models/historialModel');

var SerialPort = require("serialport"); 
var mote1Port = new SerialPort('COM25', { baudrate: 9600, parser: SerialPort.parsers.readline("\r\n")});
var mote2Port = new SerialPort('COM27', { baudrate: 9600, parser: SerialPort.parsers.readline("\r\n")});
 
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
    secret: 'abcd1234',
    resave: false,
    saveUninitialized: true
}));

app.set('views', 'views');  
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/', urls);
app.use('/users', users);
app.use('/', usuariosModels);
app.use('/', empresasModels);
app.use('/', estMeteorologicasModels);
app.use('/', moteModels);
app.use('/', sensoresModels);
app.use('/', cabeceraModels);
app.use('/', historialModels);

var fs = require('fs');
var base64str = base64_encode('public/imagenes/logoSismmoc.png');
// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

mote1Port.on('open', onOpenMote1);
mote1Port.on('data', onDataMote1);
mote2Port.on('open', onOpenMote2);
mote2Port.on('data', onDataMote2);

function onOpenMote1(){
  console.log("Mote1 conectado");
};
function onOpenMote2(){
 	console.log("Mote2 conectado");
};

function onDataMote1(dato){
	//	console.log(dato +" -1");
	var arrayJSON=dato.split(":");
/*	if(parseInt(arrayJSON[1]) > 28 && arrayJSON[0] == 1){
		mote1Port.write('tempAlta' + '\r', function() {
     		console.log('accion: ' + 'alta');
  		});
	}
	if(parseInt(arrayJSON[1]) < 28 && arrayJSON[0] == 1){
		mote1Port.write('tempBaja' + '\r', function() {
     		console.log('accion: ' + 'baja');
  		});
	}*/
	io.sockets.emit('lecturaMote1', arrayJSON[0], arrayJSON[1] ); 
}
function onDataMote2(dato){
	//console.log(dato + " -2");
	var arrayJSON=dato.split(":");
	io.sockets.emit('lecturaMote2', arrayJSON[0], arrayJSON[1] ); 
}


server.listen(3000, function(){
  console.log("Server Start");
});    