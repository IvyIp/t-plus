'use strict';
window.onload = function() {
  init();
};
const HOSTED = 1;
const PACKAGED = 3;
let keyCode = document.getElementById('key-code');

function installapp (url, type) {
  var request;
  if (!navigator.mozApps) {
    console.log('not supported!!!');
    return;
  }
  if (type === HOSTED) {
    request = navigator.mozApps.install(url);
  } else {
    request = navigator.mozApps.installPackage(url);
  }
  request.onsuccess = function() {
    console.log('app ok');
    keyCode.textContent = url + 'app ok';
  };

  request.onerror = function() {
    console.log('app error');
    keyCode.textContent = url + 'app error';
  };
}

function init() {
  let twitterBtn = document.getElementById('twitter-donwload-btn');
  let pakApp = document.getElementById('pakApp');

  let pkAppUrl =
    'https://api.stage.kaiostech.com/apps/manifest/lj6skNdORZPHqWfrqSwY';
  let twUrl = 'https://mobile.twitter.com/kaios.webapp';
  window.addEventListener('keydown', (e)=>{
    switch (e.key) {
      case '1':
        twitterBtn.focus();
        installapp(twUrl, e.key);
        break;
      case '3':
        pakApp.focus();
        installapp(pkAppUrl, e.key);
        break;
      default:
        keyCode.textContent = e.key;
        break;
    }
  });

  window.addEventListener('focus', (e)=>{
    keyCode.textContent = 'this page gets focus!!';
  });
}