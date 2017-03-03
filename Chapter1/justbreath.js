function justbreath(x, y, pace, h, s, vsig) {
  var radius = dim/2;

  var v;
  if(vsig == -1)
    v = 100;
  else
    v = 0;

  colorMode(HSB, 360, 100, 100, 1);

  for (var r = radius; r > 0; --r) {
    fill(h, s, v);
    ellipse(x, y, r, r);
    v = (v + vsig*pulse) % 100;
  }

  //non-swinging pulse
  /*pulse+=.1
  if (pulse == .5){
    pulse = .1;
  }*/

  //Swinging pulse counter
  if(iflag == 1){
    pulse+= pace;
  }else{
    pulse-= pace;
  }

  if(pulse <= .1){
    iflag = 1;
  }
  if(pulse >= .3){
    iflag = 0;
  }
  
}


