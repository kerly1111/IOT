var cabeceraApp = angular.module('appCabecera',[]);

cabeceraApp.controller('gestionCabecera',function($scope, $http){   
    $scope.formData = {};  
    $scope.init=function(){
        $scope.GetData();
    }
    var refreshPerfil = function(){
      $http.get('/cabeceraUsuarioController')
          .success(function(data) {
              $scope.cabeceraUsuarios = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
      });
    }
    refreshPerfil();
  });
