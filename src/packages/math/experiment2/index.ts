import {Point, Vector2} from "@/lib/vector2";

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext("2d")!
const points: Point[] = []

const pos = new Point(10, 15)

ctx.translate(400, 800)
ctx.scale(1, -1)

function beenScan(p: Point) {
  const posV = new Vector2(...pos).normalize()
  const v = new Vector2(...p).normalize()
  return Math.abs(posV.cross(v)) <= 0.5
}

function genScanner(globalRad: number) {
  const rad = Math.PI / 6;
  const vec1 = new Vector2(200, 0).rotate(rad).rotate(globalRad)
  const vec2 = new Vector2(200, 0).rotate(-rad).rotate(globalRad)

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(...vec1.dump());
  ctx.moveTo(0, 0);
  ctx.lineTo(...vec2.dump());
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function genPoint() {
  ctx.save();

  points.forEach(p => {
    ctx.beginPath()
    ctx.strokeStyle = beenScan(p) ? "green" : "red";
    ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
    ctx.stroke();
  })

  ctx.restore()
}

function render() {
  const rad = Math.atan2(pos.y, pos.x)
  ctx.save();
  ctx.rect(-400, 0, 800, 800);
  ctx.fillStyle = "white";
  ctx.fill();

  genScanner(rad)
  genPoint()
  ctx.stroke();
  ctx.restore();
}

function initPoints() {
  const vec = new Vector2(300, 0)
  const limit = 10;
  for (let i = 0; i < limit; i++) {
    let rad = Math.random() * Math.PI / 2 + 1
    vec.rotate(rad);
    points.push(new Point(...vec.dump()))
  }
}

canvas.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;
  pos.x = x - 400;
  pos.y = 800 - y;
  render()
});

canvas.addEventListener("mouseleave", () => {
  render()
})

initPoints()
render()
export {}