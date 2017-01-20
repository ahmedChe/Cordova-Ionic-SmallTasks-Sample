angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])
.service('AuthService', function($q){
  //var _firebase = new Firebase("https://projetioniccordova.firebaseio.com/");
  /***********************************************************/
  /*var config = {
    apiKey: 'AIzaSyBng25d3gUBkl-tHgF_Jof-OXcluw39y4U',
    authDomain: 'projetioniccordova.firebaseapp.com',
    databaseURL: 'https://projetioniccordova.firebaseio.com'
  };
  firebase.initializeApp(config);*/
  //var _firebase =firebase.database().ref();
  /*********************************************************/
  this.userIsLoggedIn = function(){
    var deferred = $q.defer(),
        authService = this,
        isLoggedIn = (authService.getUser() !== null);

    deferred.resolve(isLoggedIn);

    return deferred.promise;
  };

  this.getUser = function(){
    return firebase.auth().currentUser;
  };

  this.doLogin = function(user){
    var deferred = $q.defer();
    var email = user.email;
    var password = user.password;
    /*if (!email || !password)
     {
        return console.log('email and password required');
    }*/
    //console.log('ok3');
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(data){
    //  console.log('ok4');
     deferred.resolve(data);
   }).catch(function(errors)
    {
      //console.log(errors);
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
                  };
        errors_list.push(error);
        deferred.reject(errors_list);
    });
    ///console.log('ok5');
    return deferred.promise;
  };

  this.doFacebookLogin = function(){
    var deferred = $q.defer();
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result)
    {
      var token = result.credential.accessToken;
      var user = result.user;
      deferred.resolve(result);
      //console.log(token)
      //console.log(user)
   }).catch(function(errors)
    {
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
    });

    return deferred.promise;
  };
  this.doGoogleLogin = function(){
    var deferred = $q.defer();
    var provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('profile');
          provider.addScope('email');
    return firebase.auth().signInWithPopup(provider).then(function(data){
    //  console.log('ok4');
     deferred.resolve(data);
   }).catch(function(errors)
    {
      //console.log(errors);
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
                  };
        errors_list.push(error);
        deferred.reject(errors_list);
    });

    return deferred.promise;
  };

  this.doSignup = function(user){
    var deferred = $q.defer(),
        authService = this;
    var email = user.email;
    var password = user.password;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data){
    //  console.log('ok4');
    authService.doLogin(user)
    .then(function(data)
    {
      // success
      deferred.resolve(data);
    },function(err)
    {
      // error
      deferred.reject(err);
    });
   }).catch(function(errors)
    {
      //console.log(errors);
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
                  };
        errors_list.push(error);
        deferred.reject(errors_list);
    });

    return deferred.promise;
  };

  this.doLogout = function(){
    firebase.auth().signOut();
  };
})

/*************************CRUD******************************/
.service('CRUDService',function ($firebaseArray,$firebaseObject,$q){
  var userId = firebase.auth().currentUser.uid;
  var ref =firebase.database().ref(userId);
  /*********************************************************/

  this.poster = function(Post)
  {
          var key=ref.child('posts');
          var deferred = $q.defer();
          var title = Post.title;
          var description = Post.description;
          var employeer = Post.employeer;
          var phone = Post.phone;
          var longitude = Post.longitude;
          var latitude = Post.latitude;
          this.lister().$loaded().then(function(arr)
          {
                var size = arr.length +1;
                key.child('post '+size).set({
                  title: title,
                  employeer:employeer,
                  description: description,
                  phone:phone,
                  latitude:latitude,
                  longitude:longitude,
                })
                .then(function(data)
                {
                    deferred.resolve(data);
                    var reference =firebase.database().ref("users");
                    var user=$firebaseArray(reference);
                    reference.child(userId).once('value', function(snapshot)
                     {
                          var exists = (snapshot.val() !== null);
                        //  console.log (snapshot.member);
                          if (exists)
                          {
                            console.log('user ' + userId + ' exists!');
                          }
                          else
                           {
                             reference.child(userId).set({
                                member: true,
                              });
                           }
                      });

                }).catch(function(errors)
                {
                    var errors_list = [],
                        error = {
                          code: errors.code,
                          msg: errors.message
                              };
                    errors_list.push(error);
                    deferred.reject(errors_list);
                });
              });
      return deferred.promise;
  };
  this.lister = function()
  {
    var posts = $firebaseArray(ref.child('posts'))
    return posts;
  };

  this.removePost = function(id)
  {
    var reference =firebase.database().ref(userId +'/posts/');
    var post = $firebaseObject(reference.child(id));
    post.$remove();
  };
  this.fetchAllData = function()
  {
            var results = new Array();
            var ref =firebase.database().ref();
            ref.child("users").on('child_added', function(snapshot)
               {
                       var userKey = snapshot.key;
                      // console.log (userKey);
                       var reference = ref.child(userKey);
                       $firebaseArray(reference.child('posts')).$loaded().then(function(arr)
                       {
                         //console.log(arr);
                         results.push.apply(results,arr);
                       });
              }
            );
            //console.log(results);
            return results;
  };



});
