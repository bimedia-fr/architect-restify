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
var module = require('../lib/index');
var http = require('http');

describe('[ARCHITECT][RESTIFY]', function () {

    var server;

    afterEach(function () {
        if (server) {
            server.close();
            server = null;
        }
    });

    describe('[SOCKET]', function () {
        it('Create a server', function (done) {
            server = module({
                socket: '/tmp/architect-restify.sock'
            }, {}, function (err) {
                test.assert.ifError(err);
                done();
            });
        });
    });

    describe('[PORT]', function () {
        it('Create a server ', function (done) {
            server = module({
                plugins: {
                    myPlugin: function () {
                        return function (req, res, next) {
                            done();
                            next();
                        };
                    }
                }
            }, {}, function (err) {

                test.assert.ifError(err);

                server.get({
                    url: '/'
                }, function (req, res, next) {
                    next();
                });

                http.get({
                    port: server.address().port
                }, function (res) {
                    test.number(res.statusCode).is(404);
                })
                .on('error', function (err) {
                    test.assert.ifError(err);
                });
            });

            test.object(server).isNotEmpty();
        });
    });

});