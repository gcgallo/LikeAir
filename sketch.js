var dim;
var pulse = .3;
var iflag = 1;
var cops;
var pulsar;
var i = 0;
var t = 0;
var img;
var offsetX = 0;
var offsetY = 0;
var easing = 0.005;
var a = 0;
var count;

function setup() {
  createCanvas(710, 600);
  count = createP('alpha'); 
  dim = width/2;
  //background(0);
  noStroke();
  //noCursor();
  ellipseMode(RADIUS);
  //frameRate(10);
  img = loadImage('media/pulsar.png');
  cops = createVideo('media/cops.mp4');
  cops.loop(); // set the video to loop and start playing
  cops.hide(); // by default video shows up in separate dom
                  // element. hide it and draw it to the canvas
                  // instead
}

 function draw() {
      //document.getElementById('canvas').style.opacity = .5;
      if(i == -1)
        i=3;

      if(i == 0){
        background(0);
        pulsar(dim, height/2);
        
      }
      if(i == .5){
          colorMode(RGB);
          fill(0,0,0,a); 
          rect( 0, 0, 710, 600);
          count.html(a);
	  if(t == 0)
              a++;
	  else
              a--;
	  if(a >= 255){
              t=1;
	  }
	  if(a == 0 && t == 1){
              i+=.5;
          }
      }    
      if(i == 1){
        background(255);
        justbreath(dim, height/2, .01, 0, 0, -1);
        
      }
      if(i == 2){
        background(255);
        arrest(dim, height/2);

      }
      if(i == 3){
        background(255);
        arrestII(dim, height/2);
      
      }
      if(i == 4)
        i=0;  
 }

 function keyPressed() {
     // colorMode(RGB);
     // a = 0;
     // for(j=0; j<=2550; j++){
     //    fill(0,0,0,a); 
     //    rect( 0, 0, 710, 600);
     //    count.html(a);
     // if (j%10 == 0)
     //     a++;
     // } 
     if(keyCode == RIGHT_ARROW){
        i+=.5;
     }
     else if(keyCode == LEFT_ARROW)
        i--;

    }

 function fadeTrans(){
   colorMode(RGB);
   for(j=0; j<=2550; j++){
     fill(0,0,0,a); 
     rect( 0, 0, width, height);
     if (j%10 == 0)
         a--;
   }
   // setTimeout(function () {    //  call a 3s setTimeout when the loop is called
   //     // alert('hello');          //  your code here
   //     fill(0,0,0,128); 
   //     rect( 0, 0, width, height);
   //     count.html(j);
   //     j++;                     //  increment the counter
   //     if (j < 10) {            //  if the counter < 10, call the loop function
   //         fadeTrans();             //  ..  again which will trigger another
   //     }                        //  ..  setTimeout()
   // }, 3000)
 }
 function stop(){
 }
