"use strict";function _classCallCheck(i,e){if(!(i instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(i,e){for(var t=0;t<e.length;t++){var s=e[t];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(i,s.key,s)}}function _createClass(i,e,t){return e&&_defineProperties(i.prototype,e),t&&_defineProperties(i,t),i}var uuid=require("uuid"),config=require("../../../lib/config.js"),utils=require("../../../lib/utils.js"),shape=require("../../../lib/shape.js"),closeObjects=[],Bullet=function(){function t(i,e){_classCallCheck(this,t),this.playerId=i,this.id=uuid.v4(),this.position=e.position,this.positionOrigin=this.position.copy();this.angle=e.angle+utils.random(.03*-Math.PI,.03*Math.PI),this.radius=config.bullet.radius,this.shape=shape.circle(this.position.x,this.position.y,this.radius),this.label="bullet"}return _createClass(t,[{key:"addToQuadtree",value:function(i){i.insert({x:this.position.x-this.radius,y:this.position.y-this.radius,width:2*this.radius,height:2*this.radius,self:this})}},{key:"update",value:function(i){closeObjects=i.quadtree.retrieve({x:this.position.x-this.radius,y:this.position.y-this.radius,width:2*this.radius,height:2*this.radius}),this.position.add({x:Math.cos(this.angle)*config.bullet.speed,y:Math.sin(this.angle)*config.bullet.speed}),this.shape.translate(this.position.x,this.position.y);for(var e=0;e<closeObjects.length;e++){var t=closeObjects[e].self;if("barrier"===t.label&&shape.SAT(this.shape,t.body)){i.removeBullet(this.id);break}}this.position.dist(this.positionOrigin)>config.bullet.range&&i.removeBullet(this.id)}}]),t}();module.exports={create:function(i,e){return new Bullet(i,e)}};