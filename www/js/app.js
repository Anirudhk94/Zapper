// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('starter', ['ionic','ngCordova']);
  
  app.run(function($ionicPlatform,$ionicPopup) {
    $ionicPlatform.ready(function() {
      
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
          
      }

      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
        
    });

    $ionicPlatform.registerBackButtonAction(function(event) {
      if (true) { // your check here
        $ionicPopup.confirm({
            title: 'Alert',
            template: 'Exit Zapper?'
          }).then(function(res) {
                if (res) {
                  ionic.Platform.exitApp();
                }
           })
      }
    }, 100);
  });



  app.controller('homeCtrl',function($scope){
      $scope.sayHi1 = function(){
        console.log("bloody hard");
    }
  }); 

  app.controller('SmsCtrl',function($scope,$ionicPopup,$cordovaSms){
      $scope.sms = {
        number: '8466974974',
        message: 'This is some dummy text'
      };
      
      
      $scope.showAlert = function(command) {
         var alertPopup = $ionicPopup.alert({
           title: 'Message Status!',
           template: command
         });

         alertPopup.then(function(res) {
           console.log('Thank you for not eating my delicious ice cream cone');
         });
       };
      
   
    document.addEventListener("deviceready", function() {
   
      var options = {
        replaceLineBreaks: false, // true to replace \n by a new line, false by default
        android: {
          intent: '' // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
            //intent: 'INTENT' // send SMS inside a default SMS app
        }
      };
        $scope.sta = 0;
        
        $scope.showConfirm = function() {
         var confirmPopup = $ionicPopup.confirm({
           title: 'Send SMS',
           template: 'SMS cost based on carrier charges, send anyway?'
         });

         confirmPopup.then(function(res) {
           if(res) {
              $scope.sta = 1;
             console.log('You are sure');
           } else {
               $scope.sta = 0;
             console.log('You are not sure');
           }
         });
       };
        
        
        $scope.msg = "";
   
        
        
      $scope.sendSMS = function(command) {   
        $scope.showConfirm();
        if($scope.sta){
          $scope.msg = command;
          console.log($scope.msg);
          $cordovaSms.send('8466974974', $scope.msg , options).then(
            function() {
             console.log('Success');
            }, function(error) {
            $scope.showAlert("Command Failed");
            console.log('Error');
          });  
        }
      }

    });
  })


  //$ionicPopup service allows programmatically creating and showing popup windows 
  //$ionicLoading is an overlay that can be used to indicate activity while blocking user interaction.
  app.controller('PopupCtrl',function($scope, $ionicPopup, $ionicLoading) {
      
      //Method to send commands over Bluetooth
      $scope.sendCommand = function(command){
        bluetoothSerial.write(""+command, success, 
          function(){
            $scope.showAlert("Failed");
          });
      };
      
      //On failure to connect to bluetooth, this alert pops
      $scope.showAlert = function(msg) {
        var alertPopup = $ionicPopup.alert({
          title: 'Alert for Blutooth!',
          template: msg
        });

        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        });
      };

      //To keep track of toggle
      $scope.toggleChange = function() {        
          if($scope.appliance.val){
            $scope.showConfirm();
          }           
          else {
            document.getElementById('appliance_list').style.display = "none";
            bluetoothSerial.disconnect();
          }       
      };
        
        
      //Display loading while the device is establishing connection   
      $scope.showList= function(){
        $ionicLoading.show({
          template: '<p>Connecting...<ion-spinner icon="android"></ion-spinner></p>',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
      };
    
      $scope.appliance = {
        val: false
      };
     
      //Method to connect to arduino via bluetooth
      $scope.showConfirm = function() {

        var confirmPopup = $ionicPopup.confirm({
          title: 'Bluetooth',
          template: 'Connect to prototype?'
        });

        confirmPopup.then(function(res) {
          bluetoothSerial.disconnect(); //Disconnect existing connections if any
          $scope.showList();
          if(res){    
            bluetoothSerial.enable(
              function() {
                 bluetoothSerial.connectInsecure('30:14:10:15:14:28',
                  function() {
                    document.getElementById('appliance_list').style.display = "block"; 
                    $ionicLoading.hide();
                  }, 
                  function() {
                    $ionicLoading.hide();
                    document.getElementById("toggle").checked = false; 
                    $scope.appliance.val =false;
                    $scope.showAlert('Prototype out of range!');
                 });
              },
              function() {
                console.log("The user did *not* enable Bluetooth");
                document.getElementById("toggle").checked = false;
                $scope.appliance.val = false;
                $ionicLoading.hide();
                $scope.showAlert('Bluetooth not enabled!');     
              }
            ); 
         } else {
              document.getElementById("toggle").checked = false;
              $scope.appliance.val = false;
              $ionicLoading.hide();
              console.log("The user did *not* enable Bluetooth");
         }
       });
     };
    
  });




  app.controller('SettingCtrl', function($scope, LoginService, $ionicPopup, $state) {

      $scope.log_pattern = LoginService.getLoginPattern();
      var lock = new PatternLock("#lockPattern", {
          // 3
          onDraw:function(pattern){
              // 4
              if ($scope.log_pattern ) {
                  LoginService.setLoginPattern(pattern);
                  lock.reset();
                  $scope.$apply(function() {
                      $scope.log_pattern = LoginService.getLoginPattern();    
                  });
                  $ionicPopup.alert({
                     title: 'Pattern Changed. Please Login..',
                   });
                  $state.go('login');
              }
          }
      });
  });

app.controller('creditCtrl',function($scope){
});

app.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    // 1
    $scope.log_pattern = LoginService.getLoginPattern();

    // 2
    var lock = new PatternLock("#lockPattern", {
        // 3
        onDraw:function(pattern){
            // 4
            if ($scope.log_pattern) {
                // 5
                LoginService.checkLoginPattern(pattern).success(function(data) {
                    lock.reset();
                    $state.go('home');
                }).error(function(data) {
                    lock.error();
                });
            } else {
                // 6
                LoginService.setLoginPattern(pattern);
                lock.reset();
                $scope.$apply(function() {
                    $scope.log_pattern = LoginService.getLoginPattern();    
                });
            }
        }
    });
});

app.service('LoginService', function($q) {
    return {
        getLoginPattern: function() {
            return window.localStorage.getItem("login_pattern");
        },
        setLoginPattern: function(pattern) {
            window.localStorage.setItem("login_pattern", pattern);
        },
        checkLoginPattern: function(pattern) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }

            if (pattern == this.getLoginPattern()) {
                deferred.resolve();
            } else {
                deferred.reject();
            }

            return promise;
        }

    }
});


app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller:'homeCtrl'
    })
  .state('blue', {
      url: '/blue',
      templateUrl: 'templates/blue.html',
      controller:'PopupCtrl'
      
    })
  .state('sms', {
      url: '/sms',
      templateUrl: 'templates/sms.html',
      controller: 'SmsCtrl'
    })
  .state('settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html',
      controller: 'SettingCtrl'
    })
  .state('credit', {
      url: '/credit',
      templateUrl: 'templates/credit.html',
      controller: 'creditCtrl'
    });
  $urlRouterProvider.otherwise('/login');
    
});


