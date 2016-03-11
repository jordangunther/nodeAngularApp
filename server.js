// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//define modell =======================

var nodeAngularApp = mongoose.model('nodeAngularApp', {
    text: string
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all nodeAngularApps
app.get('/api/nodeAngularApps', function(req, res) {

    // use mongoose to get all nodeAngularApps in the database
    nodeAngularApp.find(function(err, nodeAngularApps) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(nodeAngularApps); // return all nodeAngularApps in JSON format
    });
});

// create nodeAngularApp and send back all nodeAngularApps after creation
app.post('/api/nodeAngularApps', function(req, res) {

    // create a nodeAngularApp, information comes from AJAX request from Angular
    nodeAngularApp.create({
        text : req.body.text,
        done : false
    }, function(err, nodeAngularApp) {
        if (err)
            res.send(err);

        // get and return all the nodeAngularApps after you create another
        nodeAngularApp.find(function(err, nodeAngularApps) {
            if (err)
                res.send(err)
            res.json(nodeAngularApps);
        });
    });

});

// delete a nodeAngularApp
app.delete('/api/nodeAngularApps/:nodeAngularApp_id', function(req, res) {
    nodeAngularApp.remove({
        _id : req.params.nodeAngularApp_id
    }, function(err, nodeAngularApp) {
        if (err)
            res.send(err);

        // get and return all the nodeAngularApps after you create another
        nodeAngularApp.find(function(err, nodeAngularApps) {
            if (err)
                res.send(err)
            res.json(nodeAngularApps);
        });
    });
});