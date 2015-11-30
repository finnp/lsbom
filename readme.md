# lsbom
[![NPM](https://nodei.co/npm/lsbom.png)](https://nodei.co/npm/lsbom/)
[![Build Status](https://travis-ci.org/finnp/lsbom.svg?branch=master)](https://travis-ci.org/finnp/lsbom)

JavaScript version of [Mac OS X lsbom](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man8/lsbom.8.html),
based on the C++ project [bomutils](https://github.com/hogliux/bomutils).

```js
var lsbom = require('lsbom')
var fs = require('fs')

var bom = fs.readFileSync('Bomfile')

var files = lsbom(bom) // returns an array of file objects
```

You can also use it on the command line.
```
Usage: lsbom [--json] [--ndjson]
```
