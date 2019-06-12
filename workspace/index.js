var express = require("express");
//var request = require("request");
//var cors = require("cors");
var bodyParser = require("body-parser");
var motoGpApi = require("./motogp-api");

var path = require("path");

var app = express();

app.use("/", express.static(__dirname + "workspace/public"));


app.use("/app-agf", express.static(path.join(__dirname, "workspace/public/info.html")));


app.use(bodyParser.json());

var port = process.env.PORT || 8080;
const MongoClient = require("mongodb").MongoClient;

// ======================================================== PETI =====================================================================
const uri = "mongodb+srv://test:test@sos-sb5wi.mongodb.net/sos1819?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });


var conMotogp;

client.connect(err => {
    conMotogp = client.db("sos1819").collection("motogp-data");
    motoGpApi.register(app, conMotogp);
    console.log("Connected!");
});

//====================================NO TOCAR===================================================
app.listen(port, () => {                            //Arrancar el servidor
    console.log("I'm ready on port " + port); 

});