var fs = require('fs')
var path = require('path')
var test = require('tape')
var lsbom = require('./')

var data = fs.readFileSync(path.join(__dirname, 'Bom'))

test('lsbom', function (t) {
  var files = lsbom(data)

  t.equals(files.length, 10, 'number of files')
  t.equals(files.map(function (a) { return a.user }).join(''), '501501501501501501501501501501', 'all users 501')
  t.equals(files.map(function (a) { return a.group }).join(''), '20202020202020202020', 'all groups 20')
  var map = {}
  files.forEach(function (file) {
    map[file.filename] = file
  })
  t.equals(map['.'].mode.toString(8), '40755', 'mode of parent')
  t.equals(map['./one/beta/cats.txt'].mode.toString(8), '100644', 'mode of cats.txt')
  t.equals(map['./faust.txt'].size, 258, 'size of faust.txt')
  t.equals(map['./two/past.txt'].checksum, 3136442595, 'checksum of past.txt')
  t.notOk('size' in map['./one'], 'dir one has no size')
  t.notOk('checksum' in map['./one/alpha'], 'dir one has no checksum')
  t.end()
})
