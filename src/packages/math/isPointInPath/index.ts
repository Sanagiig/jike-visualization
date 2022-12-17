import {Vector2, Point} from "@/lib/vector2";
import Irregular from "@/lib/shaps/Irregular";

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext("2d")!
const points = [[-0.7, 0.5], [-0.4, 0.3], [-0.25, 0.71], [-0.1, 0.56], [-0.1, 0.13], [0.4, 0.21], [0, -0.6], [-0.3, -0.3], [-0.6, -0.3], [-0.45, 0.0], [-0.7, 0.5]
].map(p => new Point(p[0] * 100, p[1] * 100 + 100))

const irregular = new Irregular(0, 200)
irregular.setPoints(points)

ctx.translate(400, 800)
ctx.scale(1, -1)

function drawRegular(vecs: Vector2[]) {
  ctx.save();
  ctx.beginPath()
  vecs.forEach(v => {
    ctx.lineTo(v.x, v.y)
  })
  ctx.closePath()
  ctx.stroke();
  ctx.fill()
  ctx.restore();
}

function render({fillStyle}: any) {
  const vertices = [[-0.7, 0.5], [-0.4, 0.3], [-0.25, 0.71], [-0.1, 0.56], [-0.1, 0.13], [0.4, 0.21], [0, -0.6], [-0.3, -0.3], [-0.6, -0.3], [-0.45, 0.0],
  ].map(p => new Vector2(p[0] * 100, p[1] * 100 + 100))
  ctx.save();
  ctx.rect(-400, 0, 800, 800);
  ctx.fillStyle = "white";
  ctx.fill();

  ctx.fillStyle = fillStyle
  drawRegular(vertices);
  ctx.stroke();
  ctx.restore();
}

function render2(x: number, y: number) {
  irregular.styleOptions.fillStyle = irregular.isInPath(x, y) ? "green" : "red";
  irregular.draw(ctx)
}


const {left, top} = canvas.getBoundingClientRect();


// canvas.addEventListener('mousemove', (evt) => {
//   const {x, y} = evt;
//   // 坐标转换
//   const offsetX = x - left;
//   const offsetY = y - top;
//
//   ctx.clearRect(-256, -256, 512, 512);
//
//   if (ctx.isPointInPath(offsetX, offsetY)) {
//     render({fillStyle: "red"});
//   } else {
//     render({fillStyle: "green"});
//   }
// });

canvas.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  // 坐标转换
  const offsetX = x - 400;
  const offsetY = 800 - y;


  render2(offsetX, offsetY);
});


// render({fillStyle: "black"})