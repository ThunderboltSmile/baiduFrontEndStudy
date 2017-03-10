#发布订阅模式
##发布订阅模式的通用实现
```javascript
var event={
	eventList:[],
    listen:function(type,fn){
		if(!eventList[type]{//如还没有创建监听事件队列，则创建之
            eventList[type]=[];
		}
		eventList[type].push(fn);//事件入栈
    },
	trigger:function(){
		var key=Array.prototype.shift.call(arguments);//取得触发的事件类型
        var fns=eventList[key];
		if(!fns||fns.length==0) return false;//如果还没有相关的监听，则返回
        for(var i=0,fn;fn=fns[i++]){
				fn.apply(this,arguments);//arguments是trigger时加入的参数	
         }
	}
}
```
再定义一个用于为对象添加发布订阅功能的函数
```javascript
var installEvent=function(obj){
	    for(var i in event){
				obj[i]=event[i];
		}
};
```
###取消发布订阅事件
```javascript
	var eventRemove=function(key,fn){
		var fns=this.eventList[key];
		if(!fns) return false;//如果没有相关的订阅事件则返回	
        if(!fn){//如果没具体到哪个函数，则所有函数都清空		
            fns&&fns=[];
		}else{
			for(var l=fns.length-1;l>=0;l--){
				if(fns[l]==fn){
					fns.splice(l,1);//从缓存队列中清除该事件      
				}
			}
		}
	}
```
##全局的发布订阅实现
  订阅者不知道消息来自于谁，发布者也不知道消息将会发往何处，而event作为媒介将两者联系起来
```javascript
var Event=(function(){
	var eventList={},
		listen,
	    trigger,
	    remove;
	listen=function(key,fn){
		if(!eventList[key]) eventList[key]=[];
        eventList[key].push(fn);
    }
    trigger=function(){
		var key=Array.prototype.shift.call(arguments);
		fns=this.eventList[key];
        if(!fns||fns.length==0) return false;
		for(i=0;fn=fns([i++]){
			fn.apply(this,arguments);
		}
	}
	remove=function(key,fn){
		var fns=this.eventList[key];
		if(!fns) return false;
        if(!fn){
			fns=[];
		else{
			for(var l=fns.length-1;l>=0;l--){
				if(fns[l]==fn){
					fns.splice(l,1);
				}
			}
		}
	}
	return {
		listen:listen,
		trigger:trigger,
		remove:remove
	}
})();
```
#先发布后订阅
  实现方法是在事件发布时将事件存储在离线时间堆栈内，待有人订阅时再触发<br>
  注意：离线事件只能被每个订阅的对象触发一次，即触发完即销毁离线事件堆栈？？？如何实现？
##命名空间
  ```javascript
	var Event=(function(){
		var global=this,
			Event,
			_default='default';
	Event=function(){
		var _listen,_trigger,_remove,
			_slice=Array.prototype.slice,
			_shift=Array.prototype.shift,
			_unshift=Array.prototype.unshift,
			namespaceCache={},
			_create,find,
			each=function(ary,fn){
				var ret;
				for(var i=0;l=ary.length;i<l;i++){
					var n=ary[i];
					ret=fn.call(n,i,n);
				}
				return ret;
			}
			_listen=function(key,fn,cache){
				if(!cache[key]){
					cache[key]=[];
				}
				cache[key].push(fn);
			}
			_remove=function(key,cache,fn){
				if(cache[key]){
					if(fn){
						for(var i=cache[key].length;i>=0;i--){
							if(chche[key][i]===fn){
                                cache[key].splice(i,1);
							}
						}
					}else{
						cache[key]=[];
					}
				}
			};
			_trigger=function(){
				var cache=_shift.call(arguments),
					key=_shift.call(arguments),
					args=arguments,
					_self=this,ret,
					stack=cache[key];
				if(!stack||!stack.length) return;
				return each(stack,function(){
					return this.apply(_self,args);
				});
			};
  			_create=function(namespace){
				var namespace=namespace||_default;
				var cache={}.
					offlineStack=[],
					ret={
						listen:function(key,fn,last){
							_listen(key,fn,last);
							if(offlineStack===null) return;
							if(last==='last'){
								offlineStack.length&&offlineStack.pop()();
							}else{
								each(offlineStack,function(){
									this();
								});
							}
							offlineStack=null;
						},
						one:function(key,fn,last){
							_remove(key,cache);
							this.listen(key,cache,fn);
						},
						remove:function(key,fn){
							_remove(key,cache,fn);
						},
						trigger:function(){
							var fn,args,_self=this;
							_unshift.call(arguments,cache);
							args=arguments;
							fn=function(){
								return _trigger.apply(_self,args);
							};
							if(offlineStack){
								return offlineStack.push(fn);
							}
							return fn();
						}
					};
					return namespace ? (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace]=ret):ret;
				}
				return {
					create:_create,
					one:function(key,fn,last){
						var event=this.create();
							event.one(key,fn,last);
					},
					remove:function(key,fn,last){
						var event=this.create();
						event.remove(key,fn);
					},
					listen:function(key,fn,last){
						var event=this.create();
						event.listen(key,fn,last);
					},
					trigger:function(){
						var event=this.create();
						event.trigger.apply(this,arguments);
					}
				};
			}();
			return Event;
		})();
							
