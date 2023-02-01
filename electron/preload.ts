import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  test: () => ipcRenderer.send("hello-world"),
  openFile: (defaultDirectory: any) =>
    ipcRenderer.invoke("dialog:openFile", defaultDirectory),
  prepareCalc: (inputInfo: { id: string; workSpace: string; data: string }) =>
    ipcRenderer.invoke("update:prepareCalc", inputInfo),
  openCalcWin: (id, workSpace, filename, route, resultParams) => {
    ipcRenderer.send("open-win", id, workSpace, filename, route, resultParams);
  },
  exportExcel: (path: any, filename: any, data: any) =>
    ipcRenderer.invoke("export:excel", path, filename, data),
  readCalcFile: (path: any, filename: any) =>
    ipcRenderer.invoke("read:calcFile", path, filename),
  readFileList: (workspace, type) =>
    ipcRenderer.invoke("read:fileList", workspace, type),
  deleteFile: (workspace, filename) =>
    ipcRenderer.send("delete:file", workspace, filename),
  closeMain: () => ipcRenderer.send("close:main"),
  closeCalc: () => ipcRenderer.send("close:calc"),
  openExcelFile: (workspace, filename) =>
    ipcRenderer.invoke("open:file", workspace, filename),
  openReferenceFile: (filename) =>
    ipcRenderer.invoke("open:reference", filename),
  openHelperFile: (filename) => ipcRenderer.invoke("open:reference", filename),
  resizeWin: (width, height) => ipcRenderer.send("resize:win", width, height),
  handleResult: (cb) => ipcRenderer.on("handle:resultParams", cb),
});
