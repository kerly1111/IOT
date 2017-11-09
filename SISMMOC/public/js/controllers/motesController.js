var app = angular.module('appMotes',[]);

app.controller('gestionMotes',function($scope, $http){  
    $scope.formData = {}; 
    $scope.buscarMote={buscar: ""};
    $scope.init=function(){
        $scope.GetData();
    }

    var refresh = function(){
      $http.get('/motesCrontroller')
          .success(function(data) {
              $scope.tipoUsuarioPermisos = data[data.length -2].tipo_usuario;
              $scope.empresaUsuarioPermisos = data[data.length -1].tipo_usuario;
              data.length = data.length - 2;
              $scope.motes = data;
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
          if (Math.ceil($scope.motes.length / $scope.pageSize) > 10) fin = 10;
          else fin = Math.ceil($scope.motes.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.motes.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.motes.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.motes.length / $scope.pageSize);
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
    $scope.CargarDatosEditar=function(mote) {
      refresh();
      $scope.newMotes=mote;
      $scope.newMotes.accion='editar'; 
    };
    $scope.eliminarMote=function(mote) {
        $scope.newMotes=mote;
        $scope.newMotes.accion='eliminar';  
    };
    $scope.guardarMote=function() {
        $http.post('/motesCrontroller', $scope.newMotes)
            .success(function(data) {
              $scope.motes = data;
              $scope.configPages();
                //refresh();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });

    };
    $scope.buscarMot=function(){
      $http.post('/motesBuscarCrontroller', $scope.buscarMote)
            .success(function(data) {
              console.log(data);
              $scope.motes ={};
              $scope.motes = data;
              $scope.configPages();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });
    }
    $scope.nuevoForm=function() {
        $scope.newMotes={ accion: 'ingresar',
                             mote_nombre: '',
                             mote_npines_digitales: '',
                             mote_npines_analogicos: '',
                             mote_mac: '',
                             est_id: '- Ninguno -'};
    } 
})
app.filter('startFromGrid', function() {
   return function(input, start) {
      start = +start;
      return input.slice(start);
   };
});
app.controller('gestionEstMeteorologica',function($scope, $http){  
    $scope.formData = {};  
    $scope.init=function(){
        $scope.GetData();
    }
    $http.get('/estMeteorologicasController')
        .success(function(data) {
          $scope.tipoUsuarioPermisos = data[data.length -2].tipo_usuario;
          $scope.empresaUsuarioPermisos = data[data.length -1].tipo_usuario;
          data.length = data.length - 2;
          $scope.estMetorologicas = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
    });
});