var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 6;
var ballSpeedY = 1;

var player1Score = 0;
var player2Score = 0;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 3;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }
}

function handleMouseClick(evt) {
  if(showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 60;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', function(evt) {
                                        var mousePos = calculateMousePos(evt);
                                        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
  });
}

function ballReset() {
  if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }
  ballSpeedX *= -1;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if(paddle2YCenter < ballY-30) {
    paddle2Y +=3;
  }
  else if(paddle2YCenter > ballY+30) {
    paddle2Y += -3;
  }
}

function moveEverything() {
  if(showingWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if(ballX > canvas.width - (PADDLE_THICKNESS+5)) {
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
      ballSpeedX *= -1;
      var deltaY = ballY - (paddle2Y+(PADDLE_HEIGHT/2));
      ballSpeedY = deltaY * 0.2;
    }
    else {;
      player1Score++
      ballReset();
    }
  }

  if(ballX < 0 + (PADDLE_THICKNESS+5)) {
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
      ballSpeedX *= -1;
      var deltaY = ballY - (paddle1Y+(PADDLE_HEIGHT/2));
      ballSpeedY = deltaY * 0.2;
    }
    else {
      player2Score++;
      ballReset();
    }
  }

  if(ballY >= canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for(var i=0; i<canvas.height; i+=30) {
    colorRect(canvas.width/2-1,i,2,10,'white')
  }
}

function drawEverything() {
  //Draws the board
  colorRect(0,0, canvas.width, canvas.height, 'green');

  //Sets the font style
  canvasContext.font = "20px Helvetica";

  if(showingWinScreen) {
    canvasContext.fillStyle = 'white';
    if(player1Score >= WINNING_SCORE) {
      canvasContext.fillText("Left Player Won!", 300, 200);
    }
    else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Right Player Won!", 300, 200);
    }
    canvasContext.fillText("Click to continue", 300, 280);
    return;
  }

  //Draws left player
  colorRect(5, paddle1Y, PADDLE_THICKNESS, 100, 'white');
  //Draw computer player
  colorRect(canvas.width-PADDLE_THICKNESS-5, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
  //Draw the ball
  colorCircle(ballX, ballY, 10, 'white');

  canvasContext.fillText(player1Score, 100,100);
  canvasContext.fillText(player2Score, canvas.width-100,100);
  drawNet();
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height)
}
