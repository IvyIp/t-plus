function receiveMessage (event) {
  console.log('get message:' + event.origin + ':'
   + JSON.stringify(event.data));
  //event.source.postMessage("Roger that!!", event.origin);
}

window.onload = function() {
  window.addEventListener('message', receiveMessage, false);
  window.addEventListener('keydown', (e)=>{
    console.log('remote:' + e.key)
  });
};