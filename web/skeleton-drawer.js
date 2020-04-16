const Http = new XMLHttpRequest();
const url='https://jsonplaceholder.typicode.com/posts';
let data = {}
let skeleton;
let arr
let currIndex = 0
let length 
let interval
let isPlaying = false
let intervalSpeed = 4
let e
// Put any asynchronous data loading in preload to complete before "setup" is run
function preload() {
    data = loadJSON('/test.json');
}
p5.disableFriendlyErrors = true; // disables FES
function setup() {
    frameRate(60);
    textSize(15);
    speed = createSlider(1 / 500, 1 / 50, 1 / 100, 1 / 1000);
    createP();

    createCanvas(windowWidth, windowHeight - 226, WEBGL);
    strokeWeight(4);
    skeleton = new OscHandler();
    dom = height * 0.04;
    angle = 0;
    cylinderRadius = 1;
    ballsRadius = 4;
    offset = 0;
    makeDoms();
    
    // JSON DATA
    arr = Object.keys(data)
    length = arr.length
}

function draw() {
    let fps = frameRate();
    // console.log(fps)
    background(0);
    // console.log(speed)
    val = speed.value();
    // Lighting
    ambientLight(166);
    directionalLight(255, 255, 255, 1, 1, -1);

    // Transformation
    orbitControl();
    rotateY(angle);
    if (rotating.checked()) {
        angle += rotateSpeed.value();
    }

    // Drawing
    drawSlimAxises();
    drawCompass();
    drawVolume();
    var joints = skeleton.state;
    for (var j in joints) {
        if (!joints.hasOwnProperty(j)) continue;
        var obj = joints[j];
        drawVector(obj, '#f37329');
    }
    if(skeleton.isPlaying) {
        skeleton.mapMessage(data[currIndex], true)
    }
}

function startInterval() {
    interval = setInterval(addData, 8)
}
function addData() {
    if(currIndex + 1 < length) {
        currIndex++
    } else {
        skeleton.setIsPlaying(false)
        clearInterval(interval)
    }
}

function drawVolume() {
    push();
    // Shading
    stroke(220);
    strokeWeight(2);
    ambientMaterial(220, 220, 220, 16);
    // Rainbow ball
    normalMaterial();
    sphere(ballsRadius*1.1);
    pop();
  }
