import {Vector2, Point} from "../vector2";

export class StrokeManager {
  protected xFunc: StrokeComputedFunc = (t) => t;
  protected yFunc: StrokeComputedFunc = (t) => t;
  points: Point[];

  constructor(
    protected ctx: CanvasRenderingContext2D,
    protected x: number = 0,
    protected y: number = 0,
    protected segments: number = 0,
  ) {
    this.points = new Array(segments);
  }

  begin(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  setCtx(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  setVarying(segments: number) {
    this.segments = segments;
    this.points = new Array(segments);
    return this;
  }

  setHelper(name: StrokeComputeHelperKeys, ...args: any[]) {
    const helper = (StrokeHelper[name] as StrokeHelperFactor)(...args);
    this.setHelperFunc(helper.xFunc, helper.yFunc);
    return this;
  }

  setHelperFunc(xFunc: StrokeComputedFunc, yFunc: StrokeComputedFunc) {
    this.xFunc = (t: number) => xFunc(t);
    this.yFunc = (t: number) => yFunc(t);
    return this;
  }

  generateLines() {
    const {segments, xFunc, yFunc} = this;
    const result = this.points;
    for (let i = 0; i <= segments; ++i) {
      const x = xFunc(i / segments);
      const y = yFunc(i / segments);
      result[i] = new Point(x, y);
    }
    return this;
  }

  draw() {
    let {ctx, points, x, y} = this;
    console.log("p", points);
    ctx.save();
    ctx.translate(0, ctx.canvas.height);
    ctx.scale(1, -1);
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineWidth = 5;
    ctx.moveTo(points[0].x + x, points[0].y + y);
    for (let i = 1; i < points.length; ++i) {
      ctx.lineTo(points[i].x + x, points[i].y + y);
    }
    // ctx.stroke();
    ctx.fill("evenodd");
    ctx.restore();

    return this;
  }
}

type PickKeys<T, P> = {[K in keyof T]: P extends T[K] ? K : never} extends {
  [K in string]: infer R;
}
  ? R
  : never;
type StrokeComputedFunc = (a: number, ...args: any[]) => number;
type StrokeHelperFactor = (...args: any[]) => {
  xFunc: StrokeComputedFunc;
  yFunc: StrokeComputedFunc;
};
export type StrokeComputeHelperKeys = PickKeys<
  typeof StrokeHelper,
  StrokeHelperFactor
>;

export const StrokeHelper = {
  rad(ang: number) {
    return (ang / 180) * Math.PI;
  },

  regularShape(start: number, end: number, len: number = 10) {
    const range = end - start;
    return {
      xFunc(t: number) {
        console.log("t", t * range);
        return len * Math.cos(t * range);
      },
      yFunc(t: number) {
        return len * Math.sin(t * range);
      },
    };
  },
  ellipse(start: number, end: number, xRadius: number, yRadius: number) {
    const range = end - start;
    return {
      xFunc(t: number) {
        return xRadius * Math.cos(t * range);
      },
      yFunc(t: number) {
        return yRadius * Math.sin(t * range);
      },
    };
  },
  parabola(
    min: number,
    max: number,
    p: number,
    direction: "up" | "down" | "left" | "right",
  ) {
    return {
      xFunc(t: number) {
        const tt = (1 - t) * min + t * max;
        switch (direction) {
          case "up":
            return 2 * p * tt;
          case "down":
            return 2 * p * tt;
          case "left":
            return -2 * p * tt ** 2;
          case "right":
            return 2 * p * tt ** 2;
          default:
            return 0;
        }
      },
      yFunc(t: number) {
        const tt = (1 - t) * min + t * max;
        switch (direction) {
          case "up":
            return 2 * p * tt ** 2;
          case "down":
            return -2 * p * tt ** 2;
          case "left":
            return -2 * p * tt;
          case "right":
            return -2 * p * tt;
          default:
            return 0;
        }
      },
    };
  },
  spiral(start: number, end: number, len: number) {
    const range = end - start;

    return {
      xFunc(t: number) {
        return t * len * Math.cos(t * range);
      },
      yFunc(t: number) {
        return t * len * Math.sin(t * range);
      },
    };
  },
  star(len: number, weight: number = 3) {
    weight += weight % 3;
    return {
      xFunc(t: number) {
        const c = Math.cos(t * 2 * Math.PI);
        return len * c ** weight;
      },
      yFunc(t: number) {
        const s = Math.sin(t * 2 * Math.PI);
        return len * s ** weight;
      },
    };
  },
  quadricBezier(
    {x: x0, y: y0}: Point,
    {x: x1, y: y1}: Point,
    {x: x2, y: y2}: Point,
  ) {
    return {
      xFunc(t: number) {
        return (1 - t) ** 2 * x0 + 2 * t * (1 - t) * x1 + t ** 2 * x2;
      },
      yFunc(t: number) {
        return (1 - t) ** 2 * y0 + 2 * t * (1 - t) * y1 + t ** 2 * y2;
      },
    };
  },
  cubicBezier(
    {x: x0, y: y0}: Point,
    {x: x1, y: y1}: Point,
    {x: x2, y: y2}: Point,
    {x: x3, y: y3}: Point,
  ) {
    return {
      xFunc(t: number) {
        return (
          (1 - t) ** 3 * x0 +
          3 * t * (1 - t) ** 2 * x1 +
          3 * (1 - t) * t ** 2 * x2 +
          t ** 3 * x3
        );
      },
      yFunc(t: number) {
        return (
          (1 - t) ** 3 * y0 +
          3 * t * (1 - t) ** 2 * y1 +
          3 * (1 - t) * t ** 2 * y2 +
          t ** 3 * y3
        );
      },
    };
  },
};

export function parabola(
  x0: number,
  y0: number,
  p: number,
  min: number,
  max: number,
  segments: number = 360,
) {
  const ret = [];
  for (let i = 0; i <= segments; i++) {
    const s = i / segments;
    const t = min * (1 - s) + max * s;
    const y = x0 + 2 * p * t ** 2;
    const x = y0 + 2 * p * t;
    ret.push(new Vector2(x, y));
  }
  return ret;
}

export function parametric(
  xFunc: (...args: any[]) => number,
  yFunc: (...args: any[]) => number,
) {
  return function (
    start: number,
    end: number,
    segments: number = 100,
    ...args: any[]
  ) {
    const result: Vector2[] = [];
    for (let i = 0; i <= segments; ++i) {
      const p = i / segments;
      const t = start * (1 - p) + end * p;
      const x = xFunc(t, ...args);
      const y = yFunc(t, ...args);

      result.push(new Vector2(x, y));
    }

    return result;
  };
}
