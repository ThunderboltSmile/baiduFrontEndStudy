#闭包和高阶函数
##闭包
###变量的作用域
变量作用域就是指变量能够被访问的范围，函数可以用来创造函数作用域，函数作用域内的变量不能在函数外直接获取到<br>
而函数作用域内部可以访问同一条作用域链上的外部的变量。<br>
###变量的生存周期
当作用域不再被引用时，作用域内部的变量在推出函数后即被垃圾回收机制销毁<br>
反之，若某个作用域被引用到了另外的作用域，则被引用作用域内的变量不会被销毁，此时产生了一个<b>闭包</b>,局部变量的生命看起来被延续了。
###闭包的作用
1. 封装变量
```javascript
var mult=(function(){
  var cache={};//缓存机制，避免多次相同的运算
  var calculate=function(){//封闭calculate函数
    var a=1;
    for(var i=0,l=arguments.length;i<l;i++){
      a=a*arguments[i];
    }
    return a;
  };
  return function(){
    var args=Array.prorotype.jion.call(arguments,',');
    if(args in cache){
      return cache[args];
    }
    return cache[args]=calculate.apply(null,arguments);//返回的函数中引用了calculate，因此calculate会一直存在
  }
})();
```
2. 延长局部变量的寿命
```javascript
var report=(function(){
  var imgs=[];
  return function(src){
    var img=new Image();
    imgs.push(img);
    img.src=src;
  }
})();
```

###闭包和面向对象设计
面向对象中的对象---过程与数据的结合，可以使用闭包实现一个完整的面向对象系统
```javascript
var extent=function(){
    var value=0;
    return {
        call:function(){
            value++;
            concole.log(value);
        }
    }
}

var extent=extent();//由于引用的同一个作用域下的value，因此value会随call的调用累加
extend.call();//1
extend.call();//2
extend.call();//3
```
###用闭包实现命令模式
命令模式：把请求封装为对象，从而分离请求的发起者与接受者之间的耦合关系，在命令被执行前<br>
可以预先往命令对象中植入命令的接受者
```
<html>
    <body>
        <button id="execute">点击我执行命令</button>
        <button id="undo">点击我执行命令</button>
        <script>
        var Tv={//将请求封装为对象
            open:function(){
                console.log('打开电视机');
            },
            close:function(){
                console.log('关闭电视机');
            }
        };
        
        var OpenTvCommand=function(receiver){//请求的接受者
            this.receiver=receiver;
        }
        
        OpenTvCommand.prorotype.execute=function(){
            this.receiver.open();
        };
        OpenTvCommand.prototype.undo=function(){
            this.receiver.close();
        };
        var setCommand=function(command){//请求的发起者
            document.getElementById('execute').onclick=function(){
                command.execute();
            }
            document.getElementById('undo').onclick=function(){
                command.undo();
            }
        };
        setCommand(new OpenTvCommand(Tv));
    </script>
  </body>
</html>
```
以上，命令被当成执行者对象的属性保存起来<br>
在javascript中，命令被封闭在闭包中<br>
```javascript
var Tv={
    open:function(){
        console.log('打开电视机');
    },
    close:function(){
        console.log('关闭电视机');
    }
};

var createCommand=function(reveiver){
    var execute=function(){
        return receiver.open();
    }
    var undo=function(){
        return receiver.close();
    }
    return {
        execute:execute;
        undo:undo;
    }
};

var setCommand=function(command){
    document.getElementById('execute').onclick=function(){
        command.execute();
    }
    document.getElementById('undo').onclick=function(){
        command.undo();
    }
}

setCommand(createCommand(Tv));
```
##高阶函数<br>
