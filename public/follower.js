class Follower {
  constructor(position, image, leaderIndex){
    this.location = position;
    this.velocity = new paper.Point(0,0);
    this.maxVelocity = 20;
    this.maxSpeed = 10;//maxspeed that a follower can follow at
    this.maxForce = 1;
    this.acceleration = new paper.Point(0,0);
    this.mass = 2;
    this.radius = 50;
    this.image = null;
    this.imageId = image;
    this.leaderIndex = leaderIndex;
  };
  follow(leader){
    //move towards the target if further then the sum of the two object's radius + 200 px. If closer avoid the target
    var target = leader.location.subtract(this.location).length >= (this.radius + leader.radius * 1.5) ? leader.location.subtract(this.location) : leader.location.add(this.location);
    if(target.length >= (this.radius + leader.radius * 3) ){// if greater then 300px away from the leader
      target = target.normalize().multiply(this.maxSpeed);//proceed with max speed
    }
    else{//if closer to the leader then 300px
      var reducedSpeed = map_range(target.length,(this.radius + leader.radius * 1.5),(this.radius + leader.radius * 3),0,this.maxSpeed);//reduce the speed between max and 0 from 300px to 150px
      target = target.normalize().multiply(reducedSpeed);
    }
    var steer = limit(target.subtract(this.velocity),this.maxForce);
    this.applyForce(steer);
  };
  separate(others){
    var sum = new paper.Point(0,0);
    var count = 0;
    others.forEach(other => {
      var distance = this.location.subtract(other.location).length;
       if ((distance > 0) && (distance < 250)) {
         var d = this.location.subtract(other.location).normalize();
         sum = sum.add(d);
         count ++;
       }
    });
    if(count > 0){
      sum = sum.divide(count);
      sum = sum.multiply(5);
      var steer = limit(sum.subtract(this.velocity),5);
      this.applyForce(steer);
    }
  };
  flee(object){//flees the specified object
    var target = object.subtract(this.location);
    target = target.normalize().multiply(-20);//proceed with max speed
    var steer = limit(target.subtract(this.velocity),10);
    this.applyForce(steer);
  };
  move(){

    this.velocity = limit(this.velocity.add(this.acceleration),this.maxVelocity);//add the acceneration to the velocity and limit it by the max velocity

    this.location = this.location.add(this.velocity);//add the velocity to the leaders's current location

    this.image.position = this.location;//set drawn circle to the new location

    this.acceleration = this.acceleration.multiply(0);//set acceleration to 0 after each frame so that acceleration does not accumulate
  };
  draw(){//renders a circle at the leaders position

     this.image =  new paper.Raster(this.imageId);
     this.image.position = this.location;
  };
  applyForce(force){//applies a given force to the leader
    force = force.divide(this.mass);
    this.acceleration = this.acceleration.add(force);
  };
  checkBounds(){//checks the leader against the boundries of the screen
    if(this.location.x - this.radius <= 0){ //left
      this.velocity = this.velocity.multiply(-1,1);
      this.location.x = 0 + this.radius;
    }
    else if(this.location.x + this.radius >= screenWidth){//right
      this.velocity = this.velocity.multiply(-1,1);
      this.location.x = screenWidth - this.radius;
    }

    if(this.location.y - this.radius <= 0){//up
      this.velocity = this.velocity.multiply(1,-1);
      this.location.y = 0 + this.radius;
    }
    else if(this.location.y + this.radius >= screenHeight){//down
    this.velocity = this.velocity.multiply(1,-1);
    this.location.y = screenHeight - this.radius;
    }
  };
}
