var originalimage = null;
var grayscaleimage = null;

function upload() {
  //Get input from file input
  var fileinput = document.getElementById("finput");
  //Make new SimpleImage from file input
  originalimage = new SimpleImage(fileinput);
  grayscaleimage = new SimpleImage(fileinput);
  //Get canvas
  var canvas = document.getElementById("can1");
  //Draw image on canvas
  originalimage.drawTo(canvas);
}

function makeGray() {
  //change all pixels of image to gray
  for (var pixel of grayscaleimage.values()) {
    var avg = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
  //display new image
  var canvas = document.getElementById("can2");
  grayscaleimage.drawTo(canvas);
}