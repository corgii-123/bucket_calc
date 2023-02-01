import { dialog } from "electron";
import { bucketCalc } from "../utils/bucketCalc";
import change2Num from "../utils/change2Num";
import {
  exportExcel,
  readExcel,
  readExcelList,
  deleteFile,
  openFile,
} from "../utils/handleExcel";
import path from "path";

async function handleFileOpen(e, oldDirectory: string) {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory", "promptToCreate", "createDirectory"],
    defaultPath: oldDirectory,
    filters: [{ name: "Excel Files", extensions: ["xlsx"] }],
  });
  if (canceled) {
    return "";
  } else {
    return filePaths[0];
  }
}

async function handleCalc(e, inputInfo) {
  const { id, filePath, data: info } = inputInfo;
  const data = change2Num(JSON.parse(info));
  const result = bucketCalc(id, data);
  return JSON.stringify(result);
}

async function handleExport(e, path, filename, data) {
  try {
    exportExcel(path, filename, data);
    return true;
  } catch (err) {
    return false;
  }
}

async function handleRead(e, path, filename) {
  try {
    const res = readExcel(path, filename);
    return JSON.stringify(res);
  } catch (err) {
    return false;
  }
}

async function handleReadList(e, workspace, type) {
  try {
    const res = readExcelList(workspace, type);
    return JSON.stringify(res);
  } catch (err) {
    return false;
  }
}

async function handleDelete(_, workspace, filename) {
  try {
    deleteFile(workspace, filename);
  } catch (err) {
    console.log(err);
  }
}

async function handleOpen(_, workspace, filename) {
  try {
    return await openFile(workspace, filename);
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function handleOpenReference(e, filename) {
  let resourcesPath = "";
  try {
    if (process.env.VITE_DEV_SERVER_URL) {
      resourcesPath = path.resolve(__dirname, "../../extraResources");
    } else {
      resourcesPath = path.resolve(process.resourcesPath, "extraResources");
    }
    return await openFile(resourcesPath, filename);
  } catch (err) {
    console.log(err);
    return err;
  }
}

export function winIpcMain(win) {
  const ipcMain = win.webContents.ipc;
  ipcMain.on("hello-world", () => console.log("ok"));
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("read:calcFile", handleRead);
  ipcMain.handle("read:fileList", handleReadList);
  ipcMain.on("delete:file", handleDelete);
  ipcMain.on("close:main", () => win.close());
  ipcMain.handle("open:file", handleOpen);
  ipcMain.handle("open:reference", handleOpenReference);
}

export function calcIpcMain(win) {
  const ipcMain = win.webContents.ipc;
  ipcMain.handle("update:prepareCalc", handleCalc);
  ipcMain.handle("export:excel", handleExport);
  ipcMain.handle("read:calcFile", handleRead);
  ipcMain.on("close:calc", () => win.close());
  ipcMain.on("resize:win", (e, width, height) =>
    win.setContentSize(width, height)
  );
}
