"use strict";function _classCallCheck(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,a){for(var t=0;t<a.length;t++){var n=a[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,a,t){return a&&_defineProperties(e.prototype,a),t&&_defineProperties(e,t),e}var Datastore=require("nedb"),fs=require("fs"),Database=function(){function e(){_classCallCheck(this,e),this.tables=[],this.loadTables()}return _createClass(e,[{key:"loadTables",value:function(){for(var e=this,t=fs.readdirSync("./server/database"),n=0;n<t.length;n++)!function(){var a=t[n].split(".db")[0];e.tables.find(function(e){return e.name==a})||e.load(a)}()}},{key:"load",value:function(a){var e=new Datastore("./server/database/".concat(a,".db"));return e.loadDatabase(),this.tables.find(function(e){return e.name==a})||this.tables.push({name:a,data:e}),e}},{key:"in",value:function(a){return this.tables.find(function(e){return e.name==a}).data}}]),e}();module.exports=new Database;