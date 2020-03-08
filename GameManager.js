// Here goes all the variables, information and geral methods of the game
class GameManager {
	constructor(canvas) {
		this.canvas = canvas;
		this.height = canvas.height;
		this.width = canvas.width;
		this.ctx = canvas.getContext('2d');
		this.i = 0;
		// this.updateFrame = this.updateFrame.bind(this);
	}

	start() {
		window.requestAnimationFrame(() => this.updateFrame());
		console.log('Game Started');
	}

	updateFrame() {
		this.draw();
		window.requestAnimationFrame(() => this.updateFrame());
	}

	draw() {
		let { ctx, height, width, i } = this;

		ctx.clearRect(0, 0, width, height);

		ctx.beginPath();
		ctx.strokeStyle = 'black';
		let radius = height / 20;
		ctx.arc(width / 2, height / 2, radius + i, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.closePath();
		this.i = i + 0.1;

		this.player = new Player(height / 2, width / 2, 20);
		this.player.draw(ctx);
	}
}

// Class who represents the Player and contains the game logic for inputs
class Player {
	constructor(x, y, side) {
		this.x = x;
		this.y = y;
		this.side = side;
	}

	draw(ctx) {
		let { x, y, side } = this;
		ctx.strokeStyle = 'blue';
		ctx.strokeRect(x - side / 2, y - side / 2, side, side);
	}
}

// Blocks the player must avoid
class Block {}
