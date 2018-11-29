"use strict";

const Hoodwinker = require('hoodwinker');
const Module = require('module');
const realRequire = Module.prototype.require;

class RequireIntercept {

    constructor(path) {
        this.path = path;
        this.mockMapping = {};
    }

    mockDependency(path, mock) {
        this.mockMapping[path].setHoodwinkTarget(mock);
    }

    async mockAround(path, mock, body) {
        this.mockMapping[path].setHoodwinkTarget(mock);
        let out;
        if (body[Symbol.toStringTag] === 'AsyncFunction') {
            out = await body(mock);
        } else {
            out = body(mock);
        }
        this.mockMapping[path].reset();

        return out;
    }

    stopMocking(path) {
        this.mockMapping[path].reset();
    }

    run() {
        const This = this;
        function requireOverride(requested) {
            if (requested === This.path) {
                return realRequire(requested);
            }

            const realModule = realRequire.apply(this, [requested]);
            const proxied = new Hoodwinker(realModule);

            This.mockMapping[requested] = proxied;

            return proxied.hoodwink;
        }

        Module.prototype.require = requireOverride;
        this.module = require(this.path);
        Module.prototype.require = realRequire;
    }
}

module.exports = function(path) {
    const requireInterceptor = new RequireIntercept(path);

    requireInterceptor.run();

    return {
        module: requireInterceptor.module,
        mockDependency: requireInterceptor.mockDependency.bind(requireInterceptor),
        mockAround: requireInterceptor.mockAround.bind(requireInterceptor),
        stopMocking: requireInterceptor.stopMocking.bind(requireInterceptor)
    };
};