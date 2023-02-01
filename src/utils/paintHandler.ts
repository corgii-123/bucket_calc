import { useResizeObserver } from "@vueuse/core";
import { fabric } from "fabric";
import { Ref, watch } from "vue";
import soilImg from "../assets/soil.png";

const paintHandler = (myCanvas: fabric.Canvas, refsData: Ref, scale: any) => {
  console.log(refsData.value);
  useResizeObserver(document.documentElement, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    myCanvas.setDimensions({
      width: width * scale.width,
      height: (height - 34 * 2) * scale.height,
    });

    handleImage(myCanvas, refsData);
  });
  watch(
    () => [refsData.value],
    () => {
      handleImage(myCanvas, refsData);
    },
    { deep: true }
  );
};

const handleImage = (myCanvas: fabric.Canvas, refsData: Ref) => {
  myCanvas.clear();
  fabric.Image.fromURL(soilImg, function (oImg) {
    oImg.selectable = false;
    oImg.scale(myCanvas.getWidth() / oImg.getScaledWidth());
    oImg.scaleY =
      ((oImg.scaleY as number) * myCanvas.getHeight()) / oImg.getScaledHeight();
    oImg.top = myCanvas.getHeight() / 2 - oImg.getScaledHeight() / 2;
    const content = handleBucket(myCanvas, refsData);
    myCanvas.add(oImg, ...content);
  });
};

