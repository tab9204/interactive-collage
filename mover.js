class Mover {
  constructor(position,image){
    this.location = position;
    this.lastLocation = position;//used for flinging the object. defaults to the current position before the object has moved
    this.velocity = new paper.Point(0,0);
    this.maxVelocity = 5;
    this.maxSpeed = 5;
    this.maxForce = .5;
    this.acceleration = new paper.Point(0,0);
    this.mass = 5;
    this.image = null;
    this.imageId = image;
  };
  collision(others){//checks for collision with other movers
    others.forEach(other => {
      if(this.image.intersects(other.image) && other.imageId !== this.imageId){//if the images intersect and are not the same image
        other.velocity = other.velocity.add(this.velocity);
        this.velocity = this.velocity.multiply(-1);
      }
    });
  };
  flee(object){//flees the specified object
    var target = object.subtract(this.location);
    target = target.normalize().multiply(-10);//proceed with max speed
    var steer = limit(target.subtract(this.velocity),6);
    this.applyForce(steer);
  };
  separate(others){
    var sum = new paper.Point(0,0);
    var count = 0;
    others.forEach(other => {
      var distance = this.location.subtract(other.location).length;
       if ((distance > 0) && (distance < (300))) {
         var difference = this.location.subtract(other.location).normalize();
         difference.divide(distance);
         sum = sum.add(difference);
         count ++;
       }
    });
    if(count > 0){
      sum = sum.divide(count);
      sum = sum.normalize().multiply(1.5);
      var steer = limit(sum.subtract(this.velocity),1.5);
      this.applyForce(steer);
    }
  };
  align(others){
    var sum = new paper.Point(0,0);
    var count = 0;
    others.forEach(other => {
      sum = sum.add(other.velocity);
      count ++;
    });
    sum = sum.divide(others.length);
    sum = sum.normalize().multiply(.5);
    var steer = limit(sum.subtract(this.velocity),.5);
    this.applyForce(steer);
  };
  cohesion(others){
    var sum = new paper.Point(0,0);
    var count = 0;
    others.forEach(other => {
      sum = sum.add(other.location);
      count ++;
    });
      sum = sum.divide(others.length);
      this.seek(sum);
  };
  seek(target){
    var desired = target.subtract(this.location);
    desired = desired.normalize().multiply(1);
    var steer = limit(desired.subtract(this.velocity),1);
    this.applyForce(steer);
  };
  move(){
    this.velocity = limit(this.velocity.add(this.acceleration),this.maxVelocity);//add the acceneration to the velocity and limit it by the max velocity

    this.location = this.location.add(this.velocity);//add the velocity to the movers's current location

    this.image.position = this.location;//set drawn circle to the new location

    this.acceleration = this.acceleration.multiply(0);//set acceleration to 0 after each frame so that acceleration does not accumulate
  };
  draw(){//renders a circle at the movers position

    this.image =  new paper.Raster(this.imageId);
    this.image.position = this.location;
  };
  applyForce(force){//applies a given force to the movers
    force = force.divide(this.mass);
    this.acceleration = this.acceleration.add(force);
  };
  checkBounds(){//checks the movers against the boundries of the screen
    if(this.location.x - (this.image.width / 2) <= 0){ //left
      this.velocity = this.velocity.multiply(-1,1);
      this.location.x = 0 + (this.image.width / 2);
    }
    else if(this.location.x + (this.image.width / 2) >= screenWidth){//right
      this.velocity = this.velocity.multiply(-1,1);
      this.location.x = screenWidth - (this.image.width / 2);
    }

    if(this.location.y - (this.image.height / 2) <= 0){//up
      this.velocity = this.velocity.multiply(1,-1);
       this.location.y = 0 + (this.image.height / 2);
    }
    else if(this.location.y + (this.image.height / 2) >= screenHeight){//down
    this.velocity = this.velocity.multiply(1,-1);
     this.location.y = screenHeight - (this.image.height / 2);
    }
  };
}
