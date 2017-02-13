var dim;
var pulse = .1;
var iflag = 1;


function setup() {
  createCanvas(710, 400);
  dim = width/2;
  background(0);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  ellipseMode(RADIUS);
  frameRate(10);
}

function draw() {
  background(0);
  
  drawGradient(dim, height/2);
}

function drawGradient(x, y) {
  var radius = dim/2;
  var v = 0;

  for (var r = radius; r > 0; --r) {
    fill(60, 55, v);
    ellipse(x, y, r, r);
    v = (v + 1*pulse) % 100;
  }

  //non-swinging pulse
  /*pulse+=.1
  if (pulse == .5){
    pulse = .1;
  }*/

  //Swinging pulse counter
  if(iflag == 1){
    pulse+= .1;
  }else{
    pulse-=.1;
  }

  if(pulse <= .1){
    iflag = 1;
  }
  if(pulse >= .5){
    iflag = 0;
  }
  
}


