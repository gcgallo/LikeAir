function justbreath(x, y) {
  var radius = dim/2;
  var v = 0;
  background(0);
  colorMode(HSB, 360, 100, 100, 1);

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
    pulse+= .01;
  }else{
    pulse-=.01;
  }

  if(pulse <= .1){
    iflag = 1;
  }
  if(pulse >= .4){
    iflag = 0;
  }
  
}


