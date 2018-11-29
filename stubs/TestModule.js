
const dependency = require('./TestDependency');

module.exports = class TestModule {

    callDependency() {
        return dependency.realDependency;
    }

    async callDependencyAsync() {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(dependency.realDependency);
          }, 0);
        });
    }
}