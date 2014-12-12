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

var os = require('os');

module.exports = {
    listen: function (server, options, cb) {
        var interfaces = os.getNetworkInterfaces();
        if (!interfaces[options['interface']]) {
            return cb(new Error('unknown interface name ' + options['interface']));
        }
        var iface = interfaces[options['interface']].filter(function (f) {
            return f.family == (options.family || 'IPv4');
        });
        if (!iface || !iface[0]) {
            return cb(new Error('no ' + (options.family || 'IPv4') + ' family in ' + interfaces[options['interface']]));
        }
        server.listen(options.port, iface[0].address);
        cb(null, server);
    }
};