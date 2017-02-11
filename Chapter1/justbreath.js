var dim;
var pulse = 3;
var iflag = 1;


function setup() {
  createCanvas(710, 400);
  dim = width/2;
  background(255);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  ellipseMode(RADIUS);
  frameRate(10);
}

function draw() {
  background(60, 55, 100);
  drawGradient(dim, height/2);  
}

function drawGradient(x, y) {
  var radius = dim/2;
  var v = 100;
  //var pulse
  //for(var pulse = 5; pulse > 0; --pulse){
    for (var r = radius; r > 0; --r) {
      fill(60, 55, v);
      ellipse(x, y, r, r);
      v = (v - 1*pulse) % 100;
    }

  if(iflag = 1){
    --pulse;
  }else{
    ++pulse;
  }

  if(pulse == 0){
    iflag = 1;
  }
  if(pulse == 3){
    iflag = 0;
  }
  //}
}


