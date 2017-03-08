#第一章 面向对象的javascript
1. 动态类型语言、鸭子类型 
2. 多态 
3. 封装 
4. 原型模式和基于原型继承的javascript对象系统

###1.4.1 使用克隆的原型模式
ECMAScript5 提供了Object.create()方法用于对象的克隆：
```javascript
  var Plane = function（）{
      this.blood=100;
      this,attacklevel=1;
      this.defenselevel=1;
  };
  var plane = new Plane();
  plane.blood=500;
  plane.attacklevel=10;
  plane.defenselevel=7;
  
  var clonePlane = Object.create(plane);
  console.log(clonePlane)//输出：Object{blood:500,attacklevel:10,defenselevel:7}
```
在不支持Object.create方法的浏览器中，可以使用如下方式：
```javascript
  Object.create=Object.create || function(obj){
    var F=function(){};
    F.prototype=obj;
    return new F();
  }
```
###1.4.4 原型编程
重要特性：当对象无法响应某个请求时，会将这个请求委托给他自己的原型<br>
原型编程范型基本原则至少包括:
1. 所有数据都是对象
2. 要得到一个对象，不是实例化一个类，而是找到一个对象克隆他
3. 对象会记住他的原型
4. 如果对象无法响应某个请求，它会把这个请求委托给他自己的原型
###1.4.5
javascript中的根对象是Object.prototype；可以利用Object。getPrototypeOf来查看对象的原型<br>
javascript的函数不仅可以当作一般的函数调用，也可以作为构造器被调用。<br>
当使用new运算符调用函数时，函数就是一个构造器，new运算符创建对象的过程实际上也是先克隆Object.prototype,再进行其他一些操作的过程<br>
```javascript
    function Person(name){
      this.name=name;
     };
     Person.prototype.getName=function(){
       return this.name;
     };
     var onjectFactory=function(){
      var obj=new Object(),//从object.protoytpe克隆一个新对象
          constructor=[].shift.call(arguments);//取得传入的构造器函数
          obj._proto_=Constructor.prototype;//指向正确的原型（Person.prorotype）
          var ret=Constructor.apply(obj,arguments);//借用外部传入的构造器给对象设置属性
          
          return typeof ret==='object'?ret:obj;
      }
      var a=objectFactory(Person,'seven');
      
      console.log(a.name);//seven
      console.log(a.getName());//seven
```  
###1.4.6 原型继承的未来
ECMAScript6带来了Class语法，使得看起来像是基于类的语言，实际上仍然是通过原型机制创建对象<br>
```javscript
      Class Animal{
        constructor(name){
          this.name=name;
        }
        getName(){
          return this.name;
        }
      }
      Class Dog extends Animal{
        constructor(name){
          this.name=super(name);
        }
        speak(){
          return "woof";
        }
      }
      var dog = new Dog("Scamp");
      console.log(dog.getName()+'say'+dog.speak());
```
