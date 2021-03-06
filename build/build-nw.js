var path = require('path')
var fs = require('fs')
var util = require('util')
var rootPath = path.resolve(__dirname,'../')


var config = require(path.resolve(rootPath,'config'))
var tmpJson = require(path.resolve(rootPath,'./package.json'))
var manifestPath = path.resolve(config.build.assetsRoot, './package.json')

var manifest = {}
config.build.nw.manifest.forEach(function(v, i) {
  if (util.isString(v)) manifest[v] = tmpJson[v]
  else if (util.isObject(v)) manifest = util._extend(manifest, v)
})

fs.writeFile(manifestPath, JSON.stringify(manifest, null, '  '), 'utf-8', function(err, data) {
  if (err) throw err

  // start build app
  if (!config.build.nw.builder) return
  var NwBuilder = require('nw-builder')
  var nw = new NwBuilder(config.build.nw.builder)
  nw.build(function(err, data) {
    if (err) console.log(err)
    console.log('build nw done!')
  })
})