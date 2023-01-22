function change2Num(oldData) {
  const newData = {};
  for (let k in oldData) {
    newData[k] = Number(oldData[k]);
  }

  return newData;
}

export default change2Num;
