function webGlStart() {
    var canvas = document.querySelector("lesson01-canvas");
    initGL(canvas);
    initShaders(); //初始化模型
    initBuffers(); //初始化数组对象

    gl.clearColor(0.0, 0.0, 0.0, 1.0);//清空canvas,颜色设为黑色
    gl.enable(gl.DEPTH_TEST);//启用深度检测

    drawScene();//绘制
}

var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;

function initBuffers() {
    //三角形的数组对象
    triangleVertexPositionBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,triangleVertexPositionBuffer);
    //定义顶点位置信息，等腰三角形
    var vertices=[
        0.0,1.0,0.0,
        -1.0,-1.0,0.0,
        1.0,-1.0,0.0
    ];
    //创建了一个基于Javascript列表的Float32Array对象,作用就是可以把Javascript列表转换成可以传递给WebGL的形式以便填充到当前数组对象中
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize=3;
    triangleVertexPositionBuffer.numItems=3;

    squareVertexPositionBuffer=gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,squareVertexPositionBuffer);
    vertices=[
        1.0,1.0,0.0,
        -1.0,1.0,0.0,
        1.0,-1.0,0.0,
        -1.0,-1.0,0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize=3;
    squareVertexPositionBuffer.numItems=4;
}

//mvMatrix的变量来储存模型视图矩阵，pMatrix的变量来储存投影矩阵
var pMatrix;
var mvMatrix;

function drawScene(){
    //尺寸信息
    gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    //建立一个用于观测场景的透视图,（垂直）视野是45°、canvas的宽高比以及从我们的视点看到的最近距离是0.1个单位，最远距离是100个单位
    pMatrix=okMat4Proj(45,gl.viewportWidth/gl.viewportHeight,0.1,100.0);

    //在场景左边绘制三角形
    mvMatrix=okMat4Trans(-1.5,0.0,-7.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}

var gl;
function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

var shaderProgram;
 
function initShaders() {
    //片元着色器
    var fragmentShader = getShader(gl, "shader-fs");
    //顶点着色器
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

 function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix.toArray());
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix.toArray());
}