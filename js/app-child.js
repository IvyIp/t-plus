'use strict';
window.onload = function() {
  init();
};

function init() {
  let twitterBtn = document.getElementById('twitter-donwload-btn');
  let keyCode = document.getElementById('key-code');
  //let fbBtn = document.getElementById('fb-donwload-btn');
  twitterBtn.focus();
  twitterBtn.addEventListener('keydown', (e)=>{
    let url = 'https://mobile.twitter.com/kaios.webapp';
    console.log('app url:' + url);
    if (navigator.mozApps) {
      var request = navigator.mozApps.install(url);
      request.onsuccess = function() {
        console.log('app ok');
        keyCode.textContent = e.key + 'app ok';
      };

      request.onerror = function() {
        console.log('app error');
        keyCode.textContent = e.key + 'app error';
      };
    }else {
      keyCode.textContent = e.key;
    }
  });

  /*
  fbBtn.addEventListener('keydown', ()=>{
    console.log('pizza~~1');
    let url = 'https://api.kaiostech.com/apps/manifest/oRD8oeYmeYg4fLIwkQPH';
  });
  */
}