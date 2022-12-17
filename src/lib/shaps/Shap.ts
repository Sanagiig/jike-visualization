import {Point, Vector2} from "@/lib/vector2";

export default class Shap {
  public points: Point[] = []
  public styleOptions = {
    strokeStyle: "black",
    fillStyle: "",
  }

  constructor(public x = 0, public y = 0) {
  }

  setPoints(points: Point[], adjustByPos = true) {
    this.points = adjustByPos
      ? points.map(p => {
        return new Point(p.x + this.x, p.y + this.y)
      })
      : points.slice();
  }

  isInPath(x: number, y: number) {
    const {points} = this;
    const posV = new Vector2();
    let res: any = null;

    for (let i = 1; i < points.length; i++) {
      let preP = points[i - 1];
      let curP = points[i];
      let edgeV = preP.getVec(curP);
      let tmpRes;

      posV.reset(x - preP.x, y - preP.y);
      tmpRes = Math.sign(posV.cross(edgeV))
      if (res === null) {
        res = tmpRes
      } else if (res !== tmpRes) {
        console.log("x,y",i,x,y,points)
        return false
      }
    }

    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const {points, styleOptions} = this
    const {strokeStyle, fillStyle} = styleOptions
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    points.forEach((p) => {
      ctx.lineTo(p.x, p.y)
    })

    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.stroke()
    }
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill()
    }

    ctx.restore();
  }
}