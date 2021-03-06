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

		//Bullets
		this.bullets = [];
		this.bulletSize = 10;
		this.bulletSpeed = 3;

		// Player Properties
		this.playerProperties = {};
		this.playerProperties.playerRadius = 20;
		this.playerProperties.shootingCooldown = 10;
		this.initialAngle = 0;

		//Earth
		this.earthLives = 3;

		//Score
		this.score = 0;
		this.highScoreString = 'high_score';
		this.highScore = 0;
		this.gameOver = false;
	}

	start() {
		const { height, width, movementRadius, initialAngle, highScoreString, playerProperties } = this;
		const transform = new RadialTransform2D(height / 2, width / 2, movementRadius, initialAngle);
		this.player = new Player(transform, playerProperties);
		this.highScore = window.localStorage.getItem(highScoreString);
		if(this.highScore === null) this.highScore = 0;
		window.requestAnimationFrame(() => this.updateFrame());
	}
	
	updateFrame() {
		if(!this.gameOver){
			this.calculatePositions();

			// Creation
			this.createBullet();
			this.createBlock();
			this.eraseBulletWhenItReachesTheEnd();

			// Collisions
			this.blockCollisionWithCenter();
			this.bulletCollisionWithBlock();
			this.gameOver = this.checkCollisionWithPlayer();
			this.gameOver = this.checkEarthLives();
			
			this.increaseScore();
			this.draw();
			window.requestAnimationFrame(() => this.updateFrame());
		} else {
			this.setHighScore();
			this.gameOverScreen();
		}
	}

	createBullet(){
		const { width, height, player, bulletSize, bulletSpeed } = this;
		const { radius, angle } = this.player.transform
		if(player.isShooting){
			this.bullets.push(new Bullet(width / 2, height / 2, radius, angle, bulletSize, bulletSpeed));
		}
	}
	
	createBlock() {
		const { canvas, width, height, spawnRate, framesAfterSpawn, blockSpeed } = this;

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

	eraseBulletWhenItReachesTheEnd(){
		const { width, height } = this;
		this.bullets.forEach( (bullet, idx) => {
			if(bullet.transform.x > width || bullet.transform.y > height){
				this.bullets.splice(idx, 1);
			}
		});
	}

	increaseSpawnRate(){
		const { spawnRate, spawnRateLowLimit } = this;
		if(spawnRate > spawnRateLowLimit){
			this.spawnRate -= 1;
		}
	}

	increaseBlockSpeed(){
		const { blockSpeed, blockSpeedIncrease, blockSpeedMaxLimit } = this;
		if(blockSpeed < blockSpeedMaxLimit){
			this.blockSpeed += blockSpeedIncrease;
		}
	}

	calculatePositions() {
		const { player } = this;
		player.processInput();
		player.transform.calculateNewPosition();
		this.blocks.forEach( block => {
			block.moveTowardsCenter();
			block.transform.calculateNewPosition();
		});
		this.bullets.forEach( bullets => {
			bullets.moveFoward();
			bullets.transform.calculateNewPosition();
		});
	}

	blockCollisionWithCenter() {
		const { movementRadius } = this;
		const numberOfBlocksBefore = this.blocks.length;
		this.blocks = this.blocks.filter( block => block.transform.radius > movementRadius + block.side / 2);
		const numberOfBlocksAfter = this.blocks.length;
		if(numberOfBlocksBefore > numberOfBlocksAfter){
			this.earthLives -= 1;
		}
	}

	bulletCollisionWithBlock(){
		this.bullets.forEach( (bullet, bulletIdx) => {
			this.blocks.forEach( (block, blockIdx) => {
				const bulletX = bullet.transform.x;
				const bulletY = bullet.transform.y;
				const blockX = block.transform.x;
				const blockY = block.transform.y;

				if(distanceBetweenPoints(bulletX, bulletY, blockX, blockY) < block.side / 2){
					this.blocks.splice(blockIdx, 1);
					this.bullets.splice(bulletIdx, 1);
				}
			});
		});
	}

	checkCollisionWithPlayer() {
		const { player, blocks } = this;
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

	checkEarthLives(){
		return this.earthLives === 0;
	}

	increaseScore() {
		this.score += 1;
	}

	draw() {
		const { ctx, height, width, player, blocks, bullets } = this;

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

		// Lives
		ctx.font = "20px Georgia";
		ctx.fillStyle = 'white';
		ctx.fillText(`Earth Lives: ${this.earthLives}`, width * 0.30, height * 0.05);

		player.draw(ctx);
		blocks.forEach(block => block.draw(ctx));
		bullets.forEach(bullet => bullet.draw(ctx));
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
		const { ctx, width, height } = this;
		ctx.font = "30px Georgia";
		ctx.fillStyle = 'white';
		ctx.fillText('Game Over', width / 2 - 85, height / 2 - 100);
	}
}
