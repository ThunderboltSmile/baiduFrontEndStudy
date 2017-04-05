var http = require('http');
var fs = require('fs');
var url = require('url');
var exec = require('child_process').exec;
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/abc");
var db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
   console.log('mongoose connected!')
});
// 定义一个Schema
var resultSchema = new mongoose.Schema({
   code: Number,
   msg: String,
   word: String,
   device: String,
   time: Number,
   datalist: [{
      "info": String,
      "link": String,
      "pic": String,
      "title": String
   }]
});
// 编译定义好的Schema
var Result = mongoose.model('Result', resultSchema);
// 创建服务器
http.createServer(function (request, response) {  
   // 解析请求，包括文件名
   var pathname = url.parse(request.url).pathname;
   // 输出请求的文件名
   console.log("Request for " + pathname + " received.");
   var queryObj = url.parse(request.url,true).query;
   console.log(queryObj);
   // 从文件系统中读取请求的文件内容 
   var task="phantomjs D:\\datatool\\phantomjs\\img\\png.js";//执行本地的png.js即phantomjs脚本
   exec(task + ' ' + queryObj.word + ' ' +queryObj.device,(error,stdout,stderr)=>{
      if(error){
         throw error;
      }else{
         response.writeHead(200, {'Content-Type': 'text/html'});
         // 新建一个文档
         console.log(JSON.parse(stdout));
         var results = new Result(JSON.parse(stdout));
         // 将文档保存到数据库
         results.save(function(err, result) {
           if (err) {
              console.error("err:"+err);
           } else {
              console.log(result);
           }
         });
      }
   })
}).listen(8081);
