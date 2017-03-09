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
高阶函数是指至少满足下列条件之一的函数：
1. 函数可以作为参数被传递
2. 函数可以作为返回值输出
###函数作为参数传递
1. 回调函数
2. Array.prototype.sort
Array.prototype.sort接受一个函数当作参数，这个函数封装了排序规则<br>
```javascrtpt
//从小到大排列
[1,4,3].sort(function(a,b){
  return a-b;
});//输出[1,3,4]
//从大到小排列
[1,4,3].sort(function(a,b){
  return b-a;
});//输出[4,3,1]
```
###函数作为返回值输出
1. 判断数据类型
```javascript
var Type={};
for(var i=0,type;type=['String','Array','Number'][i++];){
  (function(type){
    Type['is'+type]=function(obj){
      return Object.prototype.toString.call(obj)==='[object '+type+']';
    }
  })(type)
 };
 Type.isArray([]);//输出true
 Type.isString("str");//输出true
 ```
 2. getSingle--单例模式:
###高阶函数实现AOP
 AOP即把一些跟核心业务逻辑无关的功能抽离出来，再通过“动态织入”的方式掺入业务逻辑中<br>
 可以保持业务逻辑模块的纯净，方便复用。<br>
 AOP的实现方法有很多，比如Function.prototype:
 
 ```javascript
 Function.prototype.before=function(beforefn){
   var __self=this;
   return function(){
     beforefn.apply(this,arguments);
     return __self.apply(this,arguments);
   }
 };
 Function.prototype.after=function(afterfn){
   var __self=this;
   return function(){
     var ret=__self.apply(this,arguments);
     afterfn.apply(this,arguments);
     return ret;
   }
 };
 var func=function(){
   concole.log(2);
 }
 func=func.before(function(){//这里的__self为func
         console.log(1);
     }).after(function(){//这里的__self变成了织入beforefn后的func
         console.log(3);
     });
 func();//会先执行after里面的__self.apply(this,arguments),因此输出1，2；然后执行afterfn.apply(this,arguments)输出3
 ```
###高阶函数的其他应用
 1. curring
 2. uncurring
 3. 函数节流
 4. 分时函数
 5. 惰性加载
 
####1.curring
 curring又称为部分求值，一个curing的函数首先会接受一些参数并不会立即求值，而是继续返回另外一个函数<br>直到函数真正需要被求值时才会将之前传入的参数一次性求值。
 ```javascript
 var curring=function(fn){
   var args=[];
   return function(){
     if(arguments.length===0){
       return fn.apply(this,args);
     }else{
       [].push.apply(args,arguments);
       return arguments.callee;
     }
   }
 }
 var cost=function(){
     var money=0;
     return function(){
       for(var i=0,l=arguments.length;i<l;i++){
         money+=arguments[i];
       }
       return money;
     }
 })();
 var cost=curring(cost);//转化成curing函数
 cost(100);//未真正求值
 cost(200);//未真正求值
 cost(300);//未真正求值
 
 alert(cost());//由于arguments.length==0成立，进入cost函数进行求和，输出money
 ```
 ####2. uncurring
 让一个对象借用原本不属于它的方法 如：
 ```javascript
 Function.prototype.uncurring=function(){
   var self=this;
   return function(){
     var obj=Array.prototype.shift.call(arguments);
     return self.apply(obj,arguments);
   }
 };
 var push=Array.prototype.push.uncurring();//现在push变成了通用的方法
 var obj={
         'length':1,
         '0':1
     }
 push(obj,2);
 console.log(obj);//输出：{'length':2,'0':1,'1',2}
 ```
以上是uncuring的一种实现方式，下面还有另外一种:
 ```javascript
 Function.prototype.uncurring=function(){
   var self=this;
   return function(){
     return Function.prototype.call.apply(this,arguments);//其实就是借用了call方法
     }
 }
 ```
####3.函数节流
在某些情况下需要某些函数不经过用户主动调用即触发<br>此时容易由于函数频繁调用造成性能问题<br>
1. 函数被频繁调用的场景
* window.onresize事件
* mousemove事件
* 上传进度
2. 函数节流的原理
使用setTimeout来限制函数被触发的频率
3. 函数节流的代码实现
以下的throttle函数是一种实现方式，原理是将被执行函数用setTimeout延迟一段时间再执行，在延迟<br>时间内忽略调用请求
```javascript
var throttle=function(fn,interval){
   var __self=fn,
   timer,
   firstTime=true;//验证是否是第一次调用
   return function(){
   		var args=arguments,
		__me=this;
		if(firstTime){
			__self.apply(__me,args);
		}
		if(timer){
			return false;
		}
		timer=setTimeout(function(){//延迟一段时间执行		
            clearTimeout(timer);
			timer=null;
			__self.apply(__me,args);
		},interval||500);
	}
};
window.onresize=throttle(function(){//这里面的me是指window?
    console.log(1);
},500);
```
####4.分时函数
假设要创建一个好友列表，但是这个好友列表包含一千个好友，如果一次性加载这一千个好友并添加节点，那么会引起<br>
严重的性能问题，因此可以分批进行，比如每300毫秒创建加载100个好友节点，每次执行时如果定时器还在，那么久拒绝执行<br>
每次执行完成后先清除定时器然后等待下一次的调用。
```javascript
var timeChunk=function(ary,fn,count){
	var obj,t;
	var l=ary.length;
	var start=function(){
		for(var i=0;i<Math.min(count||1,ary.length;i++){
			obj=ary.shift();
			fn(obj);
		}
	return function(){
                t=setInterval(function(){
			if(ary.length===0){
				return clearInterval(t);
			}
			start()
		},300);
	}
}
```
以上代码可以用于任何无需返回值的函数的分时加载，用于我们的加载好友节点的情况则是:

```javascript
var ary=[];
for(var i=0;i<1000;i++){
	ary.push(i);
}
var renderFriendList=timeChunk(ary,function(n){
	var f=document.careateElement("div");
	f.innerHTML=n;
	document.body.appendChild(f);
},8);
renderFriendList();//每隔300ms创建8个好友列表节点
```
####惰性加载函数
 在某些情况下，对某一个固定条件进行反复判断从而改变相应的函数是可以避免的，即在函数第一次调用时就根据情况<br>
 对函数本身进行改写以适应当前场合。<br>
 如根据浏览器嗅探结果改变绑定事件的函数addEvent;
```javascript
var addEvent=function(elem,type,handler){
	if(window.addEventListenet){
	    addEvent=function(elem,type,hadler){
		elem.addEventListener(type,handler,false)
	}else if(window.attachEvent){
		elem.attachEvent(type,handler)
	}
	addEvent(elem,type,handler);
}
```
