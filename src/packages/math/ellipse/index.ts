import {Vector2} from "@/lib/vector2";

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext("2d")!

ctx.translate(400, 800)
ctx.scale(1, -1)

const TAU_SEGMENTS = 60;
const TAU = Math.PI * 2;

function ellipse(
  x0: number,
  y0: number,
  radiusX: number,
  radiusY: number,
  startAng = 0,
  endAng = Math.PI * 2
) {
  const ang = Math.min(TAU, endAng - startAng);
  const ret = ang === TAU ? [] : [new Vector2(x0,y0)];
  const segments = Math.round(TAU_SEGMENTS * ang / TAU);
  for (let i = 0; i <= segments; i++) {
    const x = x0 + radiusX * Math.cos(startAng + ang * i / segments);
    const y = y0 + radiusY * Math.sin(startAng + ang * i / segments);
    ret.push(new Vector2(x, y));
  }
  return ret;
}



const LINE_SEGMENTS = 60;
function parabola(x0: number, y0: number, p: number, min: number, max: number) {
  const ret = [];
  for(let i = 0; i <= LINE_SEGMENTS; i++) {
    const s = i / 60;
    const t = min * (1 - s) + max * s;
    const x = x0 + 2 * p * t ** 2;
    const y = y0 + 2 * p * t;
    ret.push(new Vector2(x,y));
  }
  return ret;
}

function drawRegular(vecs: Vector2[]) {
  ctx.save();
  ctx.beginPath()
  vecs.forEach(v => {
    ctx.lineTo(v.x, v.y)
  })
  ctx.stroke();
  ctx.restore();
}

function render() {
  ctx.save();
  ctx.rect(-400, 0, 800, 800);
  ctx.fillStyle = "white";
  ctx.fill();
  drawRegular(ellipse(0, 100, 100, 50));
  drawRegular(parabola(0, 0, 5.5, -10, 10));
  ctx.stroke();
  ctx.restore();
}

render()
