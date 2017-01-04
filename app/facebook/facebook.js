/**
 * Created by Ishit Desai on 12/18/2016.
 */

'use strict';

angular.module('ngSocial.facebook', ['ngRoute','ngFacebook'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/facebook', {
            templateUrl: 'facebook/facebook.html',
            controller: 'FacebookCtrl'
        });
    }])
    .config(['$facebookProvider', function ($facebookProvider) {
        $facebookProvider.setAppId("175128692961449");
        $facebookProvider.setPermissions(["email", "public_profile", "user_posts", "publish_actions", "user_photos"]);
    }])
    .run(['$rootScope', function ($rootScope) {
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }])
    .controller('FacebookCtrl',['$scope','$facebook', function($scope,$facebook) {
        $scope.isLoggedIn = false;

        $scope.login = function(){
          $facebook.login().then(function () {
              $scope.isLoggedIn = true;
              refresh();
          });
        }

        $scope.logout = function(){
            $facebook.logout().then(function () {
                $scope.isLoggedIn = false;
                refresh();
            });
        }

        function refresh() {
            $facebook.api('/me').then(function(response){
                $scope.welcomeMsg = "Welcome "+ response.name;
                $scope.isLoggedIn = true;
                console.log(response);
                $scope.userInfo = response;
                   $scope.userInfo.first_name = 'Ishit';
                    $scope.userInfo.last_name = 'Desai';
                    $scope.userInfo.email = 'ishit101192@gmail.com';
                   $scope.userInfo.gender = 'Male';
                    $scope.userInfo.locale = 'en_US';
                $facebook.api('/me/picture').then(function(response) {
                    $scope.picture = "response.data.url";
                    $facebook.api('/me/permissions').then(function (response) {
                        $scope.permissions = response.data;
                        $facebook.api('/me/posts').then(function (response) {
                            $scope.posts = response.data;
                        });
                    });
                });
            },
            function(err){
                $scope.welcomeMsg = "Please Log In";
            });
        }

        $scope.postStatus = function() {
            var body = this.body;
            $facebook.api('/me/feed','post',{message : body}).then(function() {
               $scope.msg = "Thanks for Posting";
                refresh();
            });
        }
        refresh();
    }]);