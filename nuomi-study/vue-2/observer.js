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
        each=function(ary,fn){//定义each数组遍历方法
            var ret;
            for(var i=0,l=ary.length;i<l;i++){
                var n=ary[i];
                ret=fn.call(n,i,n);
            }
            return ret;
        }
        _listen=function(key,fn,cache){//订阅行为
            if(!cache[key]){//如果所订阅的事件还没有，则创建之
                cache[key]=[];
            }
            cache[key].push(fn);//将fn添加至事件列表里
        }
        _remove=function(key,cache,fn){//取消订阅行为
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
        _trigger=function(){//发布事件
            var cache=_shift.call(arguments),//取得create里面创建的cache
                key=_shift.call(arguments),//取得key
                args=arguments,
                _self=this,ret,
                stack=cache[key];
            if(!stack||!stack.length) return;
            return each(stack,function(){
                return this.apply(_self,args);
            });
        };
        _create=function(namespace){//创建命名空间与其他空间隔离
            var namespace=namespace||_default;
            var cache={},
            offlineStack=[],
            ret={
                //offlineStack:offlineStack,
                listen:function(key,fn,last){
                    _listen(key,fn,cache);//不论缓存队列里面有没有，先执行listen
                    if(offlineStack===null) return;//判断之前是否有人订阅了相关的事件
                    if(last==='last'){//如果指定了最后一个事件，则仅发布最后一个事件
                        offlineStack.length&&offlineStack.pop()();
                    }else{//否则将相关的事件全部触发一遍
                        each(offlineStack,function(){
                            this();
                        });
                    }
                    offlineStack=null;//然后清空相应的离线事件缓存
                    //注意：只要在任意命名空间中listen任意事件，都会将offlineStack清除（bug)
                },
                one:function(key,fn,last){//只执行一次事件
                    _remove(key,cache);//将事件缓存里面的相应事件清除
                    this.listen(key,cache,last);//触发最后一个事件
                },
                remove:function(key,fn){
                    _remove(key,cache,fn);
                },
                trigger:function(){
                    var fn,args,_self=this;//保存调用trigger的对象(Event)
                    _unshift.call(arguments,cache);//向参数里面增加cache
                    args=arguments;//存储新的参数
                    fn=function(){
                        return _trigger.apply(_self,args);
                    };
                    if(offlineStack){//如果离线事件存在（没被触发销毁），那么将事件存到离线事件中并返回
                        return offlineStack.push(fn);
                    }
                    return fn();//如果没有存储离线事件堆栈，则执行并返回
                }
            };//不需要每次都返回一个新的对象，如果命名空间中已经包含了相应命名空间名称的命名空间，则直接从缓存中取出并返回
              //否则对其进行声明创建后再返回
            return namespace ? (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace]=ret):ret;
        }
        return {
            create:_create,
            one:function(key,fn,last){
                var event=this.create();//先确定命名空间
                    event.one(key,fn,last);
            },
            remove:function(key,fn,last){
                var event=this.create();//确定命名空间
                event.remove(key,fn);
            },
            listen:function(key,fn,last){
                var event=this.create();//确定命名空间
                event.listen(key,fn,last);
            },
            trigger:function(){
                var event=this.create();//首先确定命名空间
                event.trigger.apply(this,arguments);
            }
        };
    }();
    return Event;
})();