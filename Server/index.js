
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');

var app = express();


// Middleware
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // Custom headers
    res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// DIRTY

var router = express.Router();
var pg = require('pg');
var config = require('./config');

var conString = config.db_url;
    
app.get('/api/sieges', function(req,res) {
        pg.connect(conString, function (err, client, done) {
        if (err) {
            console.error('Could not connect to postgres', err);
            var err = new Error("Could not connect to postgres");
            err.http_code = "500";
            res.status(err.http_code).send(err.message);
            return;
        }
        client.query('SELECT id, ST_AsGeoJSON(geom) FROM siege', function (err, result) {
            //call `done()` to release the client back to the pool
            done();
            if (err) {
                console.error('Error running query', err);
                var err = new Error("Bad query");
                err.http_code = "400";
                res.status(400).send('Erreur');
                return;
            }
            
            transform(result.rows, function(data){
                res.status(200).send(data);
            })
            
        });
    });
});

app.post('/api/sieges', function(req,res) {
    
    
        var startx;
        var lastx;
        var starty;
        var lasty;
    
        var size = 0.6;
        if (req.body.tiles) {
            req.body.tiles.forEach(function(tile){
               startx = tile[0]*0.7 // -> x
               starty = tile[1]*0.7 // -> y
               lastx = startx + size;
               lasty = starty + size;
                
                insert(startx,starty,lastx,lasty, function(err,data){
                   if (err) {
                       res.status(err.http_code).send(err.message);
                       return;
                   } else {
                       console.log("Seat inserted");
                   }
                }); 
            });
            res.status(201).send("Done !");
        } else {
            if (req.body.x && req.body.y) {
                if (req.body.type == 'coord') {
                    startx = req.body.x;
                    starty = req.body.y;
                } else if (req.body.type == 'tiles') {
                    startx = req.body.x*0.7;
                    starty = req.body.y*0.7;
                } else {
                    res.status(400).send("Erreur, veuillez renseigner le type (coord ou tiles)");
                    return;
                }
            } else if (req.body.tilex && req.body.tiley) {
                startx = req.body.tilex*0.7;
                starty = req.body.tiley*0.7;
            } else {
                res.status(400).send("Erreur, veuillez renseigner startx, starty ou tilex, tiley")
                return;
            }


            

            // 3 -> 2.1
            // 2 -> 1.4
            // 1 -> 0.7
            // 0 -> 0
            lastx = startx + size;
            lasty = starty + size;
            var offset = 0.1;
            insert(startx,starty,lastx,lasty);
        }
        

});

function insert(startx,starty,lastx,lasty,callback) {
        pg.connect(conString, function (err, client, done) {
        if (err) {
            console.error('Could not connect to postgres', err);
            var err = new Error("Could not connect to postgres");
            err.http_code = "500";
            return fn(err, null);
        }
        client.query('INSERT INTO siege (geom) VALUES (ST_MakeEnvelope('+startx+','+starty+','+lastx+','+lasty+', 4326))', function (err, result) {
            //call `done()` to release the client back to the pool
            done();
            if (err) {
                console.error('Error running query', err);
                var err = new Error("Bad query");
                err.http_code = "400";
                callback(err,null);
            }
            
            transform(result.rows, function(data){
                callback(null,data);
            })
            
        });
    });
}

function transform(data, callback) {
    var result = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": 4,
                "geometry": {
                    "type":"Polygon",
                    "coordinates":[[[0,0],[0,0.6],[0.6,0.6],[0.6,0],[0,0]]]
                }
            }
        ]
    };
    
    var i = 0;
    data.forEach(function(d){
        result.features[i] = {
            "type": "Feature",
            "id": d.id,
            "geometry": JSON.parse(d.st_asgeojson)
        };
        i++;
    })
    return callback(result);
}



// If no route is matched, send a 404



// Start the server
//server.listen(3000);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), "0.0.0.0", function() {
    console.log('Server listening on port ' + server.address().port)
});

