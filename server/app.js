var express = require('express');
var app = express();
var https = require('https');
var fs = require("fs");

if (process.env.NODE_ENV === 'development') {
    app.use(require('connect-livereload')());
}

app.get('/api/stops', function (req, res) {
    https.request({
        host: 'nextbus.comfortdelgro.com.sg',
        path: '/eventservice.svc/BusStops'
    }, function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            res.send(str);
        });
    }).end();
});

app.get('/api/buses', function(req, res) {
    https.request({
        host: 'nextbus.comfortdelgro.com.sg',
        path: '/eventservice.svc/Shuttleservice?busstopname=' + req.query.busstopname
    }, function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            res.send(str);
        });
    }).end();
});

app.use('/scripts', express.static(__dirname + '/../app/scripts'));
app.use('/styles', express.static(__dirname + '/../app/styles'));
app.use('/index.html', express.static(__dirname + '/../app/index.html'));
app.use('/nushackerspace.html', express.static(__dirname + '/../app/nushackerspace.html'));
app.get('/', function(req, res) {
    fs.createReadStream(__dirname + '/../app/index.html').pipe(res);
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
