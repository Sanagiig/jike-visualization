const canvas = document.querySelector('canvas')!;
const gl = canvas.getContext('webgl')! as WebGL2RenderingContext;
let triangles: UniformData[] = [];
const vertexSource = `
attribute vec2 position;

uniform float u_rotation;
uniform float u_time;
uniform float u_duration;
uniform float u_scale;
uniform vec2 u_dir;

varying float vP;

void main() {
  float p = min(1.0, u_time / u_duration);
  float rad = u_rotation + 3.14 * 10.0 * p;
  float scale = u_scale * p * (2.0 - p);
  vec2 offset = 2.0 * u_dir * p * p;
  mat3 translateMatrix = mat3(
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    offset.x, offset.y, 1.0
  );
  mat3 rotateMatrix = mat3(
    cos(rad), sin(rad), 0.0,
    -sin(rad), cos(rad), 0.0,
    0.0, 0.0, 1.0
  );
  mat3 scaleMatrix = mat3(
    scale, 0.0, 0.0,
    0.0, scale, 0.0,
    0.0, 0.0, 1.0
  );
  gl_PointSize = 1.0;
  vec3 pos = translateMatrix * scaleMatrix * rotateMatrix * vec3(position, 1.0);
  gl_Position = vec4(pos, 1.0);
  vP = p;
}`

const fragmentSource = `
precision mediump float;
  
  uniform vec4 u_color;
  varying float vP;
  void main()
  {
    gl_FragColor.xyz = u_color.xyz;
    gl_FragColor.a = (1.0 - vP) * u_color.a;
  }    
`;
const program = createWebGLProgram(gl, vertexSource, fragmentSource)!;
const position = new Float32Array([
  -1, -1,
  0, 1,
  1, -1,
]);

function createWebGLProgram(gl: WebGL2RenderingContext, vSource: string, fSource: string) {
  const vShader = gl.createShader(gl.VERTEX_SHADER)!;
  const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  const program = gl.createProgram()!;
  let err: string | null;

  function throwErr() {
    throw new Error(err!.toString())
  }

  gl.shaderSource(vShader, vSource)
  gl.shaderSource(fShader, fSource)
  gl.compileShader(vShader)
  gl.compileShader(fShader)

  if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
    err = gl.getShaderInfoLog(vShader);
    console.error("Failed to compile VShader:", err);
    throwErr()
  }

  if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
    err = gl.getShaderInfoLog(fShader);
    console.error("Failed to compile FShader:", err);
    throwErr()
  }

  gl.attachShader(program, vShader)
  gl.attachShader(program, fShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    err = gl.getProgramInfoLog(program);
    console.error("Failed to link program:", err);
    gl.deleteProgram(program);
    gl.deleteShader(vShader);
    gl.deleteShader(fShader);
    throwErr()
  }

  console.log("pro",program)
  gl.useProgram(program)
  return program
}

function enableVertext(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  varName: string,
  data: Float32Array,
  vertexSize = 2
) {
  const bufferId = gl.createBuffer();
  const vertextVar = gl.getAttribLocation(program, varName);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(vertextVar, vertexSize, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vertextVar)
}

function randomTriangles(): UniformData {
  const u_color: UniformData["u_color"] = [Math.random(), Math.random(), Math.random(), 1.0]; // 随机颜色
  const u_rotation = Math.random() * Math.PI; // 初始旋转角度
  const u_scale = Math.random() * 0.05 + 0.03; // 初始大小
  const u_time = 0;
  const u_duration = 3.0; // 持续3秒钟

  const rad = Math.random() * Math.PI * 2;
  const u_dir: UniformData["u_dir"] = [Math.cos(rad), Math.sin(rad)]; // 运动方向
  const startTime = performance.now();

  return {u_color, u_rotation, u_scale, u_time, u_duration, u_dir, startTime};
}

type UniformData = {
  u_color: [number, number, number, number],
  u_rotation: number,
  u_scale: number,
  u_time: number,
  u_duration: number,
  u_dir: [number, number]
  startTime: number
}

function setUniforms(gl: WebGL2RenderingContext, {
  u_color,
  u_rotation,
  u_scale,
  u_time,
  u_duration,
  u_dir
}: UniformData) {
  // gl.getUniformLocation 拿到uniform变量的指针
  let loc = gl.getUniformLocation(program, 'u_color');
  // 将数据传给 unfirom 变量的地址
  gl.uniform4fv(loc, u_color);

  loc = gl.getUniformLocation(program, 'u_rotation');
  gl.uniform1f(loc, u_rotation);

  loc = gl.getUniformLocation(program, 'u_scale');
  gl.uniform1f(loc, u_scale);

  loc = gl.getUniformLocation(program, 'u_time');
  gl.uniform1f(loc, u_time);

  loc = gl.getUniformLocation(program, 'u_duration');
  gl.uniform1f(loc, u_duration);

  loc = gl.getUniformLocation(program, 'u_dir');
  gl.uniform2fv(loc, u_dir);
}

enableVertext(gl, program, "position", position)

function update() {
  for (let i = 0; i < 5 * Math.random(); i++) {
    triangles.push(randomTriangles());
  }
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 对每个三角形重新设置u_time
  triangles.forEach((triangle) => {
    triangle.u_time = (performance.now() - triangle.startTime) / 1000;
    setUniforms(gl, triangle);
    gl.drawArrays(gl.TRIANGLES, 0, position.length / 2);
  });
  // 移除已经结束动画的三角形
  triangles = triangles.filter((triangle) => {
    return triangle.u_time <= triangle.u_duration;
  });
  requestAnimationFrame(update);
}


requestAnimationFrame(update);
export {}