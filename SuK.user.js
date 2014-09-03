// ==UserScript==
// @name        Enhance Schlacht-um-Kyoto
// @namespace   http://github.com/Ryuno-Ki/GMscripts
// @description Enhance Schlacht-um-Kyoto
// @match       http://schlacht-um-kyoto.de/*
// @match       http://www.schlacht-um-kyoto.de/*
// @require     https://code.jquery.com/jquery-1.6.2.min.js
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

if (window.top === window.self) {
  // Not inside the chat frame

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
  }; // End http://wiki.greasespot.net/Complex_Persistent_Values

  // Parse the URL for search attribute (&k=v) 
  $.extend({
    getUrlVars: function(){
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
	hash = hashes[i].split('=');
	vars.push(hash[0]);
	vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getUrlVar: function(name){
      return $.getUrlVars()[name];
    }
  }) // End getUrlVars from http://jquery-howto.blogspot.de/2009/09/get-url-parameters-values-with-jquery.html 

  function decode(snippet) {
    var sanitized = snippet;
    if (sanitized) { sanitized = sanitized.replace(/%FC/,'ü'); }
    return sanitized;
  }

  // Save the values of this town in a database
  var storageDepot = new settingsObject();
  var currentTownId = $('#townJumper option:selected').val();
  storageDepot.prefix = 'Depot-' + currentTownId;

  var ressources   = $('#header_ressources').find('li');
  var holzDepot    = ressources.first();
  var eisenDepot   = holzDepot.next();
  var sakeDepot    = eisenDepot.next();
  var nahrungDepot = sakeDepot.next();

  storageDepot.set('holz', holzDepot.children('font').text());
  storageDepot.set('eisen', eisenDepot.children('font').text());
  storageDepot.set('sake', sakeDepot.children('font').text());
  storageDepot.set('nahrung', nahrungDepot.contents().last().text());

  var storageGebaeude = new settingsObject();
  var currentGebaeude = decode($.getUrlVar('show')) || 'empty';
  storageGebaeude.prefix = 'Gebaeude-' + currentTownId;

  $('.Siedlung').children('img').each( function() {
    //if (savedGebaeudeBedarf.holz === null)
    storageGebaeude.set(this.alt, {'holz': null, 'eisen': null, 'sake': null});
    console.log(storageGebaeude.get(this.alt));
  });

  var currentBedarf = storageGebaeude.get(currentGebaeude);
  var currentHolzBedarf = $('.infobox_text').find('.sprite_Holz').parent().contents().last().text();
  var currentEisenBedarf = $('.infobox_text').find('.sprite_Eisen').parent().contents().last().text();
  var currentSakeBedarf = $('.infobox_text').find('.sprite_Sake').parent().contents().last().text();
  currentBedarf.holz = currentHolzBedarf;
  currentBedarf.eisen = currentEisenBedarf;
  currentBedarf.sake = currentSakeBedarf;
  storageGebaeude.set(currentGebaeude, currentBedarf);
  console.log(storageGebaeude.get(currentGebaeude));
} // Outside the chat frame
