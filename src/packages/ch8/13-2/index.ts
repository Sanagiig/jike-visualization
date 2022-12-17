import {loadImage, getImageData, traverse, getPixel} from "@/lib/pixels/util";
import {
  transformColor,
  brightness,
  saturate,
} from "@/lib/pixels/color-matrix";
import pic from "@/assets/girl1.jpg"
import sunPic from "@/assets/sunlight.png"

const canvas = document.getElementById("paper") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;
const img = await loadImage(pic);
const sunlight = await loadImage(sunPic);
const imageData = getImageData(img);
const texture = getImageData(sunlight);

traverse(imageData, ({r, g, b, a, index}) => {
  const texColor = getPixel(texture, index);
  return transformColor(
    [r, g, b, a],
    brightness(1 + 0.7 * texColor[3]),
    saturate(1),
  );
});

canvas.width = imageData.width;
canvas.height = imageData.height;
context.putImageData(imageData, 0, 0);