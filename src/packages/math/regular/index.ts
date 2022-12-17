import {Point, Vector2} from "@/lib/vector2";

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext("2d")!
const points: Point[] = []

const pos = new Point(10, 15)

ctx.translate(400, 800)
ctx.scale(1, -1)


function genRegularData(edges = 3, x: number, y: number, step: number) {
  const ret = [];
  const delta = Math.PI * (1 - (edges - 2) / edges);
  let p = new Vector2(x, y);
  const dir = new Vector2(step, 0);
  ret.push(p);
  for (let i = 0; i < edges; i++) {
    p = p.copy().add(dir.rotate(delta));
    ret.push(p);
  }
  return ret;
}

function genRegularData2(edges = 3, x: number, y: number, step: number) {
  const ret = [];
  const delta = Math.PI * 2 / edges
  const pos = new Vector2(x, y)
  for (let i = 0; i < edges; i++) {
    let newP = new Vector2(1, 0).rotate(delta * i).scale(step).add(pos)
    ret.push(newP);
  }
  ret.push(ret[0]);
  return ret;
}

function drawRegular(vecs: Vector2[]) {
  ctx.save();
  ctx.beginPath()
  ctx.moveTo(vecs[0].x, vecs[0].y)
  vecs.forEach(v => {
    ctx.lineTo(v.x, v.y)
  })
  ctx.stroke();
  ctx.restore();
}

function render(edges) {
  const data = genRegularData(edges, 0, 200, 150)
  const data2 = genRegularData2(edges, 50, 100, 50)
  ctx.save();
  ctx.rect(-400, 0, 800, 800);
  ctx.fillStyle = "white";
  ctx.fill();
  drawRegular(data)
  drawRegular(data2)
  ctx.stroke();
  ctx.restore();
}

let edges = 3
let symbol = 1
render(edges)
setInterval(() => {
  const range = [3, 10]
  render(edges)
  edges += symbol
  if (edges > range[1] || edges <= range[0]) {
    symbol = -symbol;
  }
}, 500);
export {}