const BASE_PATH = "/api/v1/motogp"

var apiRest = {};


module.exports = apiRest;



apiRest.register = (app, motogp) => {
    app.get(BASE_PATH + "/docs/", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/1804509/S17tS8Nc");
    });


    //GET /deceaseds/
    app.get(BASE_PATH, (req, res) => {

        //Busqueda 
        var begin = parseInt(req.query.from);
        var end = parseInt(req.query.to);

        //Paginacion
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);

        var queries = req.query;

        if (req.query.circuit) {

            queries.circuit = req.query.circuit;
        }

        if (req.query.year) {

            queries.year = Number(req.query.year);
        }

        if (req.query.first) {

            queries.first = Number(req.query.first);
        }

        if (req.query.second) {

            queries.second = Number(req.query.second);
        }

        if (req.query.third) {

            queries.third = Number(req.query.third);
        }
        if (req.query.crash) {

            queries.crash = Number(req.query.crash);
        }



        //Paginacion y busqueda
        if (Number.isInteger(limit) && Number.isInteger(offset) && Number.isInteger(begin) && Number.isInteger(end)) {
            motogp.find({ "year": { $gte: begin, $lte: end } }).skip(offset).limit(limit).toArray((err, motogpArray) => {

                if (err) {

                    res.sendStatus(500);

                }
                else {

                    res.status(200).send(motogpArray.map((c) => {
                        delete c._id;
                        return c;

                    }));

                }


            });

        } //Paginación
        else if (Number.isInteger(limit) && Number.isInteger(offset)) {

            injuredHospitalized.find({}).skip(offset).limit(limit).toArray((err, motogpArray) => {

                if (err) {

                    res.sendStatus(500);

                }
                else {

                    res.status(200).send(motogpArray.map((c) => {
                        delete c._id;
                        return c;

                    }));

                }
            });
        } //Búsqueda
        else if (Number.isInteger(begin) && Number.isInteger(end)) {

            motogp.find({ "year": { $gte: begin, $lte: end } }).toArray((err, motogpArray) => {

                if (err) {

                    res.sendStatus(500);

                }
                else {

                    res.status(200).send(motogpArray.map((c) => {
                        delete c._id;
                        return c;

                    }));

                }
            });

        }
        else {

            // si no esta vacio entra
            if (JSON.stringify(queries) != "{}") {

                motogp.find(queries).toArray((err, motogpArray) => {

                    if (err) {

                        res.sendStatus(500);

                    }
                    else {

                        if (!motogpArray.length) {

                            res.sendStatus(404);

                        }
                        else {

                            res.status(200).send(motogpArray.map((c) => {
                                delete c._id;
                                return c;

                            }));
                        }


                    }
                });

            }
            else {

                motogp.find({}).toArray((err, motogpArray) => {

                    if (err) {

                        res.sendStatus(500);

                    }
                    else {

                        res.status(200).send(motogpArray.map((c) => {
                            delete c._id;
                            return c;

                        }));

                    }
                });

            }
        }

    });

    //GET /api/v1/YYYYYY/loadInitialData

    app.get(BASE_PATH + "/loadInitialData", (req, res) => {

        var newMotogp = [{
                circuit: "Jerez",
                year: "2010",
                first: "Valentino Rossi",
                second: "Tito Rabat",
                third: "Jorge Lorenzo",
                crash: "2"

            },

            {
                circuit: "Cheste",
                year: "2010",
                first: "Jorge Lorenzo",
                second: "Valentino Rossi",
                third: "",
                crash: "10"
            },

            {
                circuit: "Mugello",
                year: "2010",
                first: "Jorge Lorenzo",
                second: "Tito Rabat",
                third: "Valentino Rossi",
                crash: "10"
            },

            {
                circuit: "Badajoz",
                year: "2010",
                first: "Jorge Lorenzo",
                second: "Dani Pedrosa",
                third: "",
                crash: "10"
            },

            {
                circuit: "Badajoz",
                year: "2010",
                first: "414",
                second: "507",
                third: "",
                crash: "10"
            }
        ];

        motogp.find({}).toArray((err, motogpArray) => {
            if (err) {
                console.log("Error: " + err);
            }
            if (motogpArray.length == 0) {
                motogp.insert(newMotogp);
                res.sendStatus(200);
            }
            else {
                 res.send(405, 'Method Not Allowed');
            }
        });
    });


    //POST /deceaseds/

    app.post(BASE_PATH, (req, res) => {

        var newMotogp = req.body;
        var circuit = req.body.circuit;
        var year = req.body.year;

        motogp.find({ circuit: circuit, year: year }).toArray((err, motogpArray) => {
            if (err) {
                console.log(err);
            }
            if (motogpArray != 0) {

                res.sendStatus(409);

            }
            else if (req.body.hasOwnProperty("circuit") == false || req.body.hasOwnProperty("year") == false || req.body.hasOwnProperty("first") == false ||
                req.body.hasOwnProperty("second") == false || req.body.hasOwnProperty("third") == false || req.body.hasOwnProperty("crash") == false || req.body.province != circuit) {

                res.sendStatus(400);

            }
            else {

                motogp.insert(newMotogp);

                res.sendStatus(201);
            }
        });
    });



    //POST /circuit/Jerez
    app.post(BASE_PATH + "/:circuit", (req, res) => {

        res.send(405, 'Method Not Allowed');
    });



    //GET /motogp/jerez/2015

    app.get(BASE_PATH + "/:circuit/:year", (req, res) => {
        var circuit = req.params.circuit;
        var year = Number(req.params.year);

        motogp.find({ circuit: circuit, year: year }).toArray((err, filtered) => {
            if (err) {
                console.log("Error:" + err);
            }
            if (filtered.length >= 1) {
                delete filtered[0]._id;
                res.json(filtered[0]);

            }
            else {
                res.sendStatus(404);
            }
        });
    });

    //GET /circuit/cheste
    app.get(BASE_PATH + "/:province", (req, res) => {
        var circuit = req.params.province;

        motogp.find({ circuit: circuit }).toArray((err, filtered) => {
            if (err) {
                console.log("Error:" + err);
            }
            if (filtered.length >= 1) {
                res.send(filtered.map((c) => {
                    delete c._id;
                    return c;
                }));
            }
            else {
                res.sendStatus(404);
            }
        });
    });

     //PUT /circuit/le-mans

     app.put(BASE_PATH+"/:circuit", (req, res) => {
        res.sendStatus(405);
    
     });


    app.put("/api/v1/motogp/:circuit/:year", (req, res) => {
        var year = Number(req.params.year);
        var circuit = req.params.circuit;
        var updatedMotogp = req.body;
        motogp.find({ "circuit": circuit, "year": year }).toArray((err, motogpArray) => {
            if (err)
                console.log(err);
            if (motogpArray == 0) {
                res.sendStatus(404);
            }
            else if (req.body.hasOwnProperty("circuit") == false || req.body.hasOwnProperty("first") == false || req.body.hasOwnProperty("second") == false ||
                req.body.hasOwnProperty("year") == false || req.body.hasOwnProperty("third") == false || req.body.hasOwnProperty("crash") == false ||
                req.body.province != province || req.body.year != year) {
                res.sendStatus(400);
            }
            else {
                deceaseds.updateOne({ "circuit": circuit, "year": year }, { $set: updatedMotogp });
                res.sendStatus(200);
            }
        });
    });


    //PUT /motogp

    app.put(BASE_PATH, (req, res) => {

        res.sendStatus(405);
    });


    //DELETE /motogp/Mugello

    app.delete(BASE_PATH + "/:circuit", (req, res) => {

        var circuit = req.params.circuit;
        motogp.find({ "circuit": circuit }).toArray((err, motogpArray) => {
            if (err) {
                console.log("Error: " + err);
            }
            if (motogpArray.length == 0) {
                res.send(404);
            }
            else {
                motogp.deleteOne({ "circuit": circuit });
                res.send(200);
            }
        });

    });


    //DELETE /deceaseds/Seville/2016
    app.delete(BASE_PATH + "/:circuit/:year", (req, res) => {
        var year = Number(req.params.year);
        var circuit = req.params.circuit;
        motogp.find({ "circuit": circuit, "year": year }).toArray((err, motogpArray) => {
            if (err) {
                console.log("Error: " + err);
            }
            if (motogpArray.length == 0) {
                res.send(404);
            }
            else {
                motogp.deleteOne({ "circuit": circuit, "year": year });
                res.send(200);
            }
        });
    });


    //DELETE /deceaseds/

    app.delete(BASE_PATH, (req, res) => {
        motogp.remove({});
        res.sendStatus(200);
    });
};
