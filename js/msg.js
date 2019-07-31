var sourceWindow,
sourceOrign;
function receiveMessage (event) {
  console.log('get message:' + event.origin + ':'
   + JSON.stringify(event.data));
  updateUI(event.data);
  sourceWindow = event.source;
  sourceOrign = event.origin;
  //event.source.postMessage("Roger that!!", event.origin);
}

window.onload = function() {
  window.addEventListener('message', receiveMessage, false);
  window.addEventListener('keydown', (e)=>{
    console.log('remote:' + e.key);
    switch (e.key) {
      case 'BrowserBack':
      case 'Backspace':
      case 'Escape':
        if (sourceWindow) {
          sourceWindow.postMessage('closeMe', sourceOrign);
        }
        e.stopPropagation();
        e.preventDefault();
        break;
      default:
        break;
    }
  });
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