var app = angular.module("app");
app.controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {

    console.log("Edit Controller initialized!");


    
    var API = "/api/v1/motogp";
    //var API = "https://sos1819-14.herokuapp.com/api/v1/motogp";
    var circuit = $routeParams.circuit;
    var year = $routeParams.year;



    $scope.data = "Disfrute de nuestra página";

    $http.get(API + "/" + circuit + "/" + year).then(function(response) {
        console.log("Data Recieved: " + JSON.stringify(response.data, null, 2));
        $scope.updatedDeceased = response.data;

    });

    $scope.updateMotogp = function() {
        console.log("Updating a new circuit");


        $http.put(API + "/" + circuit + "/" + year, $scope.updatedMotogp).then(function(response) {
            $scope.status = "Status: Registro modificado con éxito";
            console.log("POST Response " + response.status + "" + response.data);
            $location.path("/ui/v1/motogp");

        }, function() {
            if ($scope.updatedDeceased.first == null ||
                $scope.updatedDeceased.second == null ||
                $scope.updatedDeceased.third == null ||
                $scope.updatedDeceased.crash == null) {
                $scope.status = "Error: debe completar todos los campos"
            }
        });
    };
}]);