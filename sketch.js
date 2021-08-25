/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisiblejungle;
var eatingSound

var invisibleGround

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restartButton;
var restartImg


function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
  eatingSound = loadSound("assets/eating_sound.mp3")
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(130,290,50,50)
  kangaroo.addAnimation("running", kangaroo_running)
  kangaroo.addAnimation("collided", kangaroo_collided)
  kangaroo.scale = 0.1

  gameOver = createSprite(width/2, 180)
  gameOver.addImage(gameOverImg)

  restartButton = createSprite(width/2, 250)
  restartButton.addImage(restartImg)
  restartButton.scale = 0.1

  invisibleGround = createSprite(width/2, 400, windowWidth, 160)
  invisibleGround.visible = false


  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  kangaroo.debug = true
  kangaroo.setCollider("circle", 0, 0, 300)
  kangaroo.x = camera.position.x - 270

  if(gameState === PLAY) {
  jungle.velocityX = -6

  gameOver.visible = false
  
  if(jungle.x < 50) {
    jungle.x = width/2
  }

  if(keyIsDown(32) && kangaroo.position.y >= 100) {
    kangaroo.velocityY = -10
    jumpSound.play()
  }
    kangaroo.velocityY = kangaroo.velocityY + 0.8

    if(shrubsGroup.isTouching(kangaroo)) {
      shrubsGroup.destroyEach()
      eatingSound.play()
      score = score+1
    }
    
    if(obstaclesGroup.isTouching(kangaroo)) {
      obstaclesGroup.destroyEach()
      gameState = END
      collidedSound.play()
    }

    restartButton.visible = false

    spawnShrubs()
    spawnObstacles()
  }
  else if (gameState === END) {
    jungle.velocityX = 0
    kangaroo.velocityY = 0
    shrubsGroup.destroyEach()
    kangaroo.changeAnimation("collided", kangaroo_collided)
    gameOver.visible = true
    score = 0
    restartButton.visible = true
  
    if(mousePressedOver(restartButton)) {
      reset()
    }
  }
  else if (gameState === WIN) {
    jungle.velocityX = 0
    kangaroo.velocityY = 0
    obstaclesGroup.setVelocityXEach(0)
    shrubsGroup.setVelocityXEach(0)
    kangaroo.changeAnimation("collided", kangaroo_collided)
    obstaclesGroup.setLifetimeEach(-1)
    shrubsGroup.setLifetimeEach(-1)
  }
  kangaroo.collide(invisibleGround)

  drawSprites();
  textSize(20)
  stroke(3)
  fill("lime")
  text("Score: " + score, 600, 100)

  if(score >= 1) {
    textSize(30)
    stroke(3)
    fill("gold")
    text("You Win!", 350, 200)
    gameState = WIN
  }
}

function spawnShrubs() {
  if (frameCount % 150 === 0) {
  var shrub = createSprite(camera.position.x + 250, 300, 40, 10)
  shrub.x = camera.position.x+250
  shrub.addImage(shrub1)
  shrub.scale = 0.08
  shrub.debug = true
  shrub.setCollider("circle", 0, 0, 500)
  shrub.velocityX = -6
  shrub.lifetime = 150

  shrubsGroup.add(shrub)
  
  }
}

function spawnObstacles() {
  if(frameCount % 172 === 0) {
    var obstacle = createSprite(camera.x + 250, 300, 40, 10)
    obstacle.x = camera.position.x + 250
    obstacle.addImage(obstacle1)
    obstacle.scale = 0.2
    obstacle.debug = true
    obstacle.setCollider("circle", 0, 0, 200)
    obstacle.velocityX = -9
    obstacle.lifetime = 150

    obstaclesGroup.add(obstacle)

  }
}

function reset() {
gameState = PLAY
kangaroo.changeAnimation("running", kangaroo_running)
}