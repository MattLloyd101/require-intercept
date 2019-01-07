# require-intercept

[![Build Status](https://travis-ci.org/MattLloyd101/require-intercept.svg?branch=master)](https://travis-ci.org/MattLloyd101/require-intercept)
[![npm version](https://badge.fury.io/js/require-intercept.svg)](https://badge.fury.io/js/require-intercept)
[![dependencies Status](https://david-dm.org/MattLloyd101/require-intercept/status.svg)](https://david-dm.org/MattLloyd101/require-intercept)
[![devDependencies Status](https://david-dm.org/MattLloyd101/require-intercept/dev-status.svg)](https://david-dm.org/MattLloyd101/require-intercept?type=dev)

A way of intercepting required Node.js module dependencies.

## Installation

via [npm](https://github.com/npm/npm)

```bash
npm install require-intercept
```

## Usage

`./TestModule.js`
```javascript
const dependency = require('./TestDependency');

module.exports = class TestModule {

    getDependency() {
        return dependency;
    }

    async callDependencyAsync() {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve(dependency);
          }, 100);
        });
    }

}
```

`./TestDependency.js`
```javascript
module.exports = {
    "dependencyType": "Real"
}
```

`main.js`
```javascript
const requireIntercept = require('require-intercept');
const { module: TestModule, mockDependency, stopMocking, mockAround } = requireIntercept('./TestModule');

const testModule = new TestModule();
console.log("Before any mocking it calls the real TestDependency >", testModule.getDependency());
// Before any mocking it calls the real TestDependency > { "dependencyType": "Real" }

const mock = { "dependencyType": "Mocked" };

mockDependency('./TestDependency', mock);

console.log("Once mocked we have injected the mock without modifying the code structure >", testModule.getDependency());
// Once mocked we have injected the mock without modifying the code structure > { "dependencyType": "Mocked" }

stopMocking('./TestDependency');

console.log("Once we have stopped mocking we restore the original module >", testModule.getDependency());
// Once we have stopped mocking we restore the original module > { "dependencyType": "Real" }

mockAround('./TestDependency', mock, () => {
    console.log("We can inject mocks within a particular scope >", testModule.getDependency());
    // We can inject mocks within a particular scope > { "dependencyType": "Mocked" }
});

console.log("And they are automatically restored afterwards >", testModule.getDependency());
// And they are automatically restored afterwards > { "dependencyType": "Real" }

mockAround('./TestDependency', mock, async () => {
    const value = await testModule.getDependencyAsync()
    console.log("This also works with async functions >", value);
    // This also works with async functions > { "dependencyType": "Mocked" }
});
```

## Versioning

This library uses the [Semver](https://semver.org/) versioning system. The numbers do not relate to maturity but the number of breaking changes introduced.
