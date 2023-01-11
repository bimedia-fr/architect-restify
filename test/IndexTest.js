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
var assert = require('assert');
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
                assert.ifError(err);
                done();
            });
        });
    });

    describe('[PORT]', function () {
        it('Test a custom plugin', function (done) {
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

                assert.ifError(err);

                server.get({
                    url: '/'
                }, function (req, res, next) {
                    res.send({message: 'ok'});
                });

                http.get({
                    port: server.address().port
                }, function (res) {
                    assert.strictEqual(200, res.statusCode);
                })
                .on('error', function (err) {
                    assert.ifError(err);
                });
            });

            assert.ok(server);
        });
        
        it('Test a custom plugin (pre)', function (done) {
            server = module({
                strictNext: false,
                plugins: {
                    pre: {
                        myPlugin: function () {
                            return function (req, res, next) {
                                done();
                                next();
                            };
                        }
                    }
                }
            }, {}, function (err) {

                assert.ifError(err);

                server.get({
                    url: '/'
                }, function (req, res, next) {
                    res.send(404)
                });

                http.get({
                    port: server.address().port
                }, function (res) {
                   assert.strictEqual(404, res.statusCode);
                })
                .on('error', function (err) {
                    assert.ifError(err);
                });
            });

            assert.ok(server);
        });

        it('Test a plugin (pre)', function (done) {
            server = module({
                plugins: {
                    pre: {
                        dedupeSlashes: {}
                    }
                }
            }, {}, function (err) {

                assert.ifError(err);

                server.get({
                    url: '/hello/jake'
                }, function (req, res, next) {
                    res.send(200, 'OK');
                    done();
                    next();
                });

                http.get({
                    path: '/hello//jake',
                    port: server.address().port
                }, function (res) {
                    assert.strictEqual(200, res.statusCode);
                })
                .on('error', function (err) {
                    assert.ifError(err);
                });
            });

            assert.ok(server);
        });
        
        it('Test a replacement plugin', function (done) {
            server = module({
                plugins: {
                    queryParser: function () {
                        return function (req, res, next) {
                            done();
                            next();
                        };
                    }
                }
            }, {}, function (err) {

                assert.ifError(err);

                server.get({
                    url: '/'
                }, function (req, res, next) {
                    res.send(404)
                    next();
                });

                http.get({
                    path: '/?foo=bar',
                    port: server.address().port
                }, function (res) {
                    assert.strictEqual(404, res.statusCode);
                })
                .on('error', function (err) {
                    assert.ifError(err);
                });
            });
            assert.ok(server);
        });
    });
});