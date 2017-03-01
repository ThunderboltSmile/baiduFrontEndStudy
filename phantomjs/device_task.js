var page = require('webpage').create(),
    system=require('system'),
    fs=require('fs'),
    t,
    kw,
    device;
t=Date.now();
kw=system.args[1];
if(system.args.length===3){
    device=system.args[2];
}else{
    console.log("Please enter your device");
    phantom.exit();
}
var output=device+".txt";
var imagef=device+".png";
var conftxt=fs.read('config.txt');
var config=JSON.parse(conftxt);
page.settings.userAgent=config[device]["agent"];
page.clipRect={
    width:config[device]['width'],
    height:config[device]['height']
}
page.open('https://www.baidu.com/s?wd='+kw,function(status){
    var result={};
    if(status=="success"){
        result.code="1";
        result.device=device;
        //循环取得结果中的数据
        datalist=page.evaluate(function(){
            var datalist=[];
            var wrapl=document.getElementsByClassName("result").length;
            for(var i=0;i<wrapl;i++){
                var data={};
                var wrapper=document.getElementsByClassName("result")[i];
                console.log(wrapper);
                data.title=wrapper.getElementsByTagName("h3")[0].textContent;
                if(wrapper.getElementsByClassName("c-abstract")[0]==undefined){
                    data.info="There is not have abstract";
                }else{
                    data.info=wrapper.getElementsByClassName("c-abstract")[0].textContent;
                }
                if(wrapper.getElementsByClassName("c-showurl")[0]==undefined){
                    data.link="There is not have link";
                }else{
                    data.link = wrapper.getElementsByClassName("c-showurl")[0].textContent;
                }
                if(wrapper.getElementsByClassName("c-img")[0]==undefined){
                    data.pic="There is not have pic";
                }else{
                    data.pic = wrapper.getElementsByClassName("c-img")[0].getAttribute("src");
                }
                //将数据封装成json格式push进数组
                datalist.push(data);
            }
            return datalist;
        })
        //若数组不为空则取得时间等信息
        if(datalist.length!=0){
            result.msg="抓取成功";
            result.word=kw;
            result.time=Date.now()-t;
            result.datalist=datalist;
        }
        page.render(imagef);
        //将json对象解析为字符串并输出
        fs.touch(output);
        fs.write(output,JSON.stringify(result),'w');
        phantom.exit();
    }
})
