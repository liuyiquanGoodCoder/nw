var exec = require('child_process').exec
var path = require('path')
var fs = require('fs')
var nwPath = require('nw').findpath()
var rootPath = path.resolve(__dirname,'../')
var packageJsonPath = path.resolve(rootPath,'./package.json')




function runNwDev(url = ''){
    if(url && (url + '').trim()){
        tmpJson = require(packageJsonPath)
        tmpJson.main = url
        fs.writeFileSync(packageJsonPath,JSON.stringify(tmpJson,null,' '),'utf-8')
    }

    var closed
    var nwDev = exec(nwPath + ' ' + rootPath,{cwd:rootPath},function(err,stdout){
        process.exit(0)
        closed = true
    })

    nwDev.stdout.on('data',console.log)
    nwDev.stdout.on('error',console.error)

     // 退出时也关闭 NW 进程
     process.on('exit',exitHandle)
     process.on('uncaughtException',exitHandle)

     function exitHandle(e){
         if (!closed) nwDev.kill()
         console.log(e || 'the program end')
     }
}

module.exports = runNwDev