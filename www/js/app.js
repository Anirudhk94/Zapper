// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic','ngCordova'])
.run(function($ionicPlatform,$ionicPopup) {
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
      //if(sms){console.log("Works");}
      
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
})

.controller('homeCtrl',function($scope){
$scope.sayHi1 = function(){
console.log("bloody hard");
}

}) 

.controller('SmsCtrl',function($scope,$ionicPopup,$cordovaSms){
    $scope.sms = {
    number: '8466974974',
    message: 'This is some dummy text'
  };
    
    
    $scope.showAlert = function(cmv) {
       var alertPopup = $ionicPopup.alert({
         title: 'Message Status!',
         template: cmv
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
      $cordovaSms
        .send('8466974974', $scope.msg , options)
        .then(function() {
          //$scope.showAlert("Command Delivered!")
         console.log('Success');
          // Success! SMS was sent
        }, function(error) {
          $scope.showAlert("Command Failed");
          console.log('Error');
          // An error occurred
        });  
        }
    }

  });
})

.controller('PopupCtrl',function($scope, $ionicPopup, $ionicLoading) {
    
    $scope.btStatus = 0;
    
    $scope.showAlert = function(msgd) {
    var alertPopup = $ionicPopup.alert({
     title: 'Alert for Blutooth!',
     template: msgd
   });
    alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
       
   });
 };
        
        
        
    $scope.showList= function(){
        $ionicLoading.show({
      template: '<p>Connecting...<ion-spinner icon="android"></ion-spinner></p>',
            animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
    });
    };
    
     $scope.appliance = {value0: false};
     $scope.btStatus = 1;
     $scope.toggleChange = function(){
         
         //if($scope.blue===0){
         //$scope.showConfirm();
            // $scope.showList();
         //}
        
         if(String(arguments[0])==="0"){
            $scope.btStatus = 1;
             if($scope.appliance.value0){
             $scope.showConfirm();
             }
             else{
                 document.getElementById('v').style.display = "none";
                 bluetoothSerial.disconnect();
                 $scope.btStatus=0;
             }
             
         }
 
         
     };
    
    $scope.sendCommand = function(rtg){
    
     bluetoothSerial.write(""+rtg, function () {
     //$scope.showAlert(rtg);
     }, function(){
     $scope.showAlert("Failed");
     });
     
    };
    
   
 $scope.showConfirm = function() {
     
   var confirmPopup = $ionicPopup.confirm({
     title: 'Bluetooth',
     template: 'Connect to prototype?'
   });

   confirmPopup.then(function(res) {
        bluetoothSerial.disconnect();
       $scope.showList();
     if(res){    
     bluetoothSerial.enable(
        function() {
           bluetoothSerial.connectInsecure('30:14:10:15:14:28',
                                           function(){document.getElementById('v').style.display = "block"; $ionicLoading.hide();},
                                           function(){$ionicLoading.hide();document.getElementById("cha").checked = false; $scope.appliance.value0 =false;$scope.showAlert('Prototype out of range!');});
            
        },
        function() {
            console.log("The user did *not* enable Bluetooth");
            document.getElementById("cha").checked = false;
            $scope.appliance.value0 = false;
             $scope.btStatus = 0;
            $ionicLoading.hide();
            $scope.showAlert('Bluetooth not enabled!');
            
        }
    ); 
     }else{
         document.getElementById("cha").checked = false;
         $scope.appliance.value0 = false;
          $scope.btStatus = 0;
         $ionicLoading.hide();
         console.log("The user did *not* enable Bluetooth");
     }
   });
 };
    
})


.controller('SettingCtrl', function($scope, LoginService, $ionicPopup, $state) {

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
})

.controller('creditCtrl',function($scope){
})

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
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
})

.service('LoginService', function($q) {
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
})


.config(function($stateProvider, $urlRouterProvider) {
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


