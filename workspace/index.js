var express = require("express");
var request = require("request");
var cors = require("cors");
var bodyParser = require("body-parser");
var motoGpApi = require("./motogp-api");

var path = require("path");

var app = express();

app.use("/", express.static(__dirname + "/public"));


app.use("/ui/v1/motogp", express.static(path.join(__dirname, "/public/views")));


app.use(bodyParser.json());

var port = process.env.PORT || 8080;
const MongoClient = require("mongodb").MongoClient;

// ======================================================== PETI =====================================================================
const uri = "mongodb+srv://test:test@sos-sb5wi.mongodb.net/sos1819?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });


var motogp;

client.connect(err => {
    motogp = client.db("sos1819").collection("motogp-data");
    motoGpApi.register(app, motogp);
    console.log("Connected!");
});

//consumicion de API de Jesus Ezcurra con proxy

var paths='/proxy1';
var apiServerHost1 = 'https://sos1819-06.herokuapp.com/api/v1/uefa-club-rankings';

app.use("/proxy1", function(req, res) {
  //var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+ apiServerHost1);
  req.pipe(request(apiServerHost1)).pipe(res);
});

//consumicion de API de Maria Dolores Lopez


var paths='/proxy2';
var apiServerHost2 = 'https://sos1819-08.herokuapp.com/API/v1/tourists-by-countries';


app.use("/proxy2", function(req, res) {
  //var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+ apiServerHost2);
  req.pipe(request(apiServerHost2)).pipe(res);
});

//consumicion de API de Pablo Garcia

var paths='/proxy3';
var apiServerHost3 = 'https://sos1819-02.herokuapp.com/api/v1/companies-stats/';


app.use("/proxy3", function(req, res) {
  //var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+ apiServerHost3);
  req.pipe(request(apiServerHost3)).pipe(res);
});

//consumicion de API de Juan Pedro

var paths='/proxy4';
var apiServerHost4 = 'https://sos1819-04.herokuapp.com/api/v1/beer-consumed-stats';


app.use("/proxy4", function(req, res) {
  //var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+ apiServerHost4);
  req.pipe(request(apiServerHost4)).pipe(res);
});

//consumicion de API de Gauthier

var paths='/proxy5';
var apiServerHost5 = 'https://sos1819-09.herokuapp.com/api/v2/climate-stats/';


app.use("/proxy5", function(req, res) {
  //var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+ apiServerHost5);
  req.pipe(request(apiServerHost5)).pipe(res);
});


//consumicion de API de Antonio Jesus

var paths='/proxy6';
var apiServerHost6 = 'https://sos1819-11.herokuapp.com/api/v1/general-public-expenses/';


app.use("/proxy6", function(req, res) {
  //var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+ apiServerHost6);
  req.pipe(request(apiServerHost6)).pipe(res);
});

//integracion api externa
var paths ='/proxyExterno';
var apiServerHost7 = 'https://data.police.uk/api/crimes-street-dates';


app.use("/proxyExterno", function(req, res) {
  //var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+ apiServerHost7);
  req.pipe(request(apiServerHost7)).pipe(res);
});


//integracion api externa2
var paths ='/proxyExterno2';
var apiServerHost8 = 'https://restcountries.eu/rest/v2/all';


app.use("/proxyExterno2", function(req, res) {
  //var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+ apiServerHost8);
  req.pipe(request(apiServerHost8)).pipe(res);
});


//integracion api externa3
var paths ='/proxyExterno3';
var apiServerHost9 = 'https://api.jcdecaux.com/vls/v1/stations/?contract=Seville&apiKey=6fa39265431480ca0b5f3393cd78f29e2d436882';


app.use("/proxyExterno3", function(req, res) {
  //var url = apiServerHost + req.baseUrl + req.url;
  console.log('piped: '+ apiServerHost9);
  req.pipe(request(apiServerHost9)).pipe(res);
});


//====================================NO TOCAR===================================================
app.listen(port, () => {                            //Arrancar el servidor
    console.log("I'm ready on port " + port); 

});