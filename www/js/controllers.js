angular.module('app.controllers', [])

.controller('jobLocationCtrl',function ($scope, $state,$cordovaGeolocation,$ionicLoading, $ionicPlatform, $rootScope)
 {

   navigator.geolocation.getCurrentPosition(function(position){
          $scope.latitude = position.coords.latitude;
          $scope.longitude = position.coords.longitude;
          var latLng = new google.maps.LatLng($scope.latitude, $scope.longitude);
          var options = {
              center: latLng,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          $scope.map = new google.maps.Map(document.getElementById("map_canvas"), options);
                     google.maps.event.addListenerOnce($scope.map, 'idle', function(){
               marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                    icon:'http://i.imgur.com/fDUI8bZ.png'
               });

               var infoWindow = new google.maps.InfoWindow({
                   content: "Here You Are.!"
               });

               google.maps.event.addListener(marker, 'click', function () {
                   infoWindow.open($scope.map, marker);
                   $scope.map.setZoom($scope.map.getZoom() + 2);
                   $scope.map.setCenter(marker.getPosition());
               });
          });
        }, function(error){
          console.log("Could not get location");
   });


   $rootScope.$on('someEvent', function(event,args)
   {
       /***********************Distance********************/
       if (typeof(Number.prototype.toRad) == "undefined")
        {
            Number.prototype.toRad = function()
            {
              return this * Math.PI / 180;
            }
        }
        var R = 6371; // Radius of the earth in km
        var dLat = (args.latitude-$scope.latitude).toRad();  // Javascript functions in radians
        var dLon = (args.longitude-$scope.longitude).toRad();
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos($scope.latitude.toRad()) * Math.cos((args.latitude)* Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
         var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
         var d = R * c; // Distance in km
        var informations = new google.maps.InfoWindow({
           content: d+" meters between your actuel position and this job...Good work"
         });
         console.log(d);
       /***************************************************/
          var latLng = new google.maps.LatLng(args.latitude,args.longitude);
         console.log($scope.map);
          var neWmarker = new google.maps.Marker({
                              map: $scope.map,
                              animation: google.maps.Animation.BOUNCE,
                              title: 'Here is The requested job',
                              position: latLng,
                              icon:'../img/utilities.ico'
                         });
                        $scope.map.panTo(neWmarker.getPosition());
                         google.maps.event.addListener(neWmarker, 'click', function () {
                             informations.open($scope.map, neWmarker);
                             $scope.map.setZoom($scope.map.getZoom() + 2);
                             $scope.map.setCenter(marker.getPosition());
                         });
                         $scope.map.addListener('center_changed', function() {
                         // 2 seconds after the center of the map has changed, pan back to the
                         // marker.
                         window.setTimeout(function() {
                           $scope.map.panTo(neWmarker.getPosition());
                         }, 2000);
                       });

    });

})

.controller('jobsDisplayCtrl', ['$scope', '$rootScope','CRUDService','$state', function ($scope, $rootScope, CRUDService, $state)
 {
    $scope.posts = CRUDService.fetchAllData();
    $scope.trace = function (latitude,longitude)
    {
        var args = {};
        args.latitude = latitude;
        args.longitude = longitude;
        $rootScope.$emit('someEvent',args);
         $state.go('app.jobsDetails.jobLocation');
    }
    $scope.call = function (number)
    {
      window.plugins.CallNumber.callNumber(onSuccess, onError, number, bypassAppChooser);
      function onSuccess(result){
        console.log("Success:"+result);
      }

      function onError(result) {
        console.log("Error:"+result);
      }
    }
}])


.controller('menuCtrl', function ($scope, $state,AuthService) {

  $scope.logout = function(){
    AuthService.doLogout();

    $state.go('login');
  };

})

.controller('myPostsCtrl',function ($scope, $stateParams,CRUDService)
 {
    $scope.posts = CRUDService.lister();
    $scope.remove = function (Post)
    {
      CRUDService.removePost(Post.$id);
    }
})

.controller('addPostCtrl',function ($scope, $state,CRUDService, $ionicLoading)
 {
     var longitude = undefined;
     var latitude = undefined;
     navigator.geolocation.getCurrentPosition(function(position)
     {
       latitude = position.coords.latitude;
       longitude = position.coords.longitude;
       var div = angular.element(document.getElementById('location'))[0];
       //angular.element(document.getElementById('latitude'))[0].removeAttribute("required");
       //angular.element(document.getElementById('latitude'))[0].removeAttribute("required");
       div.remove();
     });
  $scope.addPost = function(Post)
  {
        if (longitude)
        {
          Post.longitude = longitude;
          Post.latitude = latitude;
        }
        $ionicLoading.show({
          template: 'POSTING ...',
          duration: 3000
        });
        CRUDService.poster(Post).then(function(Post){
              // success
              $scope.errors = "";
              $ionicLoading.hide();
              $state.go('app.myPosts');
            },function(err){
              // error
              $scope.errors = err;
              $ionicLoading.hide();
            });
  }

})
.controller('LogInCtrl', function($scope, $state, AuthService, $ionicLoading) {
//  $scope.stopDrag();
  $scope.login = function(user)
  {
    $ionicLoading.show({
      template: 'Logging in ...',
      duration: 3000
    });

    AuthService.doLogin(user).then(function(user)
    {

      // success
      $state.go('app.user');
      $scope.errors = "";
      $ionicLoading.hide();
    },function(err)
    {
      // error
      //console.log('none');
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };

  $scope.facebookLogin = function(){
    $ionicLoading.show({
      template: 'Logging in with Facebook ...',
      duration: 3000
    });

    AuthService.doFacebookLogin()
    .then(function(user){
      // success
      $scope.errors = "";
      $ionicLoading.hide();
      $state.go('app.user');
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
  $scope.GoogleLogin = function(){
    $ionicLoading.show({
      template: 'Logging in with Google ...',
      duration: 3000
    });

    AuthService.doGoogleLogin()
    .then(function(user){
      // success
      $scope.errors = "";
      $ionicLoading.hide();
      $state.go('app.user');
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
})

.controller('SignUpCtrl', function($scope, $state, AuthService, $ionicLoading) {
  $scope.signup = function(user){
    $ionicLoading.show({
      template: 'Signing up ...',
      duration: 3000
    });

    AuthService.doSignup(user)
    .then(function(user){
      // success
      $scope.errors = "";
      $ionicLoading.hide();
      $state.go('app.user');
    },function(err){
      // error
      $scope.errors = err;
      $ionicLoading.hide();
    });
  };
})

.controller('UserCtrl', function($scope, $state, AuthService){
  $scope.current_user = {};
//  console.log('oki00');
  var current_user = AuthService.getUser();
  if(current_user && current_user.provider == "facebook"){
    $scope.current_user.email = current_user.facebook.displayName;
    $scope.current_user.image = current_user.facebook.profileImageURL;
  } else {
    $scope.current_user.email = current_user.email;
    $scope.current_user.image = '../img/user.ico';
  }
  //console.log($scope.current_user.email);
  $scope.logout = function(){
    AuthService.doLogout();

    $state.go('login');
  };
})
