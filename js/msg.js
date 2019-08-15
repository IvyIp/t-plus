var sourceWindow,
sourceOrign,
focusCheck = false;

var appInfo = null;

var downloading = false;

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
      if (JSON.stringify(appInfo) !== JSON.stringify(message.app)){
        appInfo = message.app;
        updateUI();
        // late assign of downloading to show last progress
        if (downloading && appInfo.mozAPP && (appInfo.mozAPP.installState === 'installed')){
          setTimeout(() => {
            downloading = false;
            updateUI();
          }, 300);
        }
      }
      break;
    case 'setToken':
      if (message.url && message.headers){
        console.log('fetch');
        var request = new Request(message.url, {
          method: 'GET',
          mode: 'cors',
          headers: new Headers(message.headers)
        });
        fetch(request)
          .then(response => {
            return response.json();
          }).then(json => {
            console.log(json)
          }).catch((e) => {
            console.log(e);
          })
      }
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
    let url = appInfo.manifest_url;
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
      case 'Enter':
        // console.log(sourceWindow.navigator.mozApps);
        if (sourceWindow) {
          if (!appInfo.installed && !downloading){
            downloading = true;
            updateUI();
            if (appInfo.type === 'hosted'){
              navigator.mozApps.install(url).then(() => {
              }).catch((error) => {
                alert(`install failed: ${error.name}`);
                downloading = false;
              })
            }else{
              navigator.mozApps.installPackage(url).then(() => {
              }).catch((error) => {
                alert(`install failed: ${error.name}`);
                downloading = false;
              })
            }
          } else {
            // run the app
            sourceWindow.postMessage(
              {'cmd': 'launchApp', 'url': url},
            sourceOrign);
          }
        }
        break;
      case 'SoftRight':
        if (sourceWindow) {
          sourceWindow.postMessage(
            {'cmd': 'uninstall', 'url': url},
          sourceOrign);
        }
        break;
      default:
        break;
    }
  });

  appDesc.focus();
};

function updateUI() {
  console.log('Update UI');
  let brick = document.getElementById('brick');
  let appName = document.getElementById('app-name');
  let appIcon = document.getElementById('app-icon');
  let appDesc = document.getElementById('app-desc');
  const tag = document.getElementById('tag');

  appName.textContent = appInfo.name;
  appDesc.textContent = appInfo.description;
  let iconIndex = Object.keys(appInfo.icons)[0];
  appIcon.src = appInfo.icons[iconIndex];

  if (appInfo.bgs && (Object.keys(appInfo.bgs).length > 0)){
    let bgIndex = Object.keys(appInfo.bgs)[0];
    let bgSrc = appInfo.bgs[bgIndex];
    brick.style = "background-image:url('" + bgSrc + "')";
  }

  const centerAction = document.querySelector('#soft-key .center');
  const rightAction = document.querySelector('#soft-key .right');
  if (downloading){
    centerAction.textContent = '';
  } else if (appInfo.installed === true){
    tag.textContent = 'Installed';
    centerAction.textContent = 'OPEN';
    rightAction.textContent = 'UNINSTALL';
  } else if (appInfo.paid === true){
    tag.textContent = appInfo.unitPrice;
    centerAction.textContent = 'BUY';
    rightAction.textContent = '';
  } else if (appInfo.paid === false){
    tag.textContent = 'Free';
    centerAction.textContent = 'INSTALL';
    rightAction.textContent = '';
  }

  const progress = document.querySelector('#progress');

  if (appInfo.mozAPP && downloading){
    const percent = Math.floor(
      (appInfo.mozAPP.progress / appInfo.mozAPP.downloadSize) * 100
    );
    progress.innerHTML = `<div class="bar"><div class="active" style="width:${percent}%"></div></div>`;
    // progress.textContent = `Downloading: ${percent}%`
  } else if (downloading){
    progress.textContent = `Start to download...`
  } else {
    progress.innerHTML = '';
  }
}
