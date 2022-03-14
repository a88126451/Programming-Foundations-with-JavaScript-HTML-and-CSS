var fgImage = null;
var bgImage = null;
var fgCanvas;
var bgCanvas;

function loadForegroundImage() {
  var imgFile = document.getElementById("fgfile");
  fgImage = new SimpleImage(imgFile);
  fgCanvas = document.getElementById("can1");
  fgImage.drawTo(fgCanvas); 
}

function loadBackgroundImage() {
  var imgFile = document.getElementById("bgfile");
  bgImage = new SimpleImage(imgFile);
  bgCanvas = document.getElementById("can2");
  bgImage.drawTo(bgCanvas);  
}

function doClear(canvas) {
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);  
}

function clearCanvas(){
  doClear(fgCanvas);
  doClear(bgCanvas);
}

function createComposite() {
  // this function creates a new image with the dimensions of the foreground image and returns the composite green screen image
   var output = new SimpleImage(fgImage.getWidth(), fgImage.getHeight());
  var greenThreshold = 240;
  for(var pixel of fgImage.values()) {
    var x = pixel.getX();
    var y = pixel.getY();
    if (pixel.getGreen() > greenThreshold){
      //pixel is green, use background
      var bgPixel = bgImage.getPixel(x, y);
      output.setPixel(x, y, bgPixel);
    }
    else{
      //pixel is not green, use foreground
      output.setPixel(x, y, pixel);
    }
  }
  return output;  
}

function greenScreen() {
  //check that images are loaded
  if (fgImage == null || !fgImage.complete()) {
    alert("Foreground not loaded");
    return;
  }
   if (bgImage == null || !bgImage.complete()) {
    alert("Background not loaded");
  }
  clearCanvas();
  //call createComposite, which does green screen algorithm and returns a compsoite image
  var finalImage = createComposite();
  finalImage.drawTo(fgCanvas);
  
}