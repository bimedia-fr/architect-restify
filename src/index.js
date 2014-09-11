/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

module.exports = function startup(options, imports, register) {
    var restify = require('restify');

    // Process options and default values
    var port = options.port;
    var host = options.host || "0.0.0.0";
    var on404 = options.on404 || function (req, res) {
            res.writeHead(404);
            res.end("Not Found\n");
        };
    var on500 = options.on500 || function (req, res, err) {
            res.writeHead(500);
            res.end(err.stack);
        };
    
    var server = restify.createServer({
        name: options.name || 'restify-server',
        version: options.name || '0.0.1'
    });
    
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser({ mapParams: false }));
    server.use(restify.gzipResponse());

    server.listen(port, host, function (err) {
        if (err) {
            return register(err);
        }
        //console.log("HTTP server listening on http://%s%s/", options.host || "localhost", port === 80 ? "" : ":" + port);
        register(null, {
            // When a plugin is unloaded, it's onDestruct function will be called if there is one.
            onDestruct: function (callback) {
                server.close(callback);
            },
            rest: server
        });
    });

};
