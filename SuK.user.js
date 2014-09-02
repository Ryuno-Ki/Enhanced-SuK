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

//console.log($('.Siedlung').children('img'));
console.log($('#header_ressources').find('a'));
var ressources = $('#header_ressources').find('li');
var holzDepot = ressources[0].children('font').text();
console.log(ressources)
console.log(holzDepot);

