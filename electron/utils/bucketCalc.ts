function calc1(data) {
  const { Vlrp, Hlrp, Mlrp, D, h, sum, k, gama, alpha, Wbucket, gamam } = data;

  const s$um = sum / gamam;
  const k$ = k / gamam;
  const Vside = Math.PI * D * h * alpha * (s$um + (k$ * h) / 2);
  const V$base =
    Vlrp +
    Wbucket +
    (Math.PI * (D * D) * h * gama) / 4 -
    Math.PI * D * h * alpha * (s$um + (k$ * h) / 2);
  const Hside = D * h * ((gama * h) / 2 + 2 * s$um + k$ * h);
  const M$base = Mlrp + Hlrp * h;
  const e = M$base / V$base;
  const Aeff =
    2 *
    (((D * D) / 4) * Math.acos((2 * e) / D) -
      e * Math.sqrt((D * D) / 4 - e * e));
  const Be = D - 2 * e;
  const Le = Math.sqrt(D * D - (D - Be) * (D - Be));
  const Leff = Math.sqrt((Aeff * Le) / Be);
  const Beff = Math.sqrt((Aeff * Be) / Le);
  const H$base = Hlrp - Hside;
  const ica = 0.5 - 0.5 * Math.sqrt(1 - H$base / (Aeff * (s$um + k$ * h)));
  const Vbase =
    Aeff *
    ((2 + Math.PI) *
      (s$um + k$ * h) *
      (1 +
        (0.2 * (1 - 2 * ica) * Beff) / Leff +
        0.3 * Math.atan(h / Beff) -
        ica) +
      gama * h);
  const Vult = Vbase + Vside;
  return {
    resultTitle: [
      "裙边侧摩阻力V<sub>side</sub>",
      "偏心距e",
      "地基有效面积A<sub>eff</sub>",
      "基底抗力V<sub>base</sub>",
      "竖向极限承载力V<sub>ult</sub>",
    ],
    result: {
      Vside,
      e,
      Aeff,
      Vbase,
      Vult,
    },
    status: {
      isFinish: true,
      message:
        Vlrp + Wbucket < Vult
          ? `V<sub>LRP</sub>+W<sub>bucket</sub>＜V<sub>ult</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=V<sub>ult</sub>/(V<sub>LRP</sub>+W<sub>bucket</sub>)=${(
              Vult /
              (Vlrp + Wbucket)
            ).toFixed(2)}`
          : "V<sub>LRP</sub>+W<sub>bucket</sub>＞V<sub>ult</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>",
    },
  };
}

