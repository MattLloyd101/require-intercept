# Require Intercept - Changelog

## 2018-12-04 Version 1.0.4

* (bug fix) Ensuring if the mocked dependency doesn't exist that the library just acts like require.

## 2018-11-29 Version 1.0.3

* (bug fix) The first invocation must use the parent context so that RequireIntercept is transparent.

## 2018-11-29 Version 1.0.2

* (bug fix) The mockMapping would previously retain references forever, now they are instance scoped.
* (bug fix) The interceptor depending upon usage would have an incorrect reference to this.

## 2018-11-29 Version 1.0.1

* (minor) Updated the README to have a working example...

## 2018-11-29 Version 1.0.0

* Initial Release.