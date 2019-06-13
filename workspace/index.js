var express = require("express");
//var request = require("request");
//var cors = require("cors");
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

//====================================NO TOCAR===================================================
app.listen(port, () => {                            //Arrancar el servidor
    console.log("I'm ready on port " + port); 

});