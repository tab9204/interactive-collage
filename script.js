var gravity = new paper.Point(0,0);
//friction variables
var coefficient = .2;
var normal = 1;
var frictionMag = coefficient * normal;

var screenWidth;
var screenHeight;

var directionVector = new paper.Point(0,0);//vector used to point the motion of the ball in a specific direction
var mouseVector = new paper.Point(0,0);//The mouse's current coordnates
var offset = new paper.Point(0,0);//the distance between where the ball was clicked on and the center point of the ball

var movers = [];//array containing all the mover objects
var movies = [];
var games = [];

var pathLine;//the path to draw the line

var drawTool = new paper.Tool();//the tool to create lines
var moveTool = new paper.Tool();//tool used to move the ball

var pointA;
var pointB;
var vectorC;

var canvas;
var moveButton;
var drawButton;

var mousePressed = false;

// Only executed our code once the DOM is ready.
window.onload = function() {

   canvas = document.getElementById('myCanvas');
   moveButton =  document.getElementById('moveTool');
   drawButton =  document.getElementById('drawTool');

   screenWidth = canvas.offsetWidth;
   screenHeight = canvas.offsetHeight;
  // Create an empty project and a view for the canvas:
  paper.setup(canvas);


  var treyPic = new Mover(new paper.Point(201, 796),"eyes_wide_trey");
  var doggo = new Mover(new paper.Point(593, 683),"doggo");

  var league = new Mover(new paper.Point(1418 ,660),"lol");
  var darkSouls = new Mover(new paper.Point(1805,659),"dark_souls");
  var zote = new Mover(new paper.Point(1732,853),"zote");

  var babyTrey = new Mover(new paper.Point(884,118),"baby_trey");
  var ty = new Mover(new paper.Point(1203,94),"ty");
  var mel = new Mover(new paper.Point(1099,406),"mel");
  var pa = new Mover(new paper.Point(819,342),"pa");
  var hockey = new Mover(new paper.Point(941,757),"hockey");

  var theThing = new Mover(new paper.Point(157,181),"the_thing");
  var evilDead = new Mover(new paper.Point(203 ,413),"evil_dead");
  var deadAlive = new Mover(new paper.Point(552 ,403),"dead_alive");
  var livingDead = new Mover(new paper.Point(441 ,122),"living_dead");

  var college = new Mover(new paper.Point(1754 ,173),"rit");
  var brokenMyth = new Mover(new paper.Point(1504 ,110),"broken_myth");
  var allyis = new Mover(new paper.Point(1474 ,362),"allyis");
  //hockey picture once I get it

  movers.push(treyPic,league,babyTrey,mel,theThing,college,evilDead,deadAlive,livingDead,darkSouls,zote,ty,brokenMyth,allyis,pa,hockey,doggo);

  movers.forEach(mover => mover.draw());//draw each object

  pathLine = new paper.Path();
  pathLine.opacity = 1;

  moveTool.activate();//avtivate the move tool by default
  attachEventHandlers();


  paper.view.onFrame = function(event) {
  //  paper.project.clear(); //clear the project every frame. THIS IS PROBABLY NOT THE BEST WAY TO DO THIS
    if(!mousePressed){pathLine.opacity -= .04;}

    movers.forEach(mover => {
      var mass = mover.mass;//get the mass of the ball

      //calculate the friction
      var friction = mover.velocity;
      friction = friction.multiply(-1).normalize();
      friction = friction.multiply(frictionMag);

      //apply forces
      mover.applyForce(friction);
      mover.applyForce(gravity.multiply(mass));

      //move the ball and check the boundries
      mover.move();
      mover.checkBounds();
      mover.collision(movers);//checks for collision with other movers
      mover.separate(movers);
      //movers.align(movers);
      //mover.cohesion(movers);

    });

  };

  paper.view.onKeyDown = function(event) {
    if(event.key == "1"){
      drawTool.activate();
    }
    else if(event.key == "2"){
      moveTool.activate();
    }
  }

}
//limits the length of a vector
//vec => the vector that is being tested
//max the max legth the vector can be
function limit(vec,max){
  var limitedVector = vec.length <= max  ? vec : vec.normalize(max);
  return limitedVector;
}

//maps a range of values
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function attachEventHandlers(){
  //apply the mouse event to each object
  movers.forEach(mover => {
    mover.image.onMouseDown = function(event){
      if(moveTool.isActive()){
        mover.velocity = new paper.Point(0,0);

        mouseVector = new paper.Point(event.point.x,event.point.y);

        offset = mouseVector.subtract(mover.image.position);

        mover.lastLocation = mover.location;

      }
    }
    mover.image.onMouseDrag = function(event){
      if(moveTool.isActive()){
        mouseVector = new paper.Point(event.point.x,event.point.y);
        mover.lastLocation = mover.location; //before updating the objet to the new location update its last location with the current location
        mover.location = mouseVector.subtract(offset);
      }
    }
    mover.image.onMouseUp = function(event){
      if(moveTool.isActive()){
        console.log(event.point.x + " : " + event.point.y);

        directionVector = mouseVector.subtract(mover.lastLocation.add(offset));//set the direction vector to point from the balls current location towards the mouse's location

        mover.acceleration = directionVector;
        mover.velocity = new paper.Point(0,0);//remove any remaining velocity the ball still had

        mover.lastLocation = mover.location; //set last location to the current position
      }
    }
    mover.image.onMouseEnter = function(event){
      if(moveTool.isActive()){
        var mouse = new paper.Point(event.point.x, event.point.y);
        mover.flee(mouse);
      }
    }
    mover.image.onMouseLeave = function(event){
      if(moveTool.isActive()){
        var mouse = new paper.Point(event.point.x, event.point.y);
        mover.flee(mouse);
      }
    }
  });

  drawTool.onMouseDown = (event) =>{
    mousePressed = true;
    pathLine = new paper.Path();
    pathLine.strokeColor = 'black';
    pathLine.strokeWidth = 3;
    pathLine.opacity = 1;
    pathLine.add(event.point);
    pointA = event.point;
  }
  drawTool.onMouseDrag = (event) =>{
    pathLine.add(event.point);
  }
  drawTool.onMouseUp = (event) =>{
  mousePressed = false;
  }

}
