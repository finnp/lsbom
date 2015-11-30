#!/usr/bin/env node

var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2))
var lsbom = require('./')

if (argv._.length === 0) {
  console.error('Usage: lsbom [--json] [--ndjson]')
  process.exit(1)
}

var data = fs.readFileSync(argv._[0])

var infos = lsbom(data)

if (argv.json) {
  console.log(infos)
} else if (argv.ndjson) {
  infos.forEach(function (info) {
    console.log(JSON.stringify(info))
  })
} else {
  infos.forEach(function (f) {
    console.log([
      f.filename,
      f.mode.toString(8),
      f.user + '/' + f.group,
      f.size,
      f.checksum
    ].join('\t'))
  })
}
