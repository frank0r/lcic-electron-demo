
const { BrowserWindow, app, ipcMain, Menu } = require('electron');
const TCIC = require("tcic-electron-sdk");
const path = require('path');

// onClose?: () => void;
// onReady?: () => void;
// schoolId: number;
// classId: number;
// userId: string;
// classType: number;
// classSubType: string;
// token: string;
// lng?: string;
// scene?: string;
// debugCss?: string;
// debugJs?: string;
// waterMark: WaterMarkParams;
// customParams?: string;
// url?: string;
// sign?: string;
// cid?: string;
// uid?: string;
/**
* @description 打开课堂窗口.(目前课堂窗口只支持独立打开)
*  当前有两种传参方式:
*   1. 直接传web课堂的url, 支持自定义参数. (推荐)
*   2. 传classId,schoolId, token, userId,等参数,sdk内部会自动拼接, 如果都传,优先使用传入的url.
*/
async function createClass(urlParams) {
  const ret = await TCIC.initialize({
    url: genWebUrl(urlParams),
    onReady: () => {
      loginWin.hide();
    },
    onClose: () => {
      loginWin.show();
    }
  });
  console.log('%c [ ret ]-32', 'font-size:13px; background:pink; color:#bf2c9f;', ret);
}

function genWebUrl(urlParams) {
  const arr = [];
  for (const [key, val] of Object.entries(urlParams)) {
    arr.push(`${key}=${val}`);
  }
  return `https://class.qcloudclass.com/latest/class.html?${arr.join('&')}`;
}

let loginWin = null;

function createLoginWin() {
  if (loginWin) {
    loginWin.show();
    return;
  }
  loginWin = new BrowserWindow({
    width: 1296,
    height: 762,
    show: true,
    hasShadow: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload', "login.js"),
    },
  });
  loginWin.setMenu(null);
  Menu.setApplicationMenu(null);

  // 可以替换为你的主页
  loginWin.loadURL(`https://class.qcloudclass.com/latest/login.html?lng=zh`);

  loginWin.on("closed", function () {
    loginWin = null;
  });

  loginWin.webContents.once('dom-ready', () => {
    loginWin.show();
  });
}

ipcMain.on('create-class', (event, urlParams) => {
  createClass(urlParams);
});

app.whenReady().then(() => {
  createLoginWin();
});

