function arrest(x, y) {

  justbreath(x, y);

  colorMode(RGB);

  //background(150);

  //image(cops,10,10); // draw the video frame to canvas
  
  //ellipse(200, 200, 100, 100);

  tint(255, 164);
  image(cops, 0, 0); // draw a second copy to canvas
  
  filter('DILATE');

  /*var dx = (mouseX-img.width/2) - offsetX;
  var dy = (mouseY-img.height/2) - offsetY;
  offsetX += dx * easing;
  offsetY += dy * easing;

  tint(255, 127);  // Display at half opacity
  image(img, offsetX, offsetY);*/

}