function calc2(data) {
  let { Vlrp, Hlrp, Mlrp, D, h, fai, gama, K, deta, Wbucket, gamam, dgama } =
    data;

  const fai$ = (fai * Math.PI) / 180;
  deta = (deta * Math.PI) / 180;

  const fai$$ = Math.atan(Math.tan(fai$) / gamam);
  const deta$ = Math.atan(Math.tan(deta) / gamam);
  const Vside = ((Math.PI * D * gama * (h * h)) / 2) * K * Math.tan(deta$);
  const V$base =
    Vlrp +
    Wbucket +
    (Math.PI * (D * D) * h * gama) / 4 -
    ((Math.PI * D * gama * (h * h)) / 2) * K * Math.tan(deta$);
  const Kp = (1 + Math.sin(fai$$)) / (1 - Math.sin(fai$$));
  const Hside = ((gama * (h * h) * D) / 2) * (Kp - 1 / Kp);
  const M$base = Mlrp + Hlrp * h;
  const e = M$base / V$base;
  const Aeff =
    2 *
    (((D * D) / 4) * Math.acos((2 * e) / D) -
      e * Math.sqrt(Math.pow(D / 2, 2) - e * e));
  const H$base = Hlrp - Hside;
  const B$ = Math.sqrt((Math.PI * D * D) / 4);
  const L$ = B$;
  const Be = D - 2 * e;
  const Le = Math.sqrt(D * D - (D - Be) * (D - Be));
  const Leff = Math.sqrt((Aeff * Le) / Be);
  const Beff = Math.sqrt((Aeff * Be) / Le);
  const Nq =
    Math.pow(Math.tan(Math.PI / 4 + fai$$ / 2), 2) *
    Math.pow(Math.E, Math.PI * Math.tan(fai$$));
  const Ngama = 1.5 * (Nq - 1) * Math.tan(fai$$);
  const iq = 1 - 0.5 * Math.pow(H$base / V$base, 5);
  const igama = 1 - 0.7 * Math.pow(H$base / V$base, 5);
  const sq = 1 + iq * (B$ / L$) * Math.sin(fai$$);
  const sgama = 1 - 0.4 * igama * (B$ / L$);
  const dq =
    1 + 1.2 * (h / B$) * Math.tan(fai$$) * Math.pow(1 - Math.sin(fai$$), 2);
  const Vbase =
    Aeff *
    ((1 / 2) * gama * Beff * Ngama * sgama * dgama * igama +
      gama * h * Nq * sq * dq * iq);
  const Vult = Vbase + Vside;
  return {
    resultTitle: [
      "裙边侧摩阻力V<sub>side</sub>",
      "偏心距e",
      "地基有效面积A<sub>eff</sub>",
      "基底抗力V<sub>base</sub>",
      "竖向极限承载力V<sub>ult</sub>",
    ],
    result: {
      Vside,
      e,
      Aeff,
      Vbase,
      Vult,
    },
    status: {
      isFinish: true,
      message:
        Vlrp + Wbucket < Vult
          ? `V<sub>LRP</sub>+W<sub>bucket</sub>＜V<sub>ult</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=V<sub>ult</sub>/(V<sub>LRP</sub>+W<sub>bucket</sub>)=${(
              Vult /
              (Vlrp + Wbucket)
            ).toFixed(2)}`
          : "V<sub>LRP</sub>+W<sub>bucket</sub>＞V<sub>ult</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>",
    },
  };
}

function calc3(data) {
  const { Hlrp, D, h, sum, k, gama, gamam } = data;
  const s$um = sum / gama;
  const k$ = k / gamam;
  const Hside = D * h * ((gama * h) / 2 + 2 * s$um + k$ * h);
  const Hbase = ((Math.PI * D * D) / 4) * (s$um + k$ * h);
  const Hult = Hbase + Hside;

  return {
    resultTitle: [
      "裙边抗力H<sub>side</sub>",
      "基底抗力H<sub>base</sub>",
      "水平向极限承载力H<sub>ult</sub>",
    ],
    result: {
      Hside,
      Hbase,
      Hult,
    },
    status: {
      isFinish: true,
      message:
        Hlrp < Hult
          ? `H<sub>LRP</sub>＜H<sub>ult</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=H<sub>ult</sub>/H<sub>LRP</sub>=${(
              Hult / Hlrp
            ).toFixed(2)}`
          : "H<sub>LRP</sub>＞H<sub>ult</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>",
    },
  };
}

function calc4(data) {
  let { Vlrp, Hlrp, D, h, fai, gama, K, deta, Wbucket, gamam } = data;

  const fai$ = (fai * Math.PI) / 180;
  deta = (deta * Math.PI) / 180;
  const fai$$ = Math.atan(Math.tan(fai$) / gamam);
  const deta$ = Math.atan(Math.tan(deta) / gamam);
  const Vside = ((Math.PI * D * gama * h * h) / 2) * K * Math.tan(deta$);
  const V$base =
    Vlrp +
    Wbucket +
    (Math.PI * D * D * h * gama) / 4 -
    ((Math.PI * D * gama * h * h) / 2) * K * Math.tan(deta$);
  const Hbase = V$base * Math.tan(fai$$);
  const Kp = (1 + Math.sin(fai$$)) / (1 - Math.sin(fai$$));
  const Ka = 1 / Kp;
  const Hside = ((gama * h * h * D) / 2) * (Kp - Ka);
  const Hult = Hbase + Hside;

  return {
    resultTitle: [
      "裙边抗力<sub>Hside</sub>",
      "基底抗力<sub>Hbase</sub>",
      "水平向极限承载力<sub>Hult</sub>",
    ],
    result: {
      Hside,
      Hbase,
      Hult,
    },
    status: {
      isFinish: true,
      message:
        Hlrp < Hult
          ? `H<sub>LRP</sub>＜H<sub>ult</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=H<sub>ult</sub>/H<sub>LRP</sub>=${(
              Hult / Hlrp
            ).toFixed(2)}`
          : "H<sub>LRP</sub>＞H<sub>ult</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>",
    },
  };
}

