#!/usr/bin/env node

var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2))
var lsbom = require('./')

var data = fs.readFileSync(argv._[0])

var infos = lsbom(data)

infos.forEach(function (f) {
  console.log([
    f.filename,
    f.mode.toString(8),
    f.user + '/' + f.group,
    f.size,
    f.checksum
  ].join('\t'))
})

// void short_usage() {
//   cout << "Usage: lsbom [-h] [-s] [-f] [-d] [-l] [-b] [-c] [-m] [-x]\n"
//        << "\t"
// #if 0
//     "[--arch archVal] "
// #endif
//     "[-p parameters] bom ..." << endl;
// }
//
// void usage() {
//   short_usage();
//   cout << "\n"
//     "\t-h              print full usage\n"
//     "\t-s              print pathnames only\n"
//     "\t-f              list files\n"
//     "\t-d              list directories\n"
//     "\t-l              list symbolic links\n"
//     "\t-b              list block devices\n"
//     "\t-c              list character devices\n"
//     "\t-m              print modified times\n"
//     "\t-x              suppress modes for directories and symlinks\n"
// #if 0
//     "\t--arch archVal  print info for architecture archVal (\"ppc\", "
//     "\"i386\", \"hppa\", \"sparc\", etc)\n"
// #endif
//     "\t-p parameters   print only some of the results.  EACH OPTION CAN "
//     "ONLY BE USED ONCE\n"
//     "\t\tParameters:\n"
//     "\t\t\tf    file name\n"
//     "\t\t\tF    file name with quotes (i.e. \"/usr/bin/lsbom\")\n"
//     "\t\t\tm    file mode (permissions)\n"
//     "\t\t\tM    symbolic file mode\n"
//     "\t\t\tg    group id\n"
//     "\t\t\tG    group name\n"
//     "\t\t\tu    user id\n"
//     "\t\t\tU    user name\n"
//     "\t\t\tt    mod time\n"
//     "\t\t\tT    formatted mod time\n"
//     "\t\t\ts    file size\n"
//     "\t\t\tS    formatted size\n"
//     "\t\t\tc    32-bit checksum\n"
//     "\t\t\t/    user id/group id\n"
//     "\t\t\t?    user name/group name\n"
//     "\t\t\tl    link name\n"
//     "\t\t\tL    quoted link name\n"
//     "\t\t\t0    device type\n"
//     "\t\t\t1    device major\n"
//     "\t\t\t2    device minor\n"
//        << flush;
// }
