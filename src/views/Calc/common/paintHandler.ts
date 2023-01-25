import { useResizeObserver } from "@vueuse/core";
import { fabric } from "fabric";
import { Ref, watch } from "vue";
import soilImg from "../../../assets/soil.png";

const paintHandler = (myCanvas: fabric.Canvas, refsData: Ref) => {
  useResizeObserver(document.documentElement, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    myCanvas.setDimensions({
      width: width * 0.45,
      height: (height - 34 * 2) * 0.95,
    });

    handleImage(myCanvas, refsData);
  });
  watch(
    () => [refsData.value.D, refsData.value.h],
    () => {
      handleImage(myCanvas, refsData);
    }
  );
};

const handleBucket = (myCanvas: fabric.Canvas, refsData: Ref) => {
  let width = myCanvas.getWidth() * 0.75;
  const centerX = myCanvas.getWidth() / 2;
  const centerY = (myCanvas.getHeight() / 2) * 0.94;
  const D = Number(refsData.value.D);
  const h = Number(refsData.value.h);

  let i = 0;
  while ((h / D) * width * 1.1 > myCanvas.getHeight() - centerY) {
    width = myCanvas.getWidth() * (0.75 - i * 0.01);
    i++;
  }

  const pathLine = `
    M ${centerX} ${centerY}
    L ${centerX + width / 2} ${centerY}
    L ${centerX + width / 2} ${centerY + (h / D) * width}
    L ${centerX + width / 2 + width / 20} ${centerY + (h / D) * width}
    L ${centerX + width / 2 + width / 20} ${centerY - width / 20}
    L ${centerX - width / 2 - width / 20} ${centerY - width / 20}
    L ${centerX - width / 2 - width / 20} ${centerY + (h / D) * width}
    L ${centerX - width / 2} ${centerY + (h / D) * width}
    L ${centerX - width / 2} ${centerY}
    z
  `;

  // const pathLine = "m 200 200 l 300 300 l 400 400 z";
  const path = new fabric.Path(pathLine);
  path.selectable = false;
  path.bringToFront();
  path.set({ fill: "gray", stroke: "#335485", opacity: 0.95 });

  return { path, ...handleText({ D, h, centerX, centerY, width }) };
};

const handleImage = (myCanvas: fabric.Canvas, refsData: Ref) => {
  myCanvas.clear();
  fabric.Image.fromURL(soilImg, function (oImg) {
    oImg.selectable = false;
    oImg.scale(myCanvas.getWidth() / oImg.getScaledWidth());
    oImg.scaleY =
      ((oImg.scaleY as number) * myCanvas.getHeight()) / oImg.getScaledHeight();
    oImg.top = myCanvas.getHeight() / 2 - oImg.getScaledHeight() / 2;
    const { path, dDescription1, hDescription2, dDescription2, hDescription1 } =
      handleBucket(myCanvas, refsData);
    myCanvas.add(
      oImg,
      path,
      dDescription1,
      hDescription2,
      dDescription2,
      hDescription1
    );
  });
};

const handleText = ({ centerX, centerY, width, h, D }: any) => {
  const hDescription1 = new fabric.Text(`=${h}m`, {
    left: centerX - width / 2 + 18,
    top: centerY + ((h / D) * width) / 2,
    fontSize: 22,
    fontFamily: "Times New Roman",
  });
  hDescription1.selectable = false;

  const hDescription2 = new fabric.Text(`h`, {
    left: centerX - width / 2,
    top: centerY + ((h / D) * width) / 2,
    fontSize: 22,
    fontFamily: "Times New Roman",
    fontStyle: "italic",
  });
  hDescription2.selectable = false;

  const dDescription1 = new fabric.Text(`=${D}m`, {
    left: centerX,
    top: centerY,
    fontSize: 22,
    fontFamily: "Times New Roman",
  });
  dDescription1.selectable = false;

  const dDescription2 = new fabric.Text(`D`, {
    left: centerX - 22,
    top: centerY,
    fontSize: 22,
    fontFamily: "Times New Roman",
    fontStyle: "italic",
  });
  dDescription2.selectable = false;
  return { hDescription1, hDescription2, dDescription2, dDescription1 };
};

export default paintHandler;
