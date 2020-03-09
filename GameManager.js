// Here goes all the variables, information and geral methods of the game
class GameManager {
	constructor(canvas) {
		this.canvas = canvas;
		this.height = canvas.height;
		this.width = canvas.width;
		this.movementRadius = this.height / 20;
		this.numberOfBlocks = 10;
		this.ctx = canvas.getContext('2d');
	}

	start() {
		let { height, width, movementRadius } = this;
		this.player = new Player(height / 2, width / 2, movementRadius, 0, 20);

		this.createBlocks();

		window.requestAnimationFrame(() => this.updateFrame());
		console.log('Game Started');
	}
	
	updateFrame() {
		this.calculatePositions();
		this.destroyBlocks();
		this.draw();
		window.requestAnimationFrame(() => this.updateFrame());
	}
	
	createBlocks() {
		let { canvas, width, height, numberOfBlocks } = this;
		this.blocks = [];

		for(let i = 0; i < numberOfBlocks; i++){
			let randomRadius = random(canvas.width);
			let randomAngle = randomFloat(Math.PI * 2);
			this.blocks.push(new Block(width / 2, height / 2, randomRadius, randomAngle, 40));
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

	destroyBlocks() {
		let { movementRadius } = this;
		this.blocks = this.blocks.filter( block => block.transform.radius > movementRadius + block.side / 2);
	}

	draw() {
		let { ctx, height, width, movementRadius, player, blocks } = this;

		ctx.clearRect(0, 0, width, height);

		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.arc(width / 2, height / 2, movementRadius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		player.draw(ctx);
		blocks.forEach(block => block.draw(ctx));
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
		document.addEventListener('keydown', (event) => this.processInput(event.keyCode));
	}

	processInput(keyCode) {
		let { speed } = this.transform;
		switch (keyCode) {
			case 37: // left arrow
				this.transform.angle -= Math.PI * 2 * speed;
				break;
			case 39: // right arrow
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

		ctx.restore();
	}
}

// Blocks the player must avoid
class Block {
	constructor(anchorX, anchorY, radius, angle, side){
		this.transform = new RadialTransform2D(anchorX, anchorY, radius, angle);
		this.side = side;
	}

	moveTowardsCenter(){
		if(this.transform.radius <= 2) {
			this.transform.radius = 2;
		} else {
			this.transform.radius -= 1;
		}
	}

	draw(ctx){
		let { side } = this;
		let { x, y, angle } = this.transform;

		ctx.save();

		// Draw Rectangle
		ctx.strokeStyle = 'red';
		ctx.translate(x, y);
		ctx.rotate(Math.PI / 2 + angle);
		ctx.strokeRect(-1 * side / 2, -1 * side / 2, side, side);

		ctx.restore();
	}
}
