angular.module('nodejsAngularApp')
  .controller('QrcodeCtrl', function ($scope, $http, $timeout, $location, OAuth) {
    var ticket;
    var promise;
    var openid;
    $http.get('/web_login/qr_login.json')
      .success(function (data) {
        $scope.qrcode = data;
        ticket = data.ticket;
      });

      var updateClock = function(){
        

        $http.get('/qrcode/query_scaner?ticket='+ticket)
        .success(function (data) {
          if ( data.result == "0" ) {
            // $location.path("/party_center");
            $timeout.cancel(promise);
            login(data.openid);

          }else{
          }

        });

        promise = $timeout(function(){
          updateClock();
        },1000);
      };

      var login = function (openid) {
        

        var user = {
          // email: $scope.email,
          // password: $scope.password
          openid: openid
        }

        OAuth.getAccessToken(user, {}).then(function (response) {
           $location.path("/statis")
          
        }).catch(function (response) {
          if (response.status == 401 || response.status == 400) {
            $scope.error = "login"
          } else {
            $scope.error = "unknown"
          }
        })
      };

      updateClock();
      

  });