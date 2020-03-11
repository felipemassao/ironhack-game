// Here goes all the variables, information and geral methods of the game
class GameManager {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.height = canvas.height;
		this.width = canvas.width;
		this.movementRadius = this.height / 10;

		//Block properties
		this.blocks = [];
		this.blockSpeed = 1;
		this.blockSpeedIncrease= 0.2;
		this.blockSpeedMaxLimit = 5;

		//Spawn rate of blocks
		this.spawnRate = 100;
		this.framesAfterSpawn = 0;
		this.spawnRateIncrease = 3;
		this.spawnRateLowLimit = 10;

		//Score
		this.score = 0;
		this.highScoreString = 'high_score';
		this.highScore = 0;
		this.gameOver = false;
	}

	start() {
		let { height, width, movementRadius, highScoreString } = this;
		this.player = new Player(height / 2, width / 2, movementRadius, 0, 20);
		this.highScore = window.localStorage.getItem(highScoreString);
		if(this.highScore === null) this.highScore = 0;
		window.requestAnimationFrame(() => this.updateFrame());
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
			this.setHighScore();
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
		player.processInput();
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

	checkCollisionWithPlayer() {
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

	increaseScore() {
		this.score += 1;
	}

	draw() {
		let { ctx, height, width, player, blocks } = this;

		ctx.clearRect(0, 0, width, height);

		// Circle center
		this.drawEarth(ctx);

		// Score
		ctx.font = "20px Georgia";
		ctx.fillStyle = 'white';
		ctx.fillText(`Score: ${this.score}`, width * 0.05, height * 0.05);

		// High Score
		ctx.font = "20px Georgia";
		ctx.fillStyle = 'white';
		ctx.fillText(`High Score: ${this.highScore}`, width * 0.60, height * 0.05);

		player.draw(ctx);
		blocks.forEach(block => block.draw(ctx));
	}

	drawEarth(){
		const { ctx, height, width, movementRadius } = this;
		const img = new Image();
		img.src = 'src/earth.png';
		ctx.drawImage(img, width / 2 - movementRadius, height / 2 - movementRadius, movementRadius * 2, movementRadius * 2);
	}

	setHighScore(){
		const { score, highScore, highScoreString } = this;
		if(score > highScore) window.localStorage.setItem(highScoreString, score);
	}

	gameOverScreen() {
		let { ctx, width, height } = this;
		ctx.font = "30px Georgia";
		ctx.fillStyle = 'white';
		ctx.fillText('Game Over', width / 2 - 85, height / 2 - 100);
	}
}