function makeDoms() {
    // Auto rotate
    rotateSpeed = createSlider(1 / 500, 1 / 50, 1 / 100, 1 / 1000);
    rotating = createCheckbox('Auto rotate', false);
    rotating.style('font-family: courier;');
    createP();
}
  
  function doubleClicked() {
    rotating.checked(!rotating.checked());
  }
  
  
  function drawAxises() {
    push();
    noStroke();
  
    // X-axis
    push();
    rotateZ(HALF_PI);
    ambientMaterial(220, 220, 220);
    cylinder(cylinderRadius, dom * 24);
    translate(0, -dom*12, 0);
    cone(cylinderRadius*3, -cylinderRadius*9);
    translate(0, dom*24, 0);
    cone(cylinderRadius*3, cylinderRadius*9);
    pop();
  
    // Y-axis (green)
    push();
    ambientMaterial(220, 220, 220);
    cylinder(cylinderRadius, dom * 24);
    translate(0, -dom*12, 0);
    cone(cylinderRadius*3, -cylinderRadius*9);
    translate(0, dom*24, 0);
    cone(cylinderRadius*3, cylinderRadius*9);
    pop();
  
    // Z-axis (blue)
    push();
    rotateX(HALF_PI);
    ambientMaterial(220, 220, 220);
    cylinder(cylinderRadius, dom * 24);
    translate(0, -dom*12, 0);
    cone(cylinderRadius*3, -cylinderRadius*9);
    translate(0, dom*24, 0);
    cone(cylinderRadius*3, cylinderRadius*9);
    pop();
  
    pop();
  }
  
  function drawSlimAxises() {
    push();
    stroke('#c6262e');
    beginShape();
    vertex(dom*12, 0, 0);
    vertex(-dom*12, 0, 0);
    endShape();
    stroke('#68b723');
    beginShape();
    vertex(0, dom*12, 0);
    vertex(0, -dom*12, 0);
    endShape();
    stroke('#3689e6');
    beginShape();
    vertex(0, 0, dom*12);
    vertex(0, 0, -dom*12);
    endShape();
    pop();
  }
  
  function drawCompass() {
    push();
    noStroke();
    translate(-200, -200, 0);
  
    // X-axis (red)
    push();
    rotateZ(HALF_PI);
    translate(0, -dom, 0);
    ambientMaterial('#c6262e');
    cylinder(cylinderRadius, dom*2);
    translate(0, -dom, 0);
    cone(cylinderRadius*2, -cylinderRadius*6);
    pop();
  
    // Y-axis (green)
    push();
    translate(0, -dom, 0);
    ambientMaterial('#68b723');
    cylinder(cylinderRadius, dom*2);
    translate(0, -dom, 0);
    cone(cylinderRadius*2, -cylinderRadius*6);
    pop();
  
    // Z-axis (blue)
    push();
    rotateX(HALF_PI);
    translate(0, +dom, 0);
    ambientMaterial('#3689e6');
    cylinder(cylinderRadius, dom*2);
    translate(0, dom, 0);
    cone(cylinderRadius*2, cylinderRadius*6);
    pop();
  
    pop();
  }
  
  function drawVector(v, c) {
    push();
    // Stroke
    stroke(c);
    // beginShape(a);
    vertex(0, 0, 0);
    vertex(v.x*100, -v.y*100, v.z*100);
    endShape();
  
    // Sphere
    noStroke();
    translate(v.x*100, -v.y*100, v.z*100);
    // ambientMaterial(c);
    sphere(ballsRadius);
    pop();
  }
  
class OscHandler {
    constructor() {
        this.oscPort = new osc.WebSocketPort({
            url: "ws://localhost:8081",
        });

        this.state = {};
        this.isPlaying = false;
        this.jsonObj = {};
        this.listen();
        this.oscPort.open();

        this.oscPort.socket.onmessage = function (e) {
            console.log("message", e);
        };
    }

    setIsPlaying(bool) {
        this.isPlaying = bool;
        $(".button_start").css('color','green');
    }
  
    listen() {
        var that = this;
        $(".button_start").click(function () {
            if(!that.isPlaying) {
                startInterval();
                currIndex = 0
                $(this).css('color','red');
            } else {
                clearInterval(interval)
                $(this).css('color','green');
            }
            that.isPlaying = !that.isPlaying
        });
        $(".button_save").click(function () {
            console.log('Saved JSON: ', that.jsonObj)
            saveJSON(that.jsonObj, 'test.json');
        });
        $(".button_record").click(function () {
            $(this).css('color', that.isRecording ? 'green': 'red');
            that.isRecording = !that.isRecording
        });


        this.oscPort.on("message", this.mapMessage.bind(this));
        // this.oscPort.on("close", this.pause.bind(this));
    };
    mapMessage(oscMessage, isPlayback) {
        // var message = fluid.prettyPrintJSON(oscMessage)
        // $("#message").text(message);
        if(oscMessage.address) {
            var split = oscMessage.address.split("/");
            var jointName = split[2];
            var newPosition = { 
                x: oscMessage.args[0],
                y: oscMessage.args[1],
                z: oscMessage.args[2]
            }
            if(this.isRecording) {
                this.jsonObj[Object.keys(this.jsonObj).length] = oscMessage;
            }
            if(isPlayback && this.isPlaying) {
                // console.log(this.oscPort)
                // console.log("Sending message", oscMessage.address, oscMessage.args, "to", this.oscPort.options.remoteAddress + ":" + this.oscPort.options.remotePort);
                this.oscPort.send(oscMessage);
            }
            this.state[jointName] = newPosition;

        }
    };
}
