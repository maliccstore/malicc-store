"use client";
import { createStore, atom } from "jotai";

export const myStore = createStore();

const countAtom = atom(0);
export const themeColor = atom("light");
myStore.set(countAtom, 1);

const unsub = myStore.sub(countAtom, () => {
  console.log("countAtom value is changed to", myStore.get(countAtom));
});

export { unsub };
