"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,t,i){return t&&_defineProperties(e.prototype,t),i&&_defineProperties(e,i),e}var io=require("socket.io-client"),Client=function(){function e(){_classCallCheck(this,e),this.socket=io(),this.socket.on("connect",function(){})}return _createClass(e,[{key:"validateRegister",value:function(e,t){this.socket.emit("client:register:validate",e,t)}},{key:"validateLogin",value:function(e,t){this.socket.emit("client:login:validate",e,t)}},{key:"register",value:function(e,t){this.socket.emit("client:register",e,t)}},{key:"login",value:function(e,t){this.socket.emit("client:login",e,t)}},{key:"createRoom",value:function(e){this.socket.emit("client:create:room",this.socket.id,e)}},{key:"join",value:function(e){this.socket.emit("client:join",this.socket.id,e)}},{key:"leave",value:function(){this.socket.emit("client:leave",this.socket.id)}}]),e}();module.exports=new Client;