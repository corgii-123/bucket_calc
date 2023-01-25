import { app, BrowserWindow, shell, ipcMain } from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { winIpcMain, calcIpcMain } from "../ipc/main";

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;
const preload = join(__dirname, "../preload/preload.js");

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

let loading = null;

async function createWindow() {
  win = new BrowserWindow({
    title: "海上风电筒型基础承载力设计计算工具箱",
    icon: join(process.env.PUBLIC, "marine.ico"),
    webPreferences: {
      preload,
    },
    autoHideMenuBar: true,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  winIpcMain(win);

  win.once("ready-to-show", () => {
    loading.hide();
    loading.close();
    win.show();
  });
}

async function createLoading() {
  loading = new BrowserWindow({
    show: false,
    frame: false, // 无边框（窗口、工具栏等），只包含网页内容

    resizable: false,
    transparent: true, // 窗口是否支持透明，如果想做高级效果最好为true
    icon: join(process.env.PUBLIC, "marine.ico"),
  });

  loading.once("show", () => {
    setTimeout(createWindow, 3000);
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    loading.loadFile(join(process.env.DIST, "../extraResources/loading.html"));
  } else {
    loading.loadFile(
      join(process.resourcesPath, "extraResources", "loading.html")
    );
  }
  loading.show();
}

app.whenReady().then(() => {
  createLoading();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.on("open-win", (_, ...args) => {
  const [id, workSpace, filename] = args;
  const childWindow = new BrowserWindow({
    icon: join(process.env.PUBLIC, "marine.ico"),
    webPreferences: {
      preload,
    },
    autoHideMenuBar: true,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(
      `${url}#calc/${id}?path=${workSpace}&filename=${filename}`
    );
  } else {
    childWindow.loadFile(indexHtml, {
      hash: `#calc/${id}?path=${workSpace}&filename=${filename}`,
    });
  }

  calcIpcMain(childWindow);
});
