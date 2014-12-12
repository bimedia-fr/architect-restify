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

var fs = require('fs'), net = require('net');

module.exports = {
    listen: function (server, options, cb) {
        server.listen(options.socket);
        // double-check EADDRINUSE
        server.on('error', function (e) {
            if (e.code !== 'EADDRINUSE') {
                cb(e);
            }
            net.connect({
                path: options.socket
            }, function () {
                // really in use: re-throw
                cb(e);
            }).on('error', function (e) {
                if (e.code !== 'ECONNREFUSED') {
                    cb(e);
                }
                // not in use: delete it and re-listen
                fs.unlinkSync(options.socket);
                server.listen(options.socket);
            });
        });
        cb(null, server);
    }
};