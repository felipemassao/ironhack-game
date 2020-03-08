// Here goes all the variables, information and geral methods of the game
class GameManager {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}

	gameStart() {
		let { ctx } = this;
		this.player = new Player();
		this.block = new Block();
		console.log('Game Started');
		ctx.fillStyle = 'red';
		ctx.fillRect(200, 200, 200, 200);
	}
}

// Class who represents the Player and contains the game logic for inputs
class Player {}

// Blocks the player must avoid
class Block {}
