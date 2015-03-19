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
var test = require('unit.js');
var iface = require('../lib/interfaces');
var os = require('os');

describe('[ARCHITECT][RESTIFY]', function () {

    describe('[INTERFACE]', function () {

        it('Listener', function (done) {
            iface.listen({
                listen: function (port, host) {
                    test.string(host).is('127.0.0.1');
                }
            }, {'interface': Object.keys(os.networkInterfaces())[0], port: 0}, function (err, res) {
                test.assert.ifError(err);
                test.object(res).isNotEmpty();
                done();
            });
        });

    });

});