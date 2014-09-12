// ==UserScript==
// @name        Enhance Schlacht-um-Kyoto
// @namespace   http://github.com/Ryuno-Ki/Enhanced-SuK.git
// @description Enhance Schlacht-um-Kyoto
// @match       http://schlacht-um-kyoto.de/*
// @match       http://www.schlacht-um-kyoto.de/*
// @require     https://code.jquery.com/jquery-1.6.2.min.js
// @version     0.0.3
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

if (window.top === window.self) {
  // Not inside the ad frame
  
  var headline = document.querySelector('#chatForm tbody').children;
  var tdContainer = document.createElement('td');
  var japanBtn = document.createElement('input');
  japanBtn.type = 'button';
  japanBtn.classList.add('button');
  japanBtn.classList.add('small');
  japanBtn.id = 'japanBtn';
  japanBtn.title = 'Sprache wechseln';
  japanBtn.value = 'Kanji';
  tdContainer.appendChild(japanBtn)
  headline[0].insertBefore(tdContainer, headline[0].children[2]);
  japanBtn = null;
  japanBtn = document.querySelector('#japanBtn');
  japanBtn.addEventListener('click', function() {
      this.classList.toggle('pressed');
      translate();
  }, false);
  console.log(japanBtn);
  // Adjusting the table
  var colgrp = document.querySelector('#chatForm colgroup');
  var japanCol = document.createElement('col');
  japanCol.width = 70;
  colgrp.insertBefore(japanCol, colgrp.children[2]);
  headline[1].children[0].setAttribute('colspan',6);
  headline[2].children[0].setAttribute('colspan',4);
  document.querySelector('#chatInput').width = '490px';
      
  function translate() {
      var hepburn = require('hepburn');
      var chatMessage = document.querySelectorAll('.chatMessage');
      var authorTime, authorTimePair, author, time;
      for (var i = 0; i < chatMessage.length; i++) {
          authorTime = chatMessage[i].children[0];
          authorTimePair = authorTime.innerHTML.split('(');
          author = authorTimePair[0];
          if (author !== 'Du schreibst ') {
              if (japanBtn.classList.contains('pressed')) {
                  author = hepburn.toHiragana(author);
              } else {
                  author = hepburn.fromKana(author);
                  author = author.charAt(0).toUpperCase() + author.slice(1).toLowerCase();
              }
          }
          time = authorTimePair[1].split(')')[0];
          authorTime.innerHTML = author + '(' + time + ')';
      }
  }

  var linkInChat = $('#chatMessages').find('a');
  console.log(linkInChat);
  linkInChat.css({'color': '#AFE8B5'});
} else { // Outside the main frame, that is, inside the Ad
}
