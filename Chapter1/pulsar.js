function pulsar(x, y) {

  justbreath(x, y);

  colorMode(RGB);

  var dx = (mouseX-img.width/2) - offsetX;
  var dy = (mouseY-img.height/2) - offsetY;
  offsetX += dx * easing;
  offsetY += dy * easing;

  tint(255, 127);  // Display at half opacity
  image(img, offsetX, offsetY);

}

