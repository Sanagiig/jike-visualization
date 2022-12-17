import {Vector2} from "@/lib/vector2";

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext("2d")!

ctx.translate(400, 800)
ctx.scale(1, -1)


const TAU_SEGMENTS = 60;
const TAU = Math.PI * 2;

function arc(x0: number, y0: number, radius: number, startAng = 0, endAng = Math.PI * 2) {
  const ang = Math.min(TAU, endAng - startAng);
  const ret = [];
  const segments = Math.round(TAU_SEGMENTS * ang / TAU);
  for (let i = 0; i <= segments; i++) {
    const x = x0 + radius * Math.cos(startAng + ang * i / segments);
    const y = y0 + radius * Math.sin(startAng + ang * i / segments);
    ret.push(new Vector2(x, y));
  }
  return ret;
}

function arc2(x0: number, y0: number, radius: number, startAng = 0, endAng = Math.PI * 2) {
  const ang = Math.min(TAU, endAng - startAng) / TAU_SEGMENTS;
  const pos = new Vector2(x0, y0);
  const ret: Vector2[] = [];
  for (let i = 0; i < TAU_SEGMENTS; i++) {
    let p = new Vector2(1, 0).rotate(i * ang + startAng).scale(radius).add(pos)
    ret.push(p)
  }

  ret.push(new Vector2(1, 0).rotate(endAng).scale(radius).add(pos))
  return ret
}

function drawRegular(vecs: Vector2[]) {
  ctx.save();
  ctx.beginPath()
  // ctx.moveTo(vecs[0].x, vecs[0].y)
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
  drawRegular(arc(0, 100, 100,0,2));
  drawRegular(arc2(0, 500, 100,0,2));
  ctx.stroke();
  ctx.restore();
}

render()