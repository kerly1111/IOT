var app = angular.module('appUsuarios',[]);
var usuarioEdit='';
app.controller('gestionUsuarios',function($scope, $http){  
    $scope.formData = {}; 
    $scope.buscarUsuario={buscar: ""};
    $scope.init=function(){
        $scope.GetData();
    }
    var refresh = function(){
      $http.get('/usuariosCrontroller')
          .success(function(data) {
            $scope.tipoUsuarioPermisos = data[data.length -2].tipo_usuario;
            $scope.empresaUsuarioPermisos = data[data.length -1].tipo_usuario;
            data.length = data.length - 2;
            $scope.usuarios = '';
            $scope.usuarios = data;
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
          if (Math.ceil($scope.usuarios.length / $scope.pageSize) > 10) fin = 10;
          else fin = Math.ceil($scope.usuarios.length / $scope.pageSize);
        } else {
          if (ini >= Math.ceil($scope.usuarios.length / $scope.pageSize) - 10) {
            ini = Math.ceil($scope.usuarios.length / $scope.pageSize) - 10;
            fin = Math.ceil($scope.usuarios.length / $scope.pageSize);
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
    $scope.CargarDatosEditar=function(usuario) {
      usuarioEdit = usuario.usu_username;
      $scope.newUsuarios='';
      refresh();
      $scope.newUsuarios=usuario;
      $scope.newUsuarios.accion='editar'; 
    };
    $scope.eliminarUsuario=function(usuario) {
        $scope.newUsuarios=usuario;
        $scope.newUsuarios.accion='eliminar';  
    };
    $scope.restablecerPass=function() {
        $scope.newUsuarios.accion='restablecer';
         $http.post('/usuariosCrontroller', $scope.newUsuarios)
            .success(function(data) {
                $scope.newUsuarios = {};
                $scope.newUsuarios = data;
            })
            .error(function(data) {
                console.log('Error:' + data);
        });
    }; 
    $scope.guardarUsuario=function() {
        $http.post('/usuariosCrontroller', $scope.newUsuarios)
            .success(function(data) {
              $scope.usuarios = data;
              $scope.configPages();
                //refresh();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });
    };
    $scope.buscarUsu=function(){
      $http.post('/usuariosBuscarCrontroller', $scope.buscarUsuario)
            .success(function(data) {
              console.log(data);
              $scope.usuarios ={};
              $scope.usuarios = data;
              $scope.configPages();
            })
            .error(function(data) {
                console.log('Error:' + data);
        });
    }
    $scope.nuevoForm=function() {
        $scope.newUsuarios ='';
        $scope.newUsuarios={ accion: 'ingresar',
                             usu_username: '',
                             usu_nombre: '',
                             usu_apellido: '',
                             usu_correo: '',
                             usu_foto: '',
                             usu_tipo: '- Ninguno -',
                             emp_id: '- Ninguno -'};
    } 
})
app.directive('username', function($q, $timeout, $http) {
      return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
          var usernames=[];
          $http.get('/usernamesCrontroller')
              .success(function(data) {
                for (i = 0; i < data.length; i++) { 
                    usernames.push(data[i].usu_username);
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
app.controller('perfilUsuario',function($scope, $http){   
    $scope.formData = {};  
    $scope.init=function(){
        $scope.GetData();
    }
    var refreshPerfil = function(){
      $http.get('/perfilUsuarioCrontroller')
          .success(function(data) {
              $scope.perfilUsers = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
      });
    }
    refreshPerfil();
    $scope.CargarDatosEditarPerfil=function(perfilUsers) {
      refreshPerfil();
      $scope.newUsuarios=perfilUsers;
    };
    $scope.guardarPerfil=function() {
    $http.post('/perfilUsuarioCrontroller', $scope.newUsuarios)
        .success(function(data) {
          $scope.perfilUsers = data;
          refreshPerfil();
        })
        .error(function(data) {
            console.log('Error:' + data);
    });
    };
    $scope.NewFormCambiarPass=function(usuario) {
        $scope.newUsuarios={ passActual: '',
                             passNew: '',
                             PassConfirm: '',
                             usu_id: usuario.usu_id
                           };
    } 
    $scope.cambiarPasword=function() {
    $http.post('/cambiarPassCrontroller', $scope.newUsuarios)
        .success(function(data) {
          //$scope.perfilUsers = data;
        })
        .error(function(data) {
            console.log('Error:' + data);
    });
    };

  });
