export const dataFormat = (
  title: string,
  refsData: any,
  categoryList: any,
  message?: string
) => {
  const current = categoryList.map((v: any) => v.replace(/<.+?>/g, ""));
  const temp = [
    ["类型", ...current],
    [title, ...Object.values(refsData)],
  ];
  if (message) {
    temp.push(["计算结果"], [message.replace(/<((?!br).)*?>/g, "")]);
  }
  return temp;
};
