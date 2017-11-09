var app = angular.module('appHistorial',[]);

app.controller('gestionHistorial',function($scope, $http){  
    $scope.formData = {}; 
    $scope.init=function(){
        $scope.GetData();
    }
    var historialData = function(){
      $http.get('/historialController')
          .success(function(data) {
              $scope.historials = data;
              $scope.configPages();
          })
          .error(function(data) {
              console.log('Error: ' + data);
      });
    }
    historialData();
    $scope.buscarHist=function(){
      $http.post('/historialBuscarController', $scope.buscarHistorial)
            .success(function(data) {
              console.log(data);
              $scope.historials ={};
              $scope.historials = data;
              $scope.configPages();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });
    }
    $scope.currentPage = 0;
    $scope.pageSize = 10; 
    $scope.pages = [];

    $scope.configPages = function() {
        $scope.pages.length = 0;
        var ini = $scope.currentPage - 4;
        var fin = $scope.currentPage + 5;
        if (ini < 1) {
          ini = 1;
          if (Math.ceil($scope.historials.length / $scope.pageSize) > 10) fin = 10;
          else fin = Math.ceil($scope.historials.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.historials.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.historials.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.historials.length / $scope.pageSize);
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
});
app.filter('startFromGrid', function() {
   return function(input, start) {
      start = +start;
      return input.slice(start);
   };
});