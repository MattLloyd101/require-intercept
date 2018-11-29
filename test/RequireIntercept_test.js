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
    let stopMocking;
    
    beforeEach(() => {
        requireIntercept = require('../src/RequireIntercept');
        const testModuleIntercept = requireIntercept('../stubs/TestModule');
        TestModule = testModuleIntercept.module;
        mockDependency = testModuleIntercept.mockDependency;
        mockAround = testModuleIntercept.mockAround;
        stopMocking = testModuleIntercept.stopMocking;
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

    it('Should replace the module dependency with the mock and then stop', () => {

        const testInstance = new TestModule();

        mockDependency('./TestDependency', { "realDependency": false });

        expect(testInstance.callDependency()).to.be.false;

        stopMocking('./TestDependency');

        expect(testInstance.callDependency()).to.be.true;
    });

    it('Should be able to mock within scopes', () => {

        const testInstance = new TestModule();

        expect(testInstance.callDependency()).to.be.true;

        mockAround('./TestDependency', { "realDependency": false }, () => {
            expect(testInstance.callDependency()).to.be.false;
        });

        expect(testInstance.callDependency()).to.be.true;
    });

    it('Should be able to mock within async scopes', async () => {

        const testInstance = new TestModule();

        expect(testInstance.callDependency()).to.be.true;

        await mockAround('./TestDependency', { "realDependency": false }, async () => {
            const calledDependency = await testInstance.callDependencyAsync();
            expect(calledDependency).to.be.false;
        });

        expect(testInstance.callDependency()).to.be.true;
    });
});