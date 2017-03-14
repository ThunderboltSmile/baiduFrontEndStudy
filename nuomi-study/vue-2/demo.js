var observer=(function(){
    var observer=function(data){
        this.data=data;
        this.walk(data);
    }
    observer.prototype.getFn=function(key){
        console.log("你访问了"+key);
        Event.trigger("get",key);
    }
    observer.prototype.setFn=function(key,value){
        console.log("你设置了"+key+"的值为"+value);
        if(typeof value==='object'){
            value=new observer(value);
        }
        Event.trigger("set",key,value);
    }
    observer.prototype.walk=function(obj){
        let val;
        for (let key in obj){
            if(obj.hasOwnProperty(key)){
                val=obj[key];
                this.convert(key,val);
            }
        }
    }
    observer.prototype.convert=function(key,val){
        var self=this;
        Object.defineProperty(this.data,key,{
            configurable:true,
            enumerable:true,
            get:function(){
                self.getFn(key);
                return val;
            },
            set:function(value){
                self.setFn(key,value);
                if(val===value) return;
                val=value;
            }
        });
    }
    return observer;
})()

let data={
        job:"front-end-engineer",
        name:"thunderboltsmile",
        age:"24",
        color:"yellow",
        friend:"laurence"
    }
let me=new observer(data);
console.log(me);
Event.listen('set', function(a,b){
   console.log("我的"+a+"变了，现在是"+b); // 输出：1
});
Event.listen( 'get', function(a){
   console.log("取得了"+a); // 输出：1
});