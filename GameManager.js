// Here goes all the variables, information and geral methods of the game
class GameManager {
	constructor(canvas) {
		this.canvas = canvas;
		this.height = canvas.height;
		this.width = canvas.width;
		this.ctx = canvas.getContext('2d');
	}

	gameStart() {
		let { ctx, height, width } = this;

		ctx.beginPath();
		ctx.strokeStyle = 'black';
		let radius = height / 20;
		ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2, true);
		ctx.stroke();

		console.log('Game Started');
	}
}

// Class who represents the Player and contains the game logic for inputs
class Player {}

// Blocks the player must avoid
class Block {}
