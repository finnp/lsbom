module.exports = lsbom

function lsbom (data) {
  var files = []

  //  header
  var header = {}

  if (data.slice(0, 8).toString() !== 'BOMStore') {
    return false // not a BOM file
  }

  header.version = data.readUInt32BE(2 * 4) // Always 1
  header.numberOfBlocks = data.readUInt32BE(3 * 4) // Number of non-null entries in BOMBlockTable
  header.indexOffset = data.readUInt32BE(4 * 4)  // Offset to index table
  header.indexLength = data.readUInt32BE(5 * 4) // Length of index table, indexOffset + indexLength = file_length
  header.varsOffset = data.readUInt32BE(6 * 4)
  header.varsLength = data.readUInt32BE(7 * 4)

  var indexHeaderData = data.slice(header.indexOffset, header.indexOffset + header.indexLength)

  var numberOfBlockTablePointers = indexHeaderData.readUInt32BE(0)

  var blockPointers = []
  for (var i = 0; i < numberOfBlockTablePointers; i++) {
    blockPointers[i] = {}
    blockPointers[i].address = indexHeaderData.readUInt32BE(4 + i * 8)
    blockPointers[i].length = indexHeaderData.readUInt32BE(8 + i * 8)
  }
  var varsData = data.slice(header.varsOffset, header.varsOffset + header.varsLength)

  var varsCount = varsData.readUInt32BE(0)

  var pos = 0
  for (var j = 0; j < varsCount; j++) {
    var index = varsData.readUInt32BE(pos + 4)
    var length = varsData.readUInt8(pos + 8)
    var name = varsData.slice(pos + 9, pos + 9 + length).toString()
    var varData = lookup(index)

    if (name === 'Paths') {
      var filenames = {}
      var parents = {}

      var tree = {}
      tree.magic = varData.slice(0, 4).toString()
      tree.version = varData.readUInt32BE(4)
      tree.child = varData.readUInt32BE(2 * 4)
      tree.blockSize = varData.readUInt32BE(3 * 4)
      tree.pathCount = varData.readUInt32BE(4 * 4)
      tree.unknown3 = varData.readUInt8(5 * 4)
      var pathsData = lookup(tree.child)

      var paths = readBOMPaths(pathsData)

      while (paths.isLeaf === 0) {
        paths = readBOMPaths(lookup(paths.indices[0].index0))
      }

      while (paths) {
        for (var k = 0; k < paths.count; k++) {
          var index0 = paths.indices[k].index0
          var index1 = paths.indices[k].index1

          var file = readBomFile(lookup(index1))
          var info1 = readBomPathInfo1(lookup(index0))
          var info2 = readBomPathInfo2(lookup(info1.index))

          // compute full name
          var filename = file.name
          filenames[info1.id] = filename
          if (file.parent) {
            parents[info1.id] = file.parent
          }
          var it = parents[info1.id]
          while (it) {
            filename = filenames[it] + '/' + filename
            it = parents[it]
          }

          var outFile = {}
          outFile.filename = filename
          outFile.group = info2.group
          outFile.user = info2.user
          outFile.mode = info2.mode
          if (info2.type === 1 || info2.type === 3) {
            outFile.modtime = info2.modtime
            outFile.checksum = info2.checksum
            outFile.size = info2.size
          }
          if (info2.type === 3) {
            outFile.linkname = info2.linkName
          }
          if (info2.type === 4) {
            outFile.devType = outFile.checksum
          }
          files.push(outFile)
        }
        if (paths.forward === 0) {
          paths = 0
        } else {
          paths.forward++
          paths = readBOMPaths(lookup(paths.forward))
        }
      }
    }
    pos += 5 + length
  }

  return files

  function lookup (i) {
    var index = blockPointers[i]
    return data.slice(index.address, index.address + index.length)
  }
}

function readBOMPaths (buffer) {
  var paths = {}
  paths.isLeaf = buffer.readUInt16BE(0)
  paths.count = buffer.readUInt16BE(2)
  paths.forward = buffer.readUInt32BE(4)
  paths.backward = buffer.readUInt32BE(8)
  paths.indices = []
  for (var i = 12; i < buffer.length - 4; i += 8) {
    var index = {}
    index.index0 = buffer.readUInt32BE(i)
    index.index1 = buffer.readUInt32BE(i + 4)
    paths.indices.push(index)
  }

  return paths
}

function readBomFile (buf) {
  var file = {}
  file.parent = buf.readUInt32BE(0)
  file.name = buf.slice(4, buf.length - 1).toString()
  return file
}

function readBomPathInfo1 (buf) {
  var info = {}
  info.id = buf.readUInt32BE(0)
  info.index = buf.readUInt32BE(4)
  return info
}

function readBomPathInfo2 (buf) {
  var info = {}
  info.type = buf.readUInt8(0)
  info.unknown0 = buf.readUInt8(1)
  info.architecture = buf.readUInt16BE(2)
  info.mode = buf.readUInt16BE(2 + 2)
  info.user = buf.readUInt32BE(2 + 4)
  info.group = buf.readUInt32BE(2 + 2 * 4)
  info.modtime = buf.readUInt32BE(2 + 3 * 4)
  info.size = buf.readUInt32BE(2 + 4 * 4)
  info.unknown1 = buf.readUInt8(2 + 5 * 4)
  info.checksum = buf.readUInt32BE(3 + 5 * 4)
  info.linkNameLength = buf.readUInt32BE(3 + 6 * 4)
  info.linkName = buf.slice(3 + 7 * 4).toString()
  return info
}
