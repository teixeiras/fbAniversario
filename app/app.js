'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version'
]).
services.factory('srvAuth', [function() {
    watchLoginChange = function() {

        var _self = this;

        FB.Event.subscribe('auth.authResponseChange', function (res) {

            if (res.status === 'connected') {

                /*
                 The user is already logged,
                 is possible retrieve his personal info
                 */
                _self.getUserInfo();

                /*
                 This is also the point where you should create a
                 session for the current user.
                 For this purpose you can use the data inside the
                 res.authResponse object.
                 */

            }
            else {

                /*
                 The user is not logged to the app, or into Facebook:
                 destroy the session on the server.       Z
                 */

            }

        });

    };
    logout = function() {

        var _self = this;

        FB.logout(function(response) {
            $rootScope.$apply(function() {
                $rootScope.user = _self.user = {};
            });
        });

    };


    getUserInfo = function() {

        var _self = this;

        FB.api('/me', function(res) {
            $rootScope.$apply(function() {
                $rootScope.user = _self.user = res;
                console.log(_self.user);
            });
        });

    }


}]);
app.run(['$rootScope', '$window', 'srvAuth',
    function($rootScope, $window, sAuth) {

        $rootScope.user = {};

        $window.fbAsyncInit = function() {
            // Executed when the SDK is loaded

            FB.init({

                /*
                 The app id of the web app;
                 To register a new app visit Facebook App Dashboard
                 ( https://developers.facebook.com/apps/ )
                 */

                appId: '372949612910874',

                /*
                 Adding a Channel File improves the performance
                 of the javascript SDK, by addressing issues
                 with cross-domain communication in certain browsers.
                 */

                channelUrl: 'app/channel.html',

                /*
                 Set if you want to check the authentication status
                 at the start up of the app
                 */

                status: true,

                /*

                 Enable cookies to allow the server to access
                 the session
                 */

                cookie: true,

                /* Parse XFBML */

                xfbml: true
            });

            sAuth.watchLoginChange();

        };

        (function(d){
            // load the Facebook javascript SDK

            var js,
                id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];

            if (d.getElementById(id)) {
                return;
            }

            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";

            ref.parentNode.insertBefore(js, ref);

        }(document));

    }]);

config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/view1'});
}]);
