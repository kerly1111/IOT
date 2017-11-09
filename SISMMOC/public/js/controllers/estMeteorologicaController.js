var app = angular.module('appEstMeteorologicas',[]);
var usuarioEdit='';
app.controller('gestionEstMeteorologicas',function($scope, $http){ 
    $scope.formData = {}; 
    $scope.buscarEstMeteorologica={buscar: ""};
    $scope.init=function(){
        $scope.GetData();
    }

    var refresh = function(){
      $http.get('/estMeteorologicasController')
          .success(function(data) {
              $scope.tipoUsuarioPermisos = data[data.length -2].tipo_usuario;
              $scope.empresaUsuarioPermisos = data[data.length -1].tipo_usuario;
              data.length = data.length - 2;
              $scope.estMeteorologicas = data;
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
          if (Math.ceil($scope.estMeteorologicas.length / $scope.pageSize) > 10) fin = 10;
          else fin = Math.ceil($scope.estMeteorologicas.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.estMeteorologicas.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.estMeteorologicas.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.estMeteorologicas.length / $scope.pageSize);
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
    $scope.CargarDatosEditar=function(estMeteorologica) {
      usuarioEdit = estMeteorologica.est_nombre;
      refresh();
      $scope.newEstMeteorologica=estMeteorologica;
      document.frm.IdLongitud.value = $scope.newEstMeteorologica.est_longitud;
      document.frm.IdLatitud.value = $scope.newEstMeteorologica.est_latitud;
      $scope.newEstMeteorologica.accion='editar'; 
    };
    $scope.eliminarEstMeteorologica=function(estMeteorologica) {
        $scope.newEstMeteorologica=estMeteorologica;
        $scope.newEstMeteorologica.accion='eliminar';  
    };
    $scope.guardarEstMeteorologica=function() {
      $scope.newEstMeteorologica.est_latitud =document.frm.IdLatitud.value;
      $scope.newEstMeteorologica.est_longitud =document.frm.IdLongitud.value;
      $scope.guardarEstMeteorologicaN();
    };
    $scope.guardarEstMeteorologicaN=function() {
        $http.post('/estMeteorologicasController', $scope.newEstMeteorologica)
            .success(function(data) {
              $scope.estMeteorologicas = data;
              $scope.configPages();
                //refresh();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });

    };
    $scope.buscarEst=function(){
      $http.post('/estMeteorologicasBuscarCrontroller', $scope.buscarEstMeteorologica)
            .success(function(data) {
              $scope.estMeteorologicas ={};
              $scope.estMeteorologicas = data;
              $scope.configPages();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });
    }
    $scope.nuevoForm=function() {
        $scope.newEstMeteorologica={ accion: 'ingresar',
                             est_nombre: '',
                             est_ciudad: '',
                             est_direccion: '',
                             est_latitud: '',
                             est_longitud: '',
                             emp_id: '- Ninguno -'};
        document.frm.IdLongitud.value="";
        document.frm.IdLatitud.value="";
    } 
})
app.directive('username', function($q, $timeout, $http) {
      return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
          var usernames=[];
          $http.get('/estMeteorologicasController')
          .success(function(data) {
              data.length = data.length - 2;
              for (i = 0; i < data.length; i++) { 
                  usernames.push(data[i].est_nombre);
              } 
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
          ctrl.$asyncValidators.username = function(modelValue, viewValue) {
            if (ctrl.$isEmpty(modelValue)) {
              // consider empty model valid
              return $q.resolve();
            }
            var def = $q.defer();
            $timeout(function() {
              // Mock a delayed response
              if (usernames.indexOf(modelValue) === -1 || usuarioEdit.indexOf(modelValue) != -1) {
                // The username is available
                def.resolve();
              } else {
                def.reject();
              }
            }, 2000);
            return def.promise;
          };
        }
      };
    });
app.filter('startFromGrid', function() {
   return function(input, start) {
      start = +start;
      return input.slice(start);
   };
});
app.controller('gestionEmpresas',function($scope, $http){  
    $scope.formData = {};  
    $scope.init=function(){
        $scope.GetData();
    }
    $http.get('/empresasController')
        .success(function(data) {
            $scope.empresas = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });
});