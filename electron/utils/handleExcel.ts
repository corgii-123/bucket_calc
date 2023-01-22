import xlsx from "node-xlsx";
import fs from "fs";
import childProcess from "child_process";
import path from "path";
const { exec } = childProcess;

export function readExcel(path, filename) {
  const workSheetsFromBuffer = xlsx.parse(
    fs.readFileSync(`${path}/${filename}`)
  );
  return workSheetsFromBuffer;
}

export function exportExcel(path, filename, data) {
  const buffer = xlsx.build([
    { name: "bucket calculate sheet", data, options: {} },
  ]);
  fs.writeFileSync(`${path}/${filename}`, buffer);
}

export function readExcelList(workspace, type) {
  const files = fs.readdirSync(workspace);
  const excelFiles = files.filter((v) => {
    const temp = v.split(".");
    return "xlsx" === temp[temp.length - 1];
  });
  const res = [];
  for (let excelFile of excelFiles) {
    const workSheetsFromBuffer = xlsx.parse(
      fs.readFileSync(`${workspace}/${excelFile}`)
    );
    const [_, temp] = workSheetsFromBuffer[0].data;
    if (temp[0] === type) {
      res.push(excelFile);
    }
  }
  return res;
}

export function deleteFile(workspace, filename) {
  fs.unlinkSync(`${workspace}/${filename}`);
}

export function openFile(workspace, filename) {
  return new Promise((resolve: any) =>
    exec(
      path.join(workspace, filename).replace(/ /g, '" "'),
      function (err, data) {
        console.log(err);
        resolve(path.resolve(workspace, filename));
      }
    )
  );
}
