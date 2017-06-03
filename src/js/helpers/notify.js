var notify = (function() {
    const notif = document.createElement('ul');
    const ttl = 3000;
    const className = 'notif';
    const distance = 2;
    const theme = '#d35400';
    let timer = 0;
    let fadeTimer = 0;

    notif.className = className;
    style(`.${className}{
  position: fixed;
  z-index: 100;
  top: ${distance}px;
  right: ${distance}px;
  left: ${distance}px;
  max-height: calc(100% - ${distance * 2}px);
  background: ${theme};
  list-style: none;
  margin: 0;
  overflow: hidden;
  white-space: line-wrap;
  box-sizing: border-box;
  font: 200 13px/39px sans-serif;
}
.${className} li{
  padding: 0 1em;
  overflow: hidden;
  transition: all .3s ease-out;
  color: rgba(255,255,255,1);
  max-height: 5em;
}
.${className} li:nth-child(even){
    background:rgba(0,0,0,.1);
}
.${className} li.read{
  color: rgba(255,255,255,0);
  max-height: 0;
}`);

    function show(msg) {
        let alreadyVisible = notif.parentNode;
        if (!alreadyVisible) {
            document.body.appendChild(notif);
        }
        addMessage(msg, alreadyVisible);
        extendTimer();
    }

    function addMessage(msg, linebreak) {
        const message = document.createTextNode(msg);
        const container = document.createElement('li');
        container.appendChild(message);
        notif.appendChild(container);
        setTimeout(() => {
            container.classList.add('read');
        }, ttl - 500);
        notif.scrollTop = notif.scrollHeight;
    }

    function extendTimer() {
        clearTimeout(timer);
        timer = setTimeout(remove, ttl);
    }

    function remove() {
        notif.parentNode.removeChild(notif);
        notif.innerHTML = '';
    }

    function style(value) {
        const sheet = document.createElement('style');
        sheet.appendChild(document.createTextNode(value));
        document.head.appendChild(sheet);
    }

    return show;
}());