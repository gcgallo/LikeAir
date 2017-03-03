var dim;
var pulse = .3;
var iflag = 1;
var cops;
var pulsar;
var i = 0;
var img;
var offsetX = 0;
var offsetY = 0;
var easing = 0.005;


function setup() {
  createCanvas(710, 400);
  dim = width/2;
  //background(0);
  noStroke();
  //noCursor();
  ellipseMode(RADIUS);
  //frameRate(10);
  img = loadImage('pulsar.png');
  cops = createVideo('cops.mp4');
  cops.loop(); // set the video to loop and start playing
  cops.hide(); // by default video shows up in separate dom
                  // element. hide it and draw it to the canvas
                  // instead
}

 function draw() {
      
      if(i == -1)
        i=2;

      if(i == 0){
        background(0);
        pulsar(dim, height/2);
        
      }
      if(i == 1){
        background(255);
        justbreath(dim, height/2, .01, 0, 0, -1);
        
      }
      if(i == 2){
        background(255);
        arrest(dim, height/2);

      }
      if(i >=3)
        i=0;
 }

 function keyPressed() {

     if(keyCode == RIGHT_ARROW){
        i++;
     }
     else if(keyCode == LEFT_ARROW)
        i--;

    }
