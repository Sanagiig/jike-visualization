import {loadImage, getImageData, traverse} from "../../../lib/pixels/util";

const canvas = document.getElementById("paper") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;
import pic1 from "@/assets/girl1.jpg"
console.log("pic1",pic1)
const img = await loadImage(pic1);
const imageData = getImageData(img);
traverse(imageData, ({r, g, b, a, x, y}) => {
  const d = Math.hypot(x - 0.5, y - 0.5);
  a *= 1.0 - 2 * d;
  return [r, g, b, a];
});
canvas.width = imageData.width;
canvas.height = imageData.height;
context.putImageData(imageData, 0, 0);