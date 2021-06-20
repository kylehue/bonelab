"use strict";function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function random(t,e){return Math.random()*(e-t)+t}var Vector=function(){function n(){_classCallCheck(this,n);var t="object"==_typeof(arguments[0])?arguments[0].x:arguments[0],e="object"==_typeof(arguments[0])?arguments[0].y:arguments[1];this.x=t||0,this.y=e||0}return _createClass(n,[{key:"add",value:function(){var t="object"==_typeof(arguments[0])?arguments[0].x:arguments[0],e="object"==_typeof(arguments[0])?arguments[0].y:arguments[1];return"number"==typeof t&&(this.x+=t),"number"==typeof e&&(this.y+=e),this}},{key:"sub",value:function(){var t="object"==_typeof(arguments[0])?arguments[0].x:arguments[0],e="object"==_typeof(arguments[0])?arguments[0].y:arguments[1];return"number"==typeof t&&(this.x-=t),"number"==typeof e&&(this.y-=e),this}},{key:"mult",value:function(){var t="object"==_typeof(arguments[0])?arguments[0].x:arguments[0],e="object"==_typeof(arguments[0])?arguments[0].y:arguments[1];return"number"==typeof t&&(this.x*=t),"number"==typeof e&&(this.y*=e),this}},{key:"div",value:function(){var t="object"==_typeof(arguments[0])?arguments[0].x:arguments[0],e="object"==_typeof(arguments[0])?arguments[0].y:arguments[1];return"number"==typeof t&&(this.x/=t),"number"==typeof e&&(this.y/=e),this}},{key:"set",value:function(){var t="object"==_typeof(arguments[0])?arguments[0].x:arguments[0],e="object"==_typeof(arguments[0])?arguments[0].y:arguments[1];return"number"==typeof t&&(this.x=t),"number"==typeof e&&(this.y=e),this}},{key:"reset",value:function(){return this.x=0,this.y=0,this}},{key:"limit",value:function(t){return t=t||1,this.getMag()>=t&&this.setMag(t),this}},{key:"lerp",value:function(t,e){return e=e||.1,"number"==typeof t.x&&(this.x=e*(t.x-this.x)+this.x),"number"==typeof t.y&&(this.y=e*(t.y-this.y)+this.y),this}},{key:"dist",value:function(){var t="object"==_typeof(arguments[0])?arguments[0].x:arguments[0],e="object"==_typeof(arguments[0])?arguments[0].y:arguments[1];return Math.sqrt((this.x-t)*(this.x-t)+(this.y-e)*(this.y-e))}},{key:"heading",value:function(){var t="object"==_typeof(arguments[0])?arguments[0].x:arguments[0],e="object"==_typeof(arguments[0])?arguments[0].y:arguments[1];return arguments.length?Math.atan2(e-this.y,t-this.x):Math.atan2(this.y,this.x)}},{key:"copy",value:function(){return new n(this.x,this.y)}},{key:"setMag",value:function(t){var e=0==(e=this.getMag())?.001:e;return this.x*=1/e*t,this.y*=1/e*t,this}},{key:"getMag",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y)}},{key:"random2D",value:function(t){return this.x=random(-(t="number"!=typeof t?1:t),t),this.y=random(-t,t),this.setMag(t),this}}]),n}();module.exports=function(t,e){return new Vector(t,e)};