function calc5(data) {
  const {
    Vlrp,
    D,
    h,
    sum,
    k,
    gama,
    alpha,
    Wbucket,
    hw,
    pvoid,
    pa,
    gamaw,
    gamam,
  } = data;

  if (pvoid < 0 || pvoid > pa + gamaw * hw) {
    return {
      status: {
        isFinish: false,
        message:
          "pvoid取值<b style='color: #dc143c'>不合理</b>，应在0~p<sub>a</sub>+γ<sub>w</sub>h<sub>w</sub>",
      },
    };
  }

  const s$um = sum / gamam;
  const k$ = k / gamam;
  const Vult_t_base =
    ((Math.PI * D * D) / 4) * gama * h +
    Wbucket +
    ((Math.PI * D * D) / 4) * (pa + gamaw * hw - pvoid) +
    alpha * Math.PI * D * h * (s$um + (k$ * h) / 2);
  const Vult_t_lid =
    Wbucket +
    ((Math.PI * D * D) / 4) * (pa + gamaw * hw - pvoid) +
    2 * alpha * Math.PI * D * h * (s$um + (k$ * h) / 2);
  const Vult_t_slow = Wbucket + 2 * Math.PI * h * alpha * (s$um + (k$ * h) / 2);
  return {
    resultTitle: [
      "裂缝出现在基础底部下方的抗拔极限承载力V<sub>ult,t,base</sub>",
      "裂缝出现在基础顶盖下方的抗拔极限承载力V<sub>ult,t,lid</sub>",
      "长期荷载工况的抗拔极限承载力V<sub>ult,t,slow</sub>",
    ],
    result: {
      Vult_t_base,
      Vult_t_lid,
      Vult_t_slow,
    },
    status: {
      isFinish: true,
      message: `当裂缝出现在基础底部下方时，${
        Vlrp < Vult_t_base
          ? `V<sub>LRP</sub>＜V<sub>ult,t,base</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=V<sub>ult,t,base</sub>/V<sub>LRP</sub>=${(
              Vult_t_base / Vlrp
            ).toFixed(2)}`
          : "V<sub>LRP</sub>＞V<sub>ult,t_,base</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>"
      }
      <br>
      当裂缝出现在基础顶盖下方时，${
        Vlrp < Vult_t_lid
          ? `V<sub>LRP</sub>＜V<sub>ult,t,lid</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=V<sub>ult,t,lid</sub>/V<sub>LRP</sub>=${(
              Vult_t_lid / Vlrp
            ).toFixed(2)}`
          : "V<sub>LRP</sub>＞V<sub>ult,t_,lid</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>"
      }
      <br>
      基础承受长期上拔荷载时，${
        Vlrp < Vult_t_slow
          ? `V<sub>LRP</sub>＜V<sub>ult,t,slow</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=V<sub>ult,t,slow</sub>/V<sub>LRP</sub>=${(
              Vult_t_slow / Vlrp
            ).toFixed(2)}`
          : "V<sub>LRP</sub>＞V<sub>ult,t_,slow</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>"
      }`,
    },
  };
}

function calc6(data) {
  let {
    Vlrp,
    D,
    h,
    gama,
    gama$,
    K,
    deta,
    Wbucket,
    hw,
    pvoidBase,
    pvoidLid,
    pa,
    gamaw,
    gamam,
  } = data;

  if (
    pvoidBase < 0 ||
    pvoidBase > pa + gamaw * hw + gamaw * h ||
    pvoidLid < 0 ||
    pvoidLid > pa + gamaw * hw
  ) {
    return {
      status: {
        isFinish: false,
        message:
          "p<sub>void</sub>取值<b style='color: #dc143c'>不合理</b>，p<sub>void,base</sub>应在0~p<sub>a</sub>+γ<sub>w</sub>h<sub>w</sub>+γ<sub>w</sub>h；p<sub>void,lid</sub>应在0~p<sub>a</sub>+γ<sub>w</sub>h<sub>w</sub>",
      },
    };
  }
  deta = (deta * Math.PI) / 180;

  const deta$ = Math.atan(Math.tan(deta) / gamam);
  const Vult_t_base =
    ((Math.PI * D * D) / 4) * gama * h +
    Wbucket +
    ((Math.PI * D * D) / 4) * (pa + gamaw * hw - pvoidBase) +
    ((Math.PI * D * gama$ * Math.pow(h, 2)) / 2) * K * Math.tan(deta$);
  const Vult_t_lid =
    Wbucket +
    ((Math.PI * D * D) / 4) * (pa + gamaw * hw - pvoidLid) +
    ((2 * Math.PI * D * gama$ * h * h) / 2) * K * Math.tan(deta$);
  const Vult_t_slow =
    Wbucket + ((2 * Math.PI * D * gama$ * h * h) / 2) * K * Math.tan(deta$);

  return {
    resultTitle: [
      "裂缝出现在基础底部下方的抗拔极限承载力V<sub>ult,t,base</sub>",
      "裂缝出现在基础顶盖下方的抗拔极限承载力V<sub>ult,t,lid</sub>",
      "长期荷载工况的抗拔极限承载力V<sub>ult,t,slow</sub>",
    ],
    result: {
      Vult_t_base,
      Vult_t_lid,
      Vult_t_slow,
    },
    status: {
      isFinish: true,
      message: `当裂缝出现在基础底部下方时，${
        Vlrp < Vult_t_base
          ? `V<sub>LRP</sub>＜V<sub>ult,t,base</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=V<sub>ult,t,base</sub>/V<sub>LRP</sub>=${(
              Vult_t_base / Vlrp
            ).toFixed(2)}`
          : "V<sub>LRP</sub>＞V<sub>ult,t_,base</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>"
      }
      <br>
      当裂缝出现在基础顶盖下方时，${
        Vlrp < Vult_t_lid
          ? `V<sub>LRP</sub>＜V<sub>ult,t,lid</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=V<sub>ult,t,lid</sub>/V<sub>LRP</sub>=${(
              Vult_t_lid / Vlrp
            ).toFixed(2)}`
          : "V<sub>LRP</sub>＞V<sub>ult,t_,lid</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>"
      }
      <br>
      基础承受长期上拔荷载时，${
        Vlrp < Vult_t_slow
          ? `V<sub>LRP</sub>＜V<sub>ult,t,slow</sub>，<b style='color: #dc143c'>设计满足规范要求</b>，f<sub>s</sub>=V<sub>ult,t,slow</sub>/V<sub>LRP</sub>=${(
              Vult_t_slow / Vlrp
            ).toFixed(2)}`
          : "V<sub>LRP</sub>＞V<sub>ult,t_,slow</sub>，<b style='color: #dc143c'>设计不满足规范要求</b>"
      }`,
    },
  };
}

const calcMap = {
  "submenu-1-item-1": calc1,
  "submenu-1-item-2": calc2,
  "submenu-2-item-1": calc3,
  "submenu-2-item-2": calc4,
  "submenu-3-item-1": calc5,
  "submenu-3-item-2": calc6,
};

export const bucketCalc = (id, data) => {
  const calcFn = calcMap[id];
  const res = calcFn(data);
  if (res.status.isFinish) {
    const { result } = res;
    if (Object.values(result).some((v) => !v)) {
      res.status.isFinish = false;
      res.status.message =
        "<b style='color: #dc143c'>存在参数取值错误或越界</b>";
    }
  }
  return res;
};
