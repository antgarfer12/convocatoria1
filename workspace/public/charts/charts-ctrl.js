angular
    .module("app")
    .controller("ChartsCtrl", ["$scope", "$http", "$routeParams", "$location", "$rootScope", function($scope, $http, $routeParams, $location, $rootScope) {

        console.log("ChartsCtrl loaded.");
        var API = "/api/v1/motogp";
        var dato = [];

        refresh();

        function refresh() {
            $http.get(API).then(function(response) {
                    var res = JSON.stringify(response.data, null, 2);
                    if (response.data.length === 0) {

                    }
                    console.log(response.data);

                    var anyo1Count = response.data.filter(motogp => motogp.year === 2019).length;
                    var anyo2Count = response.data.filter(motogp => motogp.year === 2015).length;
                    var anyo3Count = response.data.filter(motogp => motogp.year === 2010).length;
                    



                    Highcharts.chart('container', {
                        chart: {
                            type: 'pyramid3d',
                            options3d: {
                                enabled: true,
                                alpha: 10,
                                depth: 50,
                                viewDistance: 50
                            }
                        },
                        title: {
                            text: 'Total de carreras en 2010, 2015 y 2019'
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                    allowOverlap: true,
                                    x: 10,
                                    y: -5
                                },
                                width: '60%',
                                height: '80%',
                                center: ['50%', '45%']
                            }
                        },
                        series: [{
                            name: 'Unique users',
                            data: [
                                ['2019', anyo1Count],
                                ['2015', anyo2Count],
                                ['2010', anyo3Count]
                            ]
                        }]
                    });


                    // Google Geochart
                    $http.get(API).then(function(response) {
                        var i;
                        for (i = 0; i < response.data.length; i++) {
                            dato.push(response.data[i].crash);
                        }
                        google.charts.load('current', {
                            'packages': ['geochart'],
                            // Note: you will need to get a mapsApiKey for your project.
                            // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                            'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
                        });
                        google.charts.setOnLoadCallback(drawRegionsMap);

                        function drawRegionsMap() {
                            var data = google.visualization.arrayToDataTable([
                                ['Country', 'motogp'],
                                ['Spain', dato[4]],
                                ['France', dato[4]],
                                ['Ireland', dato[4]],
                                ['Italy', dato[4]]
                            ]);

                            var options = {};

                            var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

                            chart.draw(data, options);
                        }
                    });


                    //CANVASJS
                    var datos = [];

                    $http.get(API).then(function(response) {
                        var i;
                        for (i = 0; i < response.data.length; i++) {
                            datos.push({ x: response.data[i].crash, y: response.data[i].first, z: response.data[i].year, name: response.data[i].circuit });
                        }

                        console.log(datos);

                        var chart = new CanvasJS.Chart("chartContainer", {
                            animationEnabled: true,
                            zoomEnabled: true,
                            theme: "light2",
                            title: {
                                text: "Capitalization And Education Expense"
                            },
                            axisX: {
                                title: "",
                                suffix: "",
                                minimum: 0,
                                maximum: 100,
                                gridThickness: 1
                            },
                            axisY: {
                                title: "",
                                suffix: "",
                                minimum: 0,
                                maximum: 100,
                                gridThickness: 1

                            },
                            data: [{
                                type: "bubble",
                                toolTipContent: "<b>{name}</b><br/>Number: {x}  <br/> Lifes: {y} . <br/> Year: {z}",
                                dataPoints: datos
                            }]
                        });

                        chart.render();

                    });

                },
                function(response) {
                    $scope.dataResponse = response.status + ", " + response.statusText;
                });
        }

    }]);
