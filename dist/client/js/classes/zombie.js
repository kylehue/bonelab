"use strict";function _classCallCheck(e,i){if(!(e instanceof i))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,i){for(var t=0;t<i.length;t++){var s=i[t];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}function _createClass(e,i,t){return i&&_defineProperties(e.prototype,i),t&&_defineProperties(e,t),e}var shape=require("../../../../lib/shape.js"),zombieImg=new Image;zombieImg.src="assets/images/zombie.png";var Zombie=function(){function t(e,i){_classCallCheck(this,t),this.id=e,this.position=i.position,this.serverPosition=this.position.copy(),this.radius=i.radius,this.angle=i.angle,this.shape=shape.polygon(this.position.x,this.position.y,this.radius,16)}return _createClass(t,[{key:"render",value:function(e){e.save(),e.context.translate(this.position.x,this.position.y),e.context.rotate(this.position.heading(this.serverPosition));var i=.024*this.radius;e.context.scale(i,i),e.context.drawImage(zombieImg,-zombieImg.width/2+15,-zombieImg.height/2),e.restore()}},{key:"update",value:function(){this.position.lerp(this.serverPosition,.2)}}]),t}();module.exports={create:function(e,i){return new Zombie(e,i)}};