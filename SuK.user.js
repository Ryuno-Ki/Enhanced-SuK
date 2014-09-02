// ==UserScript==
// @name        Enhance Schlacht-im-Kyoto
// @namespace   http://github.com/Ryuno-Ki/GMscripts
// @description Enhance Schlacht-um-Kyoto
// @match       http://schlacht-um-kyoto.de/*
// @match       http://www.schlacht-um-kyoto.de/*
// @require     https://code.jquery.com/jquery-1.6.2.min.js
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

// settingsObject by GreaseSpot, slightly modified
function settingsObject(){
  this.prefix="";
  this.default={};
}

settingsObject.prototype.set=function(name, value){
  if(typeof value == "boolean"){ value = value ? "{b}1" : "{b}0"; }
  else if(typeof value == "string"){ value = "{s}" + value; }
  else if(typeof value == "number"){ value = "{n}" + value; }
  else{ value = "{o}" + value.toSource(); }
  GM_setValue(this.prefix+""+name, value);
};

settingsObject.prototype.get=function(name){
  var value=GM_getValue(this.prefix+""+name, this.default[name] || "{b}0")
  if(!value.indexOf){ return value; }
  if(value.indexOf("{o}")==0){
    try{
      return eval("("+value.substr(3)+")");
    }catch(e){
      console.log("Error while calling variable "+name+" while translating into an object: \n\n"+e+"\n\ncode:\n"+value.substr(3))
      return false;
    }
  }
  if(value.indexOf("{b}")==0){ return !!parseInt(value.substr(3)); }
  if(value.indexOf("{n}")==0){ return parseFloat(value.substr(3)); }
  if(value.indexOf("{s}")==0){ return value.substr(3); }
  return value;
};

settingsObject.prototype.register=function(name, defaultvalue){
  this.default[name]=defaultvalue;
  return true;
};
// End http://wiki.greasespot.net/Complex_Persistent_Values

var storageDepot = new settingsObject();
storageDepot.prefix = 'Depot';

var ressources   = $('#header_ressources').find('li');
var holzDepot    = ressources.first();
var eisenDepot   = holzDepot.next();
var sakeDepot    = eisenDepot.next();
var nahrungDepot = sakeDepot.next();
console.log(holzDepot, eisenDepot, sakeDepot, nahrungDepot);

console.log(holzDepot.children('font').text());
