
const dependency = require('./TestDependency');

module.exports = class TestModule {

    callDependency() {
        return dependency.realDependency;
    }

}