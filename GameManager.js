// Here goes all the variables, information and geral methods of the game
class GameManager {
	constructor(canvas) {
		this.canvas = canvas;
		this.height = canvas.height;
		this.width = canvas.width;
		this.ctx = canvas.getContext('2d');
	}

	start() {
		let { ctx, height, width } = this;

		ctx.beginPath();
		ctx.strokeStyle = 'black';
		let radius = height / 20;
		ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2, true);
		ctx.stroke();
		ctx.closePath();

		this.player = new Player(height / 2, width / 2, 20);
		this.player.draw(ctx);

		console.log('Game Started');
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
