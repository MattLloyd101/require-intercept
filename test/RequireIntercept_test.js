const chai = require('chai')
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const Module = require('module');
const realRequire = Module.prototype.require;

describe('RequireIntercept', () => {

    let requireIntercept;
    let TestModule;
    let mockDependency;
    let mockAround;
    
    beforeEach(() => {
        requireIntercept = require('../src/RequireIntercept');
        const testModuleIntercept = requireIntercept('../stubs/TestModule');
        TestModule = testModuleIntercept.module;
        mockDependency = testModuleIntercept.mockDependency;
        mockAround = testModuleIntercept.mockAround;
    });

    afterEach(() => {
        const keys = Object.keys(require.cache);
        keys.map((key) => {
            delete require.cache[key];
        });
    })

    it('Should require the module with no mocking', () => {

        const testInstance = new TestModule();

        expect(testInstance.callDependency()).to.be.true;
    });

    it('Should replace the module dependency with the mock', () => {

        const testInstance = new TestModule();

        mockDependency('./TestDependency', { "realDependency": false });

        expect(testInstance.callDependency()).to.be.false;
    });

    it('Should replace the module dependency with the mock', () => {

        const testInstance = new TestModule();

        expect(testInstance.callDependency()).to.be.true;

        mockAround('./TestDependency', { "realDependency": false }, () => {
            expect(testInstance.callDependency()).to.be.false;
        });

        expect(testInstance.callDependency()).to.be.true;
    });
});