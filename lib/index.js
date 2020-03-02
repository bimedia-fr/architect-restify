/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
/* 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
var restify = require('restify');
var socklisten = require('unix-listen');
var listen = require('listen-interface');

var DEFAULT_PLUGINS = {
    queryParser : {
        mapParams : false
    },
    bodyParser : {
        mapParams : false
    },
    gzipResponse : {}
};
/*
 * instanciate plugin using base object if available
 */
function reify(base, plugs) {
    return function (name) {
        var middleware;
        if (typeof plugs[name] == 'function') {
            middleware = plugs[name]();
        } else if (base[name] && plugs[name]) {
            middleware = base[name](plugs[name]);
        }
        return middleware;
    };
}


function registerPlugins(server, config) {

    var plugins = Object.assign({}, DEFAULT_PLUGINS, config);

    Object.keys(plugins)
        .filter(name => name != 'pre')
        .map(reify(restify.plugins, plugins))
        .forEach((m) => {
            server.use(m);
        });
    if (plugins.pre) {
        Object.keys(plugins.pre)
            .map(reify(restify.plugins.pre, plugins.pre))
            .forEach((m) => {
                server.pre(m);
            });
    }
}

module.exports = function startup(options, imports, register) {

    function notifyError(err, res) {
        if (err) {
            register(err);
        }
    }
    var config = Object.assign({
        name: options.name ||  'restify-server',
        version: options.version || '0.0.1',
        formatters: options.formatters || {}
    }, options.server);

    var server = restify.createServer(config);
    // expose errors with server
    server.errors = restify.errors;

    registerPlugins(server, options.plugins || {});

    function listenCb(err) {
        if (err) {
            register(err);
        } else {
            register(null, {
                onDestroy: function (callback) {
                    server.close(callback);
                },
                rest: server
            });
        }
    }

    server.once('listening', listenCb);

    if (options.socket) {
        socklisten(server, options.socket, notifyError);
    } else if (options['interface']) {
        listen(server, options, notifyError);
    } else {
        server.listen(options.port, options.host);
    }

    return server;
};
