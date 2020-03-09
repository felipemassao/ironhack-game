// Here goes all the variables, information and geral methods of the game
class GameManager {
	constructor(canvas) {
		this.canvas = canvas;
		this.height = canvas.height;
		this.width = canvas.width;
		this.movementRadius = this.height / 20;

		//Block properties
		this.blocks = [];

		this.spawnRate = 100;
		this.framesAfterSpawn = 0;
		this.spawnRateIncrease = 3;
		this.spawnRateLowLimit = 10;

		this.blockSpeed = 1;
		this.blockSpeedIncrease= 0.2;
		this.blockSpeedMaxLimit = 5;

		this.score = 0;
		this.gameOver = false;
		this.ctx = canvas.getContext('2d');
	}

	start() {
		let { height, width, movementRadius } = this;
		this.player = new Player(height / 2, width / 2, movementRadius, 0, 20);
		window.requestAnimationFrame(() => this.updateFrame());
		console.log('Game Started');
	}
	
	updateFrame() {
		if(!this.gameOver){
			this.calculatePositions();
			this.createBlock();
			this.blockCollisionWithCenter();
			this.gameOver = this.checkCollisionWithPlayer();
			this.increaseScore();
			this.draw();
			window.requestAnimationFrame(() => this.updateFrame());
		} else {
			this.gameOverScreen();
		}
	}
	
	createBlock() {
		let { canvas, width, height, spawnRate, framesAfterSpawn, blockSpeed } = this;

		if(framesAfterSpawn > spawnRate){
			let spawnRadius = canvas.width / 2;
			let randomAngle = randomFloat(Math.PI * 2);
			this.blocks.push(new Block(width / 2, height / 2, spawnRadius, randomAngle, 40, blockSpeed));
			this.framesAfterSpawn = 0;
			this.increaseSpawnRate();
			this.increaseBlockSpeed();
		} else {
			this.framesAfterSpawn += 1;
		}
	}

	increaseSpawnRate(){
		let { spawnRate, spawnRateLowLimit } = this;
		if(spawnRate > spawnRateLowLimit){
			this.spawnRate -= 1;
		}
	}

	increaseBlockSpeed(){
		let { blockSpeed, blockSpeedIncrease, blockSpeedMaxLimit } = this;
		if(blockSpeed < blockSpeedMaxLimit){
			this.blockSpeed += blockSpeedIncrease;
		}
	}

	calculatePositions() {
		let { player } = this;
		player.transform.calculateNewPosition();
		this.blocks.forEach( block => {
			block.moveTowardsCenter();
			block.transform.calculateNewPosition();
		});
	}

	blockCollisionWithCenter() {
		let { movementRadius } = this;
		this.blocks = this.blocks.filter( block => block.transform.radius > movementRadius + block.side / 2);
	}

	checkCollisionWithPlayer(){
		let { player, blocks } = this;
		let collided = false;
		blocks.forEach( block => {
			let boundaries = block.side / 2 + player.side / Math.sqrt(2);
			let distance = distanceBetweenPoints(player.transform.x, player.transform.y, block.transform.x, block.transform.y);
			if(boundaries > distance){
				collided = true;
				return;
			}
		});
		return collided;
	}

	increaseScore(){
		this.score += 1;
	}

	draw() {
		let { ctx, height, width, movementRadius, player, blocks } = this;

		ctx.clearRect(0, 0, width, height);

		// Circle center
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.arc(width / 2, height / 2, movementRadius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		// Score
		ctx.font = "20px Georgia";
		ctx.fillText(`Score: ${this.score}`, width * 0.05, height * 0.05);

		player.draw(ctx);
		blocks.forEach(block => block.draw(ctx));
	}

	gameOverScreen(){
		let { ctx, width, height } = this;
		ctx.font = "30px Georgia";
		ctx.fillText('Game Over', width / 2 - 85, height / 2 - 100);
	}
}

class RadialTransform2D {
	constructor(anchorX, anchorY, radius, angle) {
		//Anchor
		this.anchorX = anchorX;
		this.anchorY = anchorY;

		//Cartesian coordinates
		this.x = 0;
		this.y = 0;

		//Polar coordinates
		this.radius = radius;
		this.angle = angle;

		this.speed = 0.05;
		this.calculateNewPosition();
	}

	calculateNewPosition() {
		let { anchorX, anchorY, radius, angle } = this;
		this.x = radius * Math.cos(angle) + anchorX;
		this.y = radius * Math.sin(angle) + anchorY;
	}
}

// Class who represents the Player and contains the game logic for inputs
class Player {
	constructor(anchorX, anchorY, radius, angle, side) {
		this.transform = new RadialTransform2D(anchorX, anchorY, radius, angle);
		this.side = side;
		document.addEventListener('keydown', (event) => this.processKeyInput(event.keyCode));
	}

	processKeyInput(keyCode) {
		let { speed } = this.transform;
		switch (keyCode) {
			case 37: // left arrow
				this.transform.angle -= Math.PI * 2 * speed;
				break;
			case 39: // right arrow
				this.transform.angle += Math.PI * 2 * speed;
				break;
			case 65:
				this.transform.angle -= Math.PI * 2 * speed;
				break;
			case 68:
				this.transform.angle += Math.PI * 2 * speed;
				break;
		}
	}

	draw(ctx) {
		let { side } = this;
		let { x, y, angle } = this.transform;
		ctx.save();

		// Draw Rectangle
		ctx.strokeStyle = 'blue';
		ctx.translate(x, y);
		ctx.rotate(Math.PI / 4 + angle);
		ctx.strokeRect(-1 * side / 2, -1 * side / 2, side, side);

		// Draw Center
		ctx.beginPath();
		ctx.fillStyle = 'blue';
		ctx.arc(0, 0, 2, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();

		// Outer Circle
		ctx.beginPath();
		ctx.strokeStyle = 'blue';
		ctx.arc(0, 0, side / Math.sqrt(2), 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
	}
}

// Blocks the player must avoid
class Block {
	constructor(anchorX, anchorY, radius, angle, side, speed){
		this.transform = new RadialTransform2D(anchorX, anchorY, radius, angle);
		this.side = side;
		this.speed = speed;
	}

	moveTowardsCenter(){
		let { speed } = this;
		if(this.transform.radius <= 2) {
			this.transform.radius = 2;
		} else {
			this.transform.radius -= 1 * speed;
		}
	}

	draw(ctx){
		let { side } = this;
		let { x, y } = this.transform;

		ctx.save();

		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.arc(x, y, side / 2, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	}
}
