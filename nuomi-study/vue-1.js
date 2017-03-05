let observer=function(data){
        this.data=data;
        this.walk(data);
    }
    
let p=observer.prototype;
    p.getFn=function(key){
        console.log("你访问了"+key);
    }
    p.setFn=function(key,value){
        console.log("你设置了"+key+"的值为"+value);
    }
    p.walk=function(obj){
        let val;
        for (let key in obj){
            if(obj.hasOwnProperty(key)){
                val=obj[key];
                if(typeof val==='object'){
                    val=new observer(val);
                }
                this.convert(key,val);
            }
        }
    }
    p.convert=function(key,val){
        Object.defineProperty(this.data,key,{
            configurable:true,
            enumerable:true,
            get:function(){
                p.getFn(key);
                return val;
            },
            set:function(value){
                p.setFn(key,value);
                if(val===value) return;
                val=value;
            }
        });
    }
    

let data={
        job:"front-end-engineer",
        name:"thunderboltsmile",
        age:"24",
        color:"yellow",
        friend:"laurence"
    }
var me=new observer(data);
console.log(me);
