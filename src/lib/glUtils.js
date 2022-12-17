function createTexture(gl, img) {
  // 创建纹理对象
  const texture = gl.createTexture();
  
  // 设置预处理函数，由于图片坐标系和WebGL坐标的Y轴是反的，这个设置可以将图片Y坐标翻转一下
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  
  // 激活指定纹理单元，WebGL有多个纹理单元，因此在Shader中可以使用多个纹理
  gl.activeTexture(gl.TEXTURE0);
  
  // 将纹理绑定到当前上下文
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // 指定纹理图像
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  
  // 设置纹理的一些参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // 解除纹理绑定
  gl.bindTexture(gl.TEXTURE_2D, null);
  
  return texture;
}

function setTexture(gl, idx) {
  // 激活纹理单元
  gl.activeTexture(gl.TEXTURE0 + idx);
  // 绑定纹理
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // 获取shader中纹理变量
  const loc = gl.getUniformLocation(program, 'tMap');
  // 将对应的纹理单元写入shader变量
  gl.uniform1i(loc, idx);
  // 解除纹理绑定
  gl.bindTexture(gl.TEXTURE_2D, null);
}