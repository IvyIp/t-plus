var sourceWindow,
sourceOrign,
focusCheck = false;
function receiveMessage (event) {
  console.log('get message:' + event.origin + ':'
   + JSON.stringify(event.data));
  let message = event.data;

  sourceWindow = event.source;
  sourceOrign = event.origin;
  switch (message.cmd) {
    case 'checkFocus':
      if (focusCheck) {
        sourceWindow.postMessage({'cmd': 'ready'}, sourceOrign);
      } else {
        sourceWindow.postMessage({'cmd': 'waiting'}, sourceOrign);
      }
      break;
    case 'showInfo':
      updateUI(message.app);
      break;
  }
}

window.onload = function() {
  let appDesc = document.getElementById('app-desc');
  appDesc.addEventListener('focus', (e) =>{
    focusCheck = true;
    if (sourceWindow) {
      console.log('get focus !!');
      sourceWindow.postMessage({'cmd': 'ready'}, sourceOrign);
    }
  }, false);

  appDesc.addEventListener('blur', (e) =>{
    focusCheck = false;
  }, false);

  window.addEventListener('message', receiveMessage, false);
  window.addEventListener('keydown', (e)=>{
    console.log('remote:' + e.key);
    switch (e.key) {
      case 'BrowserBack':
      case 'Backspace':
      case 'Escape':
        if (sourceWindow) {
          sourceWindow.postMessage({'cmd': 'closeMe'}, sourceOrign);
        }
        e.stopPropagation();
        e.preventDefault();
        break;
      default:
        break;
    }
  });

  appDesc.focus();
};

function updateUI(appInfo) {
  let brick = document.getElementById('brick');
  let appName = document.getElementById('app-name');
  let appIcon = document.getElementById('app-icon');
  let appDesc = document.getElementById('app-desc');
  let brickBgImg = appInfo.bgs;

  appName.textContent = appInfo.name;
  appDesc.textContent = appInfo.description;
  let iconIndex = Object.keys(appInfo.icons)[0];
  appIcon.src = appInfo.icons[iconIndex];

  let bgIndex = Object.keys(appInfo.bgs)[0];
  let bgSrc = appInfo.bgs[bgIndex];
  brick.style = "background-image:url('" + bgSrc + "')";
}