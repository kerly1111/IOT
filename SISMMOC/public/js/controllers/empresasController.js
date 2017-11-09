var app = angular.module('appEmpresas',[]);

app.controller('gestionEmpresas',function($scope, $http){  
    $scope.formData = {}; 
    $scope.buscarEmpresa={buscar: ""};
    $scope.init=function(){
        $scope.GetData();
    }
    var refresh = function(){
      $http.get('/empresasController')
          .success(function(data) {
              $scope.empresas = data;
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
          if (Math.ceil($scope.empresas.length / $scope.pageSize) > 10) fin = 10;
          else fin = Math.ceil($scope.empresas.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.empresas.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.empresas.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.empresas.length / $scope.pageSize);
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
    $scope.CargarDatosEditar=function(empresa) {
        refresh();
        $scope.newEmpresa=empresa;
        $scope.newEmpresa.accion='editar';  
    };
    $scope.eliminarEmpresa=function(empresa) {
        $scope.newEmpresa=empresa;
        $scope.newEmpresa.accion='eliminar';  
    };
    $scope.guardarEmpresa=function() {
        $http.post('/empresasController', $scope.newEmpresa)
            .success(function(data) {
                $scope.empresas = data;
                $scope.configPages();
                //refresh();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });
    };
    $scope.buscarEmp=function(){
      $http.post('/empresaBuscarCrontroller', $scope.buscarEmpresa)
            .success(function(data) {
              console.log(data);
              $scope.empresas ={};
              $scope.empresas = data;
              $scope.configPages();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });
    }
    $scope.nuevoForm=function() {
        $scope.newEmpresa={ accion: 'ingresar',
                             emp_nombre: '',
                             emp_descripcion: '',
                             emp_logo: ''};
    } 
})
app.filter('startFromGrid', function() {
   return function(input, start) {
      start = +start;
      return input.slice(start);
   };
});