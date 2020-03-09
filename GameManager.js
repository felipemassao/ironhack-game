// Here goes all the variables, information and geral methods of the game
class GameManager {
	constructor(canvas) {
		this.canvas = canvas;
		this.height = canvas.height;
		this.width = canvas.width;
		this.movementRadius = this.height / 20;
		this.ctx = canvas.getContext('2d');
	}

	start() {
		let { height, width, movementRadius } = this;
		this.player = new Player(height / 2, width / 2, movementRadius, 20);

		window.requestAnimationFrame(() => this.updateFrame());
		console.log('Game Started');
	}

	updateFrame() {
		this.calculatePositions();
		this.draw();
		window.requestAnimationFrame(() => this.updateFrame());
	}

	calculatePositions() {
		let { player } = this;
		player.calculateNewPosition();
	}

	draw() {
		let { ctx, height, width, movementRadius, player } = this;

		ctx.clearRect(0, 0, width, height);

		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.arc(width / 2, height / 2, movementRadius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		player.draw(ctx);
	}
}

// Class who represents the Player and contains the game logic for inputs
class Player {
	constructor(initialX, initialY, movementRadius, side) {
		//Anchor
		this.initialX = initialX;
		this.initialY = initialY;

		//Cartesian coordinates
		this.x = 0;
		this.y = 0;

		//Polar coordinates
		this.movementRadius = movementRadius;
		this.angle = 0;

		this.speed = 0.03;
		this.side = side;

		document.addEventListener('keydown', (event) => this.processInput(event.keyCode));
		this.calculateNewPosition();
	}

	processInput(keyCode) {
		let { speed } = this;
		switch (keyCode) {
			case 37: // left arrow
				this.angle -= Math.PI * 2 * speed;
				break;
			case 39: // right arrow
				this.angle += Math.PI * 2 * speed;
				break;
		}
	}

	calculateNewPosition() {
		let { initialX, initialY, movementRadius, angle } = this;
		this.x = movementRadius * Math.cos(angle) + initialX;
		this.y = movementRadius * Math.sin(angle) + initialY;
	}

	draw(ctx) {
		let { x, y, angle, side } = this;
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
class Block {}
