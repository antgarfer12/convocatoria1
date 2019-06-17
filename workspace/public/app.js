/* global angular */

angular
    .module("app", ["ngRoute"])
    .config(function($routeProvider) {
        $routeProvider.
        when("/", {
            templateUrl: "info.html",

        }).
        when("/integrations", {
            templateUrl: "info-integrations.html",

        }).
        when("/infoanalytics", {
            templateUrl: "info-analytics.html",

        }).
        when("/ui/v1/motogp", {
            controller: "ListCtrl",
            templateUrl: "views/list.html"
        }).
        when("/ui/v1/motogp/edit/:circuit/:year", {
            controller: "EditCtrl",
            templateUrl: "views/edit.html"
        }).
        when("/charts/v1/motogp/", {
            controller: "ChartsCtrl",
            templateUrl: "/charts/charts.html"
        }).
        when("/integrations/v1/motogp/", {
            controller: "IntegrationsCtrl",
            templateUrl: "integrations/integrations.html"

        });


    });

console.log("Contacts App Initialized.");
