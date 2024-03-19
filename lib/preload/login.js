const { ipcRenderer } = require('electron');



// demo页面jsbridge, 可根据自己的主页需求自行实现
window.joinClassBySign = (urlParams) => {
  ipcRenderer.send('create-class', urlParams);
};
