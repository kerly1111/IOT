var app = angular.module('appSensores',[]);

app.controller('gestionSensores',function($scope, $http){  
    $scope.formData = {};
    $scope.sensores = ''; 
    $scope.pines ='';
    $scope.buscarSensores={buscar: ""};
    $scope.init=function(){
        $scope.GetData();
    }

    var refresh = function(){
      $http.get('/sensoresCrontroller')
          .success(function(data) {
              $scope.tipoUsuarioPermisos = data[data.length -2].tipo_usuario;
              $scope.empresaUsuarioPermisos = data[data.length -1].tipo_usuario;
              data.length = data.length - 2;
              $scope.sensores = data;
              $scope.configPages();
          })
          .error(function(data) {
              console.log('Error: ' + data);
      });
    }
    refresh();
    $scope.currentPage = 0;
    $scope.pageSize = 10; 
    $scope.pages = [];

    $scope.configPages = function() {
        $scope.pages.length = 0;
        var ini = $scope.currentPage - 4;
        var fin = $scope.currentPage + 5;
        if (ini < 1) {
          ini = 1;
          if (Math.ceil($scope.sensores.length / $scope.pageSize) > 10) fin = 10;
          else fin = Math.ceil($scope.sensores.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.sensores.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.sensores.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.sensores.length / $scope.pageSize);
          }
        }
        if (ini < 1) ini = 1;
        for (var i = ini; i <= fin; i++) {
          $scope.pages.push({ no: i });
        }
        if ($scope.currentPage >= $scope.pages.length)
          $scope.currentPage = $scope.pages.length - 1;
    };
    $scope.setPage = function(index) {
    $scope.currentPage = index - 1;
    };
    $scope.CargarDatosEditar=function(sensor) {
      refresh();
      $scope.newSensores=sensor;
      $scope.newSensores.accion='editar'; 
      $scope.pinesOcup(sensor);
    };
    $scope.eliminarSensor=function(sensor) {
        $scope.newSensores=sensor;
        $scope.newSensores.accion='eliminar';  
    };
    $scope.guardarSensor=function() {
        $http.post('/sensoresCrontroller', $scope.newSensores)
            .success(function(data) {
              $scope.sensores = data;
              $scope.configPages();
                //refresh();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });

    };
    $scope.buscarSen=function(){
        $http.post('/sensorBuscarCrontroller', $scope.buscarSensores)
            .success(function(data) {
              $scope.sensores ={};
              $scope.sensores = data;
              $scope.configPages();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });
    }
    $scope.pinesOcup=function(sensor){
      var pinSen='';
      if($scope.newSensores.accion=='editar'){
      pinSen=sensor.sen_pin;
      }
      refresh();
      if(sensor.mote_id!='- Ninguno -' && sensor.pin_tipo!='- Ninguno -'){
        $scope.newSensores.sen_pin = '- Ninguno -';
        $http.post('/datosMote', $scope.newSensores).success(function(dataMote) {
          const pinesLibres =[];
          var cantidadPines=0;
          var controlPin = true;
          if($scope.newSensores.sen_tipo_pin == 'a'){
            for (var item in dataMote) {
              cantidadPines = dataMote[item].mote_npines_analogicos;
            }
          }else{
            if($scope.newSensores.sen_tipo_pin == 'd'){
              for(var item in dataMote) {
                cantidadPines = dataMote[item].mote_npines_digitales;
              }
            }
          }
          $http.post('/sensorPines', $scope.newSensores)
                .success(function(data) {
                  console.log(data);
                  for (var i = 0; i < cantidadPines; i++) {
                    controlPin = true;
                    for (var item in data) {
                      if(i==data[item].sen_pin){
                        controlPin = false;
                        if($scope.newSensores.accion=='editar'){
                          if(pinSen == i){
                            $scope.newSensores.sen_pin = pinSen.toString();                           
                            controlPin = true;
                          }
                        }
                      }
                    }
                    if(controlPin){
                      pinesLibres.push({sen_pin: i});
                    }
                  }
                  $scope.pines = pinesLibres;
                })
                .error(function(data) {
                    console.log('Error:' + data);
          });
        });
      }else{
          $scope.pines ='';
          $scope.newSensores.sen_pin = '- Ninguno -';
      } 
    }
    $scope.nuevoForm=function() {
        $scope.pines ='';
        $scope.newSensores={ accion: 'ingresar',
                             sen_nombre: '',
                             sen_marca: '',
                             sen_unidad_medida: '',
                             sen_pin: '- Ninguno -',
                             sen_tipo_pin: '- Ninguno -',
                             mote_id: '- Ninguno -'};
    } 
})
app.filter('startFromGrid', function() {
   return function(input, start) {
      start = +start;
      return input.slice(start);
   };
});
app.controller('gestionMotes',function($scope, $http){  
    $scope.formData = {};  
    $scope.init=function(){
        $scope.GetData();
    }
    $http.get('/motesCrontroller')
        .success(function(data) {
          $scope.tipoUsuarioPermisos = data[data.length -2].tipo_usuario;
          $scope.empresaUsuarioPermisos = data[data.length -1].tipo_usuario;
          data.length = data.length - 2;
          $scope.motes = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });
});
