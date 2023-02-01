import { Ref, nextTick } from "vue";

export async function resizeWin(calcAreaRef: Ref) {
  await nextTick();

  let scrollHeight = calcAreaRef.value.scrollHeight;
  console.log(scrollHeight);
  await (window as any).electronAPI.resizeWin(
    Math.max(Math.floor(scrollHeight * 1.25), 900),
    scrollHeight + 34 * 2
  );

  scrollHeight = calcAreaRef.value.scrollHeight;
  await (window as any).electronAPI.resizeWin(
    Math.max(Math.floor(scrollHeight * 1.25), 900),
    scrollHeight + 34 * 2
  );
}