const handleBucket = (myCanvas: fabric.Canvas, refsData: Ref) => {
  let width = myCanvas.getWidth() * 0.75;
  const centerX = myCanvas.getWidth() / 2;
  const centerY = (myCanvas.getHeight() / 2) * 0.94;
  const D = Number(refsData.value.D) || 30;
  const h = Number(refsData.value.h) || 10;

  let i = 0;
  while ((h / D) * width * 1.3 > myCanvas.getHeight() - centerY) {
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

  return [
    path,
    ...handleText({ D, h, centerX, centerY, width, refsData }),
    ...handleArrow({ centerX, centerY, width, h, D }, refsData),
  ];
};

const handleText = ({ centerX, centerY, width, h, D, refsData }: any) => {
  function createText({ top, left, param, value }: any, subscript?: string) {
    const hDescription1 = new fabric.Text(value, {
      left: subscript ? left + 36 : left + 18,
      top: top,
      fontSize: 18,
      fontFamily: "Times New Roman",
    });
    hDescription1.selectable = false;

    const hDescription2 = new fabric.Text(param, {
      left: left,
      top: top,
      fontSize: 18,
      fontFamily: "Times New Roman",
      fontStyle: "italic",
    });
    hDescription2.selectable = false;

    if (subscript) {
      const hDescription3 = new fabric.Text(subscript, {
        left: left + 15,
        top: top + 12,
        fontSize: 8,
        fontFamily: "Times New Roman",
      });
      hDescription3.selectable = false;
      return [hDescription1, hDescription2, hDescription3];
    }
    return [hDescription1, hDescription2];
  }

  let temp = [
    ...createText({
      top: centerY + ((h / D) * width) / 3,
      left: centerX - width / 2,
      value: `=${h}m`,
      param: `h`,
    }),
    ...createText({
      top: centerY,
      left: centerX,
      value: `=${D}m`,
      param: `D`,
    }),
    ...createText(
      {
        top: centerY - 60,
        left: centerX + 20,
        value: refsData.value.Mlrp ? `=${refsData.value.Mlrp}MN·m` : "",
        param: refsData.value.Mlrp ? `M` : "",
      },
      refsData.value.Mlrp && "LRP"
    ),
    ...createText(
      {
        top: centerY - 100,
        left: centerX - 80,
        value: refsData.value.Vlrp ? `=${refsData.value.Vlrp}kN` : "",
        param: refsData.value.Vlrp ? `V` : "",
      },
      refsData.value.Vlrp && "LRP"
    ),
    ...createText(
      {
        top: centerY,
        left: centerX - 120,
        value: refsData.value.Hlrp ? `=${refsData.value.Hlrp}kN` : "",
        param: refsData.value.Hlrp ? `H` : "",
      },
      refsData.value.Hlrp && "LRP"
    ),
  ];

  switch (refsData.value.id) {
    case "submenu-1-item-1":
    case "submenu-1-item-2":
      temp = [
        ...temp,
        ...createText(
          {
            top: (h / D) * width + centerY,
            left: centerX,
            value: ``,
            param: `V`,
          },
          "base"
        ),
        ...createText(
          {
            top: (h / D) * width + centerY,
            left: centerX - width / 2 - width / 20 - 6,
            value: ``,
            param: `V`,
          },
          "side"
        ),
      ];
      break;
    case "submenu-2-item-1":
    case "submenu-2-item-2":
      temp = [
        ...temp,
        ...createText(
          {
            top: (h / D) * width + centerY,
            left: centerX,
            value: ``,
            param: `H`,
          },
          "base"
        ),
        ...createText(
          {
            top: ((h / D) * width * 2) / 3 + centerY,
            left: centerX - width / 2 - width / 20 - 6,
            value: ``,
            param: `H`,
          },
          "side"
        ),
      ];
      break;
    default:
      break;
  }
  return temp;
};

const handleArrow = ({ centerX, centerY, width, h, D }: any, refsData: Ref) => {
  function createLineArrow() {
    var triangle = new fabric.Triangle({
      width: 10,
      height: 15,
      fill: "black",
      left: centerX,
      top: centerY - 10 / 2,
      angle: 90,
    });
    var line = new fabric.Line([40, 100, 100, 100], {
      left: centerX - 60,
      top: centerY,
      stroke: "black",
    });

    return [line, triangle];
  }

  function createCurveArrow() {
    var triangle = new fabric.Triangle({
      width: 10,
      height: 15,
      fill: "black",
      left: centerX + 37.5,
      top: centerY - 20,
      angle: 137.5,
    });
    var path = new fabric.Path(
      `
      C 
      ${centerX - 30} ${centerY} 
      ${centerX} ${centerY - 40}  
      ${centerX + 30} ${centerY}
    `,
      {
        top: -20,
        stroke: "black",
        fill: "transparent",
      }
    );

    return [triangle, path];
  }

  const objs1 = refsData.value.Hlrp && createLineArrow();
  const objs2 = refsData.value.Vlrp && createLineArrow();
  const objs3 = refsData.value.Mlrp && createCurveArrow();
  var alltogetherObj1 = new fabric.Group(objs1);
  var alltogetherObj2 = new fabric.Group(objs2);
  var alltogetherObj3 = new fabric.Group(objs3);

  alltogetherObj2.hasRotatingPoint = true;
  refsData.value.pa ? alltogetherObj2.rotate(-90) : alltogetherObj2.rotate(90);
  alltogetherObj2.left = centerX + 5;
  alltogetherObj2.top = centerY - 60;

  if (refsData.value.pa) {
    alltogetherObj2.top = centerY;
  }

  let temp = [alltogetherObj1, alltogetherObj2, alltogetherObj3];

  switch (refsData.value.id) {
    case "submenu-1-item-1":
    case "submenu-1-item-2": {
      const arrowBase = new fabric.Group(createLineArrow());
      arrowBase.rotate(-90);
      arrowBase.top = centerY + (h / D) * width;
      arrowBase.left = centerX - 5;

      const arrowSide = new fabric.Group(createLineArrow());
      arrowSide.rotate(-90);
      arrowSide.top = centerY + (h / D) * width;
      arrowSide.left = centerX - width / 2 - width / 20 - 6;
      temp = [...temp, arrowSide, arrowBase];
      break;
    }
    case "submenu-2-item-1":
    case "submenu-2-item-2": {
      const arrowBase = new fabric.Group(createLineArrow());
      arrowBase.rotate(180);
      arrowBase.top = centerY + (h / D) * width;
      arrowBase.left = centerX + 60;

      const arrowSide = new fabric.Group(createLineArrow());
      arrowSide.rotate(180);
      arrowSide.top = centerY + ((h / D) * width * 2) / 3;
      arrowSide.left = centerX - width / 2 - width / 20 + 60;
      temp = [...temp, arrowSide, arrowBase];
      break;
    }
    default:
      break;
  }
  return temp.map((v) => {
    v.selectable = false;
    return v;
  });
};

export default paintHandler;
