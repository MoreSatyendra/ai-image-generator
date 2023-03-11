import FileSaver from "file-saver";
import { surpriseMePrompts } from "../constants";

export const getSurpriseMePrompt = (prompt) => {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];
  if (randomPrompt === prompt) {
    return getSurpriseMePrompt(prompt);
  }
  return randomPrompt;
};

export async function downloadImage(_id, photo) {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
}
