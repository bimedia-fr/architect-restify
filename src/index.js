/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
"use strict";

var restify = require('restify');

var DEFAULT_PLUGINS = {
    queryParser: {},
    bodyParser : { mapParams: false },
    gzipResponse : {}
};

function registerPlugins(server, plugins) {
    Object.keys(DEFAULT_PLUGINS).forEach(function (name) {
        if (!plugins[name]) {
            plugins[name] = DEFAULT_PLUGINS[name];
        }
    });
    Object.keys(plugins || {}).forEach(function (name) {
        if (restify[name]) {
            server.use(restify[name](plugins[name]));
        }
    });
}
    


module.exports = function startup(options, imports, register) {

    var config = {
        name: options.name ||  'restify-server',
        version: options.name || '0.0.1'
    };
    
    var server = restify.createServer(config);

    server.use(restify.acceptParser(server.acceptable));

    registerPlugins(server, options.plugins || {});

    server.listen(options.port, options.host || "0.0.0.0", function (err) {
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
