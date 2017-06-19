function webGlStart() {
    var canvas = document.querySelector("lesson01-canvas");
    initGL(canvas);
    initShaders(); //初始化模型
    initBuffers(); //初始化数组对象

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}

function initBuffers() {
    var triangleVertexPositionBuffer;
    var squareVertexPositionBuffer;
}