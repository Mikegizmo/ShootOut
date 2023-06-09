const canvas = document.createElement('canvas');
const grid = 50;
const mind = {
  thinking: false,
  dir: 5, 
  count: 0
};

canvas.setAttribute('width', grid*20);
canvas.setAttribute('height', grid*15);
document.body.prepend(canvas);
canvas.style.border = '1px solid black';
const ctx = canvas.getContext('2d');

const btn = document.createElement('button');
btn.style.display = 'block';
btn.textContent = 'Turn On';
document.body.prepend(btn);
btn.style.backgroundColor = 'red';
btn.style.color = 'white';
btn.style.padding = '10px';

btn.addEventListener('click', (e) => {
  if(!mind.thinking) {
    mind.thinking = true;
    btn.textContent = 'Turn Off';
    btn.style.backgroundColor = 'green';
  } else {
    mind.thinking = false;
    btn.textContent = 'Turn On';
    btn.style.backgroundColor = 'red';
  }
})

const players = [{
  x:canvas.width/2 + (grid * 6),
  color:'red',
  pos:canvas.width / 2 + (canvas.width / 4)
}, {
  x:canvas.width/2 - (grid * 6),
  color:'blue',
  pos:canvas.width / 4
}];

const game = {
  req:'',
  bullets:[],
  bulletSpeed:5
};

const keyz = {
  ArrowLeft:false,
  ArrowRight:false,
  ArrowUp:false,
  ArrowDown:false,
  KeyA:false,
  KeyS:false,
  KeyW:false,
  KeyZ:false
};

canvas.addEventListener('click', startGame);

function startGame() {
  cancelAnimationFrame(game.req);
  players.forEach((player) => {
    player.score = 0;
    player.cooldown = 100;
    player.speed = Math.ceil(grid / 8);
    player.size = grid / 2 + 5;
    player.y = canvas.height / 2;
  })
  game.req = requestAnimationFrame(draw);
}

// Fire bullets - space bar and D key
document.addEventListener('keydown', (e)=> {
  if(e.code in keyz) {
    keyz[e.code] = true;
  }
  if(e.code == 'Space' && players[0].cooldown <= 0) {
    players[0].cooldown = 20;
    game.bullets.push({
      x:players[0].x - players[0].size - 15,
      y:players[0].y - 5,
      speed: -game.bulletSpeed,
      size:10,
      color:'indianred',
    })
  }
  if(e.code == 'KeyD' && players[1].cooldown <= 0) {
    
    players[1].cooldown = 20;
    game.bullets.push({
      x: players[1].x + players[1].size + 15,
      y: players[1].y - 5,
      speed: game.bulletSpeed,
      size: 10,
      color: 'royalblue',
    })
  }
})

document.addEventListener('keyup', (e)=> {
  if(e.code in keyz) {
    keyz[e.code] = false;
  }
  if(e.code == 'KeyM') {
    console.log(players[0].x, players[0].y);
    console.log(players[1].x, players[1].y);
    colDec(players[0], players[1]);
  }
})



function colDec(a, b) {
  return a.x < b.x + b.size && a.x + a.size * 2 > b.x && a.y < b.y - b.size + b.size * 2 && a.y + a.size * 2 > b.y - b.size;
}

function movementPlayer() {
if (mind.thinking) {
  if(mind.count > 0) {
    mind.count--;
  } else {
    let val = Math.floor(Math.random() * 20);
    mind.count = 10;
    if (players[1].y + val < players[0].y) {
    players[1].y += players[1].speed;
    } else if (players[1].y + val > players[0].y) {
    mind.dir = -players[1].speed;
    } 
  }
  players[1].y += mind.dir;
  // if (players[1].y + val < players[0].y) {
  //   players[1].y += players[1].speed;
  // } else if (players[1].y + val > players[0].y) {
  //   players[1].y -= players[1].speed;
  // }
}

  if(keyz['ArrowLeft'] && players[0].x > canvas.width/2+players[0].size) {
    players[0].x -= players[0].speed;
  }
  if(keyz['ArrowRight'] && players[0].x < canvas.width-players[0].size) {
    players[0].x += players[0].speed;
  }
  if(keyz['ArrowUp'] && players[0].y > players[0].size) {
    players[0].y -= players[0].speed;
  }
  if(keyz['ArrowDown'] && players[0].y < canvas.height-players[0].size) {
    players[0].y += players[0].speed;
  }
  if(keyz['KeyA'] && players[1].x > players[1].size) {
    players[1].x -= players[1].speed;
  }
  if(keyz['KeyS'] && players[1].x < canvas.width/2-players[1].size) {
    players[1].x += players[1].speed;
  }
  if(keyz['KeyW'] && players[1].y > players[1].size) {
    players[1].y -= players[1].speed;
  }
  if(keyz['KeyZ'] && players[1].y < canvas.height-players[1].size) {
    players[1].y += players[1].speed;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movementPlayer();
  game.bullets.forEach((bull, index) => {
    ctx.fillStyle = bull.color;
    ctx.fillRect(bull.x + (bull.size/2), bull.y, bull.size, bull.size);
    bull.x += bull.speed;
    if (bull.x < 0) {
      game.bullets.splice(index, 1);
    }
    players.forEach((player, i) => {
      if(colDec(bull, player)) {
      console.log('HIT player ' + player.color + ' ' + i);
      if(i==0) {
        players[1].score++;
      } else {
        players[0].score++;
      }
      game.bullets.splice(index, 1);
      }
    })
  })
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  players.forEach((player)=>{
    if(player.cooldown > 0) {
      player.cooldown--;
    }
    ctx.fillStyle = player.color;
    ctx.font = grid + 'px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Score:' + player.score, player.pos, grid);
    ctx.beginPath();
    
    ctx.arc(player.x,player.y,player.size,0,Math.PI*2);
    ctx.fill();
  })
  game.req = requestAnimationFrame(draw);
}