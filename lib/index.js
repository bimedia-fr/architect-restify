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
var _ = require('lodash');
var socklisten = require('unix-listen');
var listen = require('listen-interface');

var DEFAULT_PLUGINS = {
    handlers : {
        queryParser : {
            mapParams : false
        },
        bodyParser : {
            mapParams : false
        },
        gzipResponse : {}
    },
    prehandlers : {

    }
};


function registerPlugins(server, plugins) {

    plugins = (Object.keys(plugins).length == 2 && plugins.prehandlers && plugins.handlers) ? {
        prehandlers : plugins.prehandlers,
        handlers : plugins.handlers
    }
            : {
                prehandlers : {},
                handlers : plugins
            };

    [ {
        "function" : "pre",
        "objectKey" : "prehandlers"
    }, {
        "function" : "use",
        "objectKey" : "handlers"
    } ].forEach(function(item) {

        var serverfunction = item["function"];
        var objectKey = item["objectKey"];

        var PLUGINS = Object.keys(plugins[objectKey] || {});

        _.difference(Object.keys(DEFAULT_PLUGINS[objectKey]), PLUGINS).forEach(
                function(name) {
                    server[serverfunction](restify[name]
                            (DEFAULT_PLUGINS[objectKey][name]));
                });
        PLUGINS.forEach(function(name) {
            var middle;
            if (typeof plugins[objectKey][name] == 'function') {
                middle = plugins[objectKey][name]();
            } else if (restify[name] && plugins[objectKey][name]) {
                middle = restify[name](plugins[objectKey][name]);
            }
            server[serverfunction](middle);
        });
    });
}

module.exports = function startup(options, imports, register) {

    function notifyError(err, res) {
        if (err) {
            register(err);
        }
    }
    var config = {
        name: options.name ||  'restify-server',
        version: options.version || '0.0.1',
        formatters: options.formatters || {}
    };

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
