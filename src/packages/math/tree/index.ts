import {Vector2} from "@/lib/vector2.js";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const height = canvas.height;
ctx.translate(0, height);
ctx.scale(1, -1);
ctx.lineCap = "round";

function drawBranch(
  ctx: CanvasRenderingContext2D,
  v0: Vector2,
  length: number,
  thickness: number,
  dir: number,
  bias: number,
) {
  if (thickness > 2) {
    const v = new Vector2().rotate(dir).scale(length);
    const v1 = v.copy().add(v0);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(...v0.dump());
    ctx.lineTo(...v1.dump());
    ctx.lineWidth = thickness;
    ctx.stroke();
    ctx.restore();

    if (thickness < 5 && Math.random() < 0.3) {
      ctx.save();
      ctx.strokeStyle = "red";
      const th = Math.random() * 6 + 3;
      ctx.lineWidth = th;
      ctx.beginPath();
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v1.x, v1.y - 2);
      ctx.stroke();
      ctx.restore();
    }

    drawBranch(
      ctx,
      v1,
      length,
      thickness * 0.8,
      dir + bias ,
      Math.random() / 2,
    );
    drawBranch(
      ctx,
      v1,
      length,
      thickness * 0.8,
      dir - bias ,
      Math.random() / 2,
    );
  }
}

const v = new Vector2(canvas.width / 2, 50);
drawBranch(ctx, v, 40, 15, Math.PI / 2 , 0.5);
