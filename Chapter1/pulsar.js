function pulsar(x, y) {

  justbreath(x, y);

  colorMode(RGB);
  var x1 = 0 + random(-40,40);
  var y1 = 0 + random(-40,40);
  var dx = x1 - offsetX;
  var dy = y1 - offsetY;
  offsetX += dx * easing;
  offsetY += dy * easing;

  tint(255, 127);  // Display at half opacity
  image(img, offsetX, offsetY);

}

 