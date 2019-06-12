/* global angular */

angular
    .module("app", ["ngRoute"])
    .config(function($routeProvider) {
        $routeProvider.
        when("/", {
            templateUrl: "workspace/info.html",

        }).
        when("/integrations", {
            templateUrl: "workspace/info-integrations.html",

        }).
        when("/ui/v1/motogp", {
            controller: "ListCtrl",
            templateUrl: "workspace/views/list.html"
        }).
        when("/ui/v1/motogp/edit/:province/:year", {
            controller: "EditCtrl",
            templateUrl: "workspace/views/edit.html"
        }).
        when("/charts/v1/motogp/", {
            controller: "ChartsCtrl",
            templateUrl: "workspace/charts/charts.html"
        }).
        when("/integrations/v1/motogp/", {
            controller: "IntegrationsCtrl",
            templateUrl: "workspace/integrations/integrations.html"

        });


    });

console.log("Contacts App Initialized.");
