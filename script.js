var canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;

function CircularCollision(circle1, circle2) {
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.r + circle2.r) {
        return true;
    }
}

function RectCircleCollision(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.w/2);
    var distY = Math.abs(circle.y - rect.y - rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx = distX - rect.w/2;
    var dy = distY - rect.h/2;
    return (dx**2 + dy**2 <= circle.r**2);
}

const camera ={
	get x() {
	return-(canvas.width /2 - player.x);
	},
	get y (){
	return-(canvas.width /2 - player.y);
	}
};

var ctx = canvas.getContext('2d');
var random = (min, max) => ~~(Math.random() * (max - min) + min);
var cells = [];
var colors = ['red', 'green', 'blue'];
var player = {
    x: 200,
    y: 200,
    r: 20,
    color: 'dodgerblue',
    angle: 0,
    aim: {
        x: 200,
        y: 200,
    },
    score: 0,
    isHit: false
};

var block = {
    x: 0,
    y: 0,
    w: canvas.width / 3,
    h: 30
}

for (var i = 0; i < 20; i++) {
    cells.push({
        x: random(0, canvas.width),
        y: random(0, canvas.height),
        r: 5,
        color: colors[random(0, colors.length)]
    })
}
function arc (obj) {
    ctx.fillStyle = obj.color;
    ctx.beginPath();
    ctx.arc(obj.x - camera.x, obj.y, obj.r || 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function loop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    block.y += 7;
    if (block.y > canvas.height) {
        block.x = [0, canvas.width/3, canvas.width*2/3][random(0, 3)]
        block.y = -100;
    }

    if (!player.isHit && RectCircleCollision(player, block)) {
        player.score -= 100;
        if (player.score < 0) player.score = 0;
        player.r -= 10;
        if (player.r < 10) player.r = 10;
        player.isHit = true;
        setTimeout(() => player.isHit = false, 2000);
    }
    arc(player);
    
    var distanceX = player.x - player.aim.x - camera.x;
    var distanceY = player.y - player.aim.y;
    
    player.angle = -Math.atan2(distanceY, -distanceX);
    
    var vx = Math.cos(player.angle);
    var vy = Math.sin(player.angle);

    if (!CircularCollision(player, {x: player.aim.x - camera.x, y: player.aim.y, r: 1})) {
        player.x += vx * 5;
        player.y += vy * 5;
    }

    for (var i = 0; i < cells.length; i++) {
        if (CircularCollision(player, cells[i])) {
            cells[i] = {
                x: random(0, canvas.width),
                y: random(0, canvas.height),
                r: 5,
                color: colors[random(0, colors.length)]
            }
            player.score += 10;
            if (player.r < 50) {
                player.r += 2;
            }
        }
        else arc(cells[i]);
    }
	
    ctx.fillStyle = 'purple';
    ctx.fillRect(block.x - camera.x, block.y, block.w, block.h);

    ctx.font = '40px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(`Score: ${player.score}`, 20, 50);
    requestAnimationFrame(loop);
}loop();
canvas.addEventListener('mousemove', e => {
    player.aim = {
        x: e.clientX,
        y: e.clientY
    }
})

