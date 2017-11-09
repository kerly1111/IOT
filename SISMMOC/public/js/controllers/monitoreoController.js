var app = angular.module('appMonitoreo',[]);

app.controller('gestionMonitoreo',function($scope, $http){  
    $scope.formData = {}; 
    $scope.init=function(){
        $scope.GetData();
    }
    var estMetorologicasData = function(){
      $http.get('/estMeteorologicasController')
          .success(function(data) {
              $scope.estMeterologicas = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
      });
    }
    var sensoresData = function(){
      $http.get('/sensoresCrontroller')
          .success(function(data) {
            data.length = data.length - 2;
            $scope.sensores = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
      });
    }
    estMetorologicasData();
    sensoresData();
})
