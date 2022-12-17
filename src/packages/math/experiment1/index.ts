import {Point, Vector2} from "@/lib/vector2";

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext("2d")!


const p1 = new Point(10, 15)
const p2 = new Point(200, 150)
let p3 = new Point(0, 0)

ctx.translate(400, 800)
ctx.scale(1, -1)

function getVerticalPoint() {
  if (!p3.x && p3.y) {
    return
  }

  const v12 = Vector2.factory(p1, p2)
  const v13 = Vector2.factory(p1, p3)
  const dot = v12.dot(v13)
  const v12l = v12.getLength();
  const ratio = dot / v12l / v12l
  return dot / v12l >  v12l
    ? p2.clone()
    : dot < 0
      ? p1.clone()
      : new Point(p1.x + (p2.x - p1.x) * ratio, p1.y + (p2.y - p1.y) * ratio)
}

function render() {
  const p4 = getVerticalPoint()
  ctx.save();
  ctx.rect(-400, 0, 800, 800);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  if (p4) {
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
  }
  ctx.stroke();
  ctx.restore();
}

canvas.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  p3.x = x - 400;
  p3.y = 800 - y;
  render()
});

canvas.addEventListener("mouseleave", () => {
  p3.x = 0;
  p3.y = 0;
  render()
})
render()
export {}