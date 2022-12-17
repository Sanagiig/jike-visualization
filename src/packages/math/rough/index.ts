import rough from "roughjs"

const canvas = document.querySelector('canvas')!
const rc = rough.canvas(canvas);
const ctx = canvas.getContext("2d")!;
ctx.translate(400, 800);
ctx.scale(1, -1)
const hillOpts = {roughness: 2.8, strokeWidth: 2, fill: 'blue'};
rc.path('M-300 0 L-100 256 L50 0', hillOpts);
rc.path('M300 0 L100 256 L-50 0', hillOpts);
rc.circle(0, 300, 105, {
  stroke: 'red',
  strokeWidth: 4,
  fill: 'rgba(255, 255, 0, 0.4)',
  fillStyle: 'solid',
});

export {}