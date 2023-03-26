const canvas = document.createElement('canvas');
const grid = 25;
canvas.setAttribute('width', grid*20);
canvas.setAttribute('height', grid*15);
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

draw();

function draw() {
  ctx.fillRect(5,10,50,30);
  ctx.strokeRect(100,10,50,30);
}