angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



    .state('app.jobsDetails.jobLocation', {
    url: '/job-location',
      views:
      {
      'tab3': {
        templateUrl: 'templates/jobLocation.html',
        controller: 'jobLocationCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.jobsDetails.jobsDisplay', {
    url: '/job-display',
      views:
      {
      'tab2': {
        templateUrl: 'templates/jobsDisplay.html',
        controller: 'jobsDisplayCtrl'
       }
        },
    data: {
      authenticate: true
    }
  })

  .state('app.jobsDetails', {
    url: '/tab',
      views:
      {
      'Content': {
        templateUrl: 'templates/jobsDetails.html',
        abstract:true
        }
      },
    data: {
      authenticate: true
    }
  })

  .state('app.myPosts',
  {
    url: '/my-posts',
      views:
      {
    'Content': {
    templateUrl: 'templates/myPosts.html',
    controller: 'myPostsCtrl'  }
      },
    data: {
      authenticate: true
    }
  })

  .state('app.addPost', {
    url: '/add-post',
      views:
      {
        'Content': {
    templateUrl: 'templates/addPost.html',
    controller: 'addPostCtrl'
                  }
      },
    data: {
      authenticate: true
    }
  })
  .state('auth', {
    url: '/auth',
    abstract: true
  })

  .state('login', {
    url: '/login',
        templateUrl: 'templates/auth/login.html',
        controller: 'LogInCtrl',
    data: {
      authenticate: false
    }
  })
  .state('signup', {
    url: '/signup',
        templateUrl: 'templates/auth/signup.html',
        controller: 'SignUpCtrl',
    data: {
      authenticate: false
    }
  })

  .state('app', {
    url: '/app',
    templateUrl: 'templates/mymenu.html',
    abstract: true
  })

  .state('app.user', {
    url: '/user',
      views:
      {
        'Content': {
        templateUrl: 'templates/app/user.html',
        controller: 'UserCtrl'
                  }
      },
    data: {
      authenticate: true
    }
  });

$urlRouterProvider.otherwise('login');



});
