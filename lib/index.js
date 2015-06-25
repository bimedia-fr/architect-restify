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
var sockets = require('./sockets');
var interfaces = require('./interfaces');

var DEFAULT_PLUGINS = {
    queryParser: {
        mapParams: false
    },
    bodyParser: {
        mapParams: false
    },
    gzipResponse:  {}
};


function registerPlugins(server, plugins) {

    var PLUGINS = Object.keys(plugins || {});

    _.difference(Object.keys(DEFAULT_PLUGINS), PLUGINS).forEach(function (name) {
        server.use(restify[name](DEFAULT_PLUGINS[name]));
    });
    PLUGINS.forEach(function (name) {
        if (typeof plugins[name] == 'function') {
            server.use(plugins[name]());
        } else if (restify[name]) {
            server.use(restify[name](plugins[name]));
        }
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
        sockets.listen(server, options, notifyError);
    } else if (options['interface']) {
        interfaces.listen(server, options, notifyError);
    } else {
        server.listen(options.port, options.host);
    }

    return server;
};
