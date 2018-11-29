"use strict";

const Hoodwinker = require('hoodwinker');
const Module = require('module');
const realRequire = Module.prototype.require;

const mockMapping = {};

class RequireIntercept {

    constructor(path) {
        this.path = path;
    }

    requireOverride(requested) {
        if (requested === this.path) {
            return realRequire(requested);
        }

        const realModule = realRequire.apply(this, [requested]);
        const proxied = new Hoodwinker(realModule);

        mockMapping[requested] = proxied;

        return proxied.hoodwink;
    }

    mockDependency(path, mock) {
        mockMapping[path].setHoodwinkTarget(mock);
    }

    mockAround(path, mock, body) {
        mockMapping[path].setHoodwinkTarget(mock);
        body(mock);
        mockMapping[path].reset();
    }

    stopMocking(path) {
        mockMapping[path].reset();
    }

    run() {
        Module.prototype.require = this.requireOverride;
        this.module = require(this.path);
        Module.prototype.require = realRequire;
    }
}

module.exports = function(path) {
    const requireInterceptor = new RequireIntercept(path);

    requireInterceptor.run();

    return requireInterceptor;
};