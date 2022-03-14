function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}
 
function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}

//To do list function
function addTask () {
  var input = document.getElementById("input");
  // get current text from input field
  var newTask = input.value;
  // only add new item to list if some text was entered
  if (newTask != "") {
    // create new HTML list item
    var item = document.createElement("li");
    // add HTML for buttons and new task text
    // Note, need to use '' because of "" in HTML
    item.innerHTML = '<input type="button" class="done" onclick="markDone(this.parentNode)" value="&#x2714;" /> ' + 
    '<input type="button" class="remove" onclick="remove(this.parentNode)" value="&#x2718;" /> ' +
    newTask;
    // add new item as part of existing list
    document.getElementById("tasks").appendChild(item);  
    
    input.value ="";
    input.placeholder ="Enter task ...";
    
  }
}

// change styling used for given item
function markDone (item) { 
    item.className = 'finished';
}

function remove (item) {
  // remove item completely from document
  if (item.className == 'finished'){
     item.remove();
  }
}

function doAbout() {
  var diva = document.getElementById("divabout");
  diva.innerHTML = "Author is Joyce Lin";
  diva.className = "yellowbackground";
  
}

function clearAbout() {
  var diva = document.getElementById("divabout");
  diva.innerHTML = "";
}

//paint canvas
var paintcanvas = document.getElementById("canvas1");
var context = paintcanvas.getContext("2d");
var color = 'black';
var radius = 50;
// only paint if mouse is  being dragged (moved while the button is pressed)
var isPainting = false;

function setWidth (value) {
  if (isNumeric(value)){
    paintcanvas.width = value
  }
}

function setHeight (value) {
  if (isNumeric(value)){
    paintcanvas.height = value
  }
}

function startPaint() {
  isPainting = true;
}

function endPaint() {
  isPainting = false;
}

function doPaint(x, y){
  if(isPainting){
    paintCircle(x, y);
  }
}

function setColor(newColor){
   color = newColor;
}

function resizeBrush(newSize){
  radius = newSize;
  document.getElementById("sizeOutput").value = newSize;
}

function clearCanvas () {
  context.clearRect(0, 0, paintcanvas.width, paintcanvas.height);
}

function paintCircle (x, y) {
    // make sure to start a new circle each time
    context.beginPath();
    // draw circle using a complete (2*PI) arc around given point
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.fillStyle = color;
    context.fill();
}
// verify the given value is actually a number
function isNumeric (value) {
  // standard JavaScript function to determine whether a string is an illegal number (Not-a-Number)
  return !isNaN(value);
}

//green screen
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

//filter fun
var originalimage = null;
var grayimage = null;
var redimage = null;
var rainbowimage = null;
var blurimage = null;
var canvas;



function loadImage(){
  var imgFile = document.getElementById("imgfile");
  originalimage = new SimpleImage(imgFile);
  grayimage = new SimpleImage(imgFile);
  redimage = new SimpleImage(imgFile);
  rainbowimage = new SimpleImage(imgFile);
  blurimage = new SimpleImage(imgFile);

  canvas = document.getElementById("can3");
  originalimage.drawTo(canvas); 
}

function reset() {
  originalimage.drawTo(canvas);
}


function grayscale() {
  //change all pixels of image to gray
  for (var pixel of grayimage.values()) {
    var avg = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
  //display new image
  grayimage.drawTo(canvas);
}


function red() {
   for (var pixel of redimage.values()) {
    var avg = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    if (avg < 128) {
      pixel.setRed(2 * avg);
      pixel.setGreen(0);
      pixel.setBlue(0);
    } else {
      pixel.setRed(255);
      pixel.setGreen(2 * avg - 255);
      pixel.setBlue(2 * avg - 255);
    }
  }
  //display new image
  redimage.drawTo(canvas);
}

function rainbow() {
  var height = rainbowimage.getHeight();
  for (var pixel of rainbowimage.values()) {
    var y = pixel.getY();
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (y < height / 7) {
      //red
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(0);
        pixel.setBlue(0);
      } else {
        pixel.setRed(255);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(2 * avg - 255);
      }
    } else if (y < height * 2 / 7) {
      //orange
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(0.8*avg);
        pixel.setBlue(0);
      } else {
        pixel.setRed(255);
        pixel.setGreen(1.2*avg-51);
        pixel.setBlue(2 * avg - 255);
      }
    } else if (y < height * 3 / 7) {
      //yellow
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(2*avg);
        pixel.setBlue(0);
      } else {
        pixel.setRed(255);
        pixel.setGreen(255);
        pixel.setBlue(2 * avg - 255);
      }
    } else if (y < height * 4 / 7) {
      //green
      if (avg < 128) {
        pixel.setRed(0);
        pixel.setGreen(2*avg);
        pixel.setBlue(0);
      } else {
        pixel.setRed(2*avg-255);
        pixel.setGreen(255);
        pixel.setBlue(2 * avg - 255);
      }
    } else if (y < height * 5 / 7) {
      //blue
      if (avg < 128) {
        pixel.setRed(0);
        pixel.setGreen(0);
        pixel.setBlue(2*avg);
      } else {
        pixel.setRed(2*avg-255);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(255);
      }
    } else if (y < height * 6 / 7) {
      //indigo
      if (avg < 128) {
        pixel.setRed(.8*avg);
        pixel.setGreen(0);
        pixel.setBlue(2*avg);
      } else {
        pixel.setRed(1.2*avg-51);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(255);
      }
    } else {
      //violet
      if (avg < 128) {
        pixel.setRed(1.6*avg);
        pixel.setGreen(0);
        pixel.setBlue(1.6*avg);
      } else {
        pixel.setRed(0.4*avg+153);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(0.4*avg+153);
      }
    }
  }
  rainbowimage.drawTo(canvas);
}




function ensureInImage (coordinate, size) {
    // coordinate cannot be negative
    if (coordinate < 0) {
        return 0;
    }
    // coordinate must be in range [0 .. size-1]
    if (coordinate >= size) {
        return size - 1;
    }
    return coordinate;
}

function getPixelNearby (image, x, y, diameter) {
    var dx = Math.random() * diameter - diameter / 2;
    var dy = Math.random() * diameter - diameter / 2;
    var nx = ensureInImage(x + dx, image.getWidth());
    var ny = ensureInImage(y + dy, image.getHeight());
    return image.getPixel(nx, ny);
}

function doblur() { 
  var output = new SimpleImage(blurimage.getWidth(), blurimage.getHeight());
  for (var pixel of blurimage.values()) {
    var x = pixel.getX();
    var y = pixel.getY();
    if (Math.random() > 0.5) {
        var other = getPixelNearby(blurimage, x, y, 10);
        output.setPixel(x, y, other);
    }
    else {
        output.setPixel(x, y, pixel);
    }
}
  output.drawTo(canvas);
}