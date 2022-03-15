var startimage = null;
var hideimage = null;
var resultimage = null;
var startcanvas;
var hidecanvas;
var cropwidth;
var cropheight;

function loadStartImage() {
  var imgFile = document.getElementById("startfile");
  startimage = new SimpleImage(imgFile);
  resultimage = new SimpleImage(imgFile);
  startcanvas = document.getElementById("can4");
  startimage.drawTo(startcanvas); 
}

function loadHideImage() {
  var imgFile = document.getElementById("hidefile");
  hideimage = new SimpleImage(imgFile);
  hidecanvas = document.getElementById("can5");
  hideimage.drawTo(hidecanvas);  
}

function clearbits(pixval) {
    //clear the same color value with the lower four bits zeroed eg: 1101 xxxx -> 1101 0000
    var x = Math.floor(pixval/16) * 16;
    return x;
}

function chop2hide(image) {
    //for each pixel in the image runs clearbits and set the new pixel to it
    for (var pixel of image.values()){
        pixel.setRed(clearbits(pixel.getRed()));
        pixel.setGreen(clearbits(pixel.getGreen()));
        pixel.setBlue(clearbits(pixel.getBlue()));
    }
    return image;
}

function shiftbits(pixval) {
    //shift four bits eg: 1101 xxxx -> 0000 1101
    var x = Math.floor(pixval/16);
    return x;
}

function shift(image) {
    //for every pixel in the image calls shiftbits and set the new pixel to it
     for (var pixel of image.values()){
        pixel.setRed(shiftbits(pixel.getRed()));
        pixel.setGreen(shiftbits(pixel.getGreen()));
        pixel.setBlue(shiftbits(pixel.getBlue()));
    }
    return image;
}

function combine() {
    //make a new image to show the result
    var result = new SimpleImage(startimage.getWidth(), startimage.getHeight());
    //for the same coordinate in start and hide image, get the pixel of start and hide, combine their pixel value together
    for (var pixel of result.values()){
        var x = pixel.getX();
        var y = pixel.getY();
        var startpixel = startimage.getPixel(x, y);
        var hidepixel = hideimage.getPixel(x, y);
        pixel.setRed(startpixel.getRed()+ hidepixel.getRed());
        pixel.setGreen(startpixel.getGreen()+ hidepixel.getGreen());
        pixel.setBlue(startpixel.getBlue()+ hidepixel.getBlue());
    }
    return result;
}

function crop(image, width, height) {
    //creating a new image with the exact width and height and set original pixel to the new image
    var cropimage = new SimpleImage(width, height);
    for (var pixel of cropimage.values()) {
        var x = pixel.getX();
        var y = pixel.getY();
      if (x < width && y < height) {
        var imagepixel = image.getPixel(x, y);
        pixel.setRed(imagepixel.getRed());
        pixel.setGreen(imagepixel.getGreen());
        pixel.setBlue(imagepixel.getBlue());
      }
    }
    return cropimage;
}

function steganography() {
  cropwidth = startimage.getWidth();
  cropheight = startimage.getHeight();
  if (hideimage.getWidth() < cropwidth) {
	  cropwidth = hideimage.getWidth();
  }
  if (hideimage.getWidth() < cropwidth) {
    cropwidth = hideimage.getWidth();
  }
  startimage = crop(startimage, cropwidth, cropheight);
  startimage = chop2hide(startimage);
  hideimage = shift(hideimage);
  var context = hidecanvas.getContext("2d");
  context.clearRect(0, 0, hidecanvas.width, hidecanvas.height);  
  var stego = combine();
  stego.drawTo(startcanvas);
}

function doClear(canvas) {
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);  
}

function clearCanvas(){
  doClear(startcanvas);
  doClear(hidecanvas);
}