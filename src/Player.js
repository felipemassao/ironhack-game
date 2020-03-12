// Class who represents the Player and contains the game logic for inputs
class Player {
	constructor(transform, playerProperties) {
		this.transform = transform;
		this.playerRadius = playerProperties.playerRadius;
		
		//Shooting
		this.isShooting = false;
		this.shootingCooldown = playerProperties.shootingCooldown;
		this.shootingAfterFrames = this.shootingCooldown;

		//Inputs
		this.keysPressed = { left: false, right: false, shoot: false };
		document.addEventListener('keydown', (event) => {
			event.preventDefault();
			this.keyDownInput(event.keyCode);
		});
		document.addEventListener('keyup', (event) => {
			event.preventDefault();
			this.keyUpInput(event.keyCode);
		});
	}

	keyDownInput(keyCode) {
		switch (keyCode) {
			case 37: // left arrow
				this.keysPressed.left = true;
				break;
			case 39: // right arrow
				this.keysPressed.right = true;
				break;
			case 32: // space
				this.keysPressed.shoot = true;
				break;
		}
	}

	keyUpInput(keyCode) {
		switch (keyCode) {
			case 37: // left arrow
				this.keysPressed.left = false;
				break;
			case 39: // right arrow
				this.keysPressed.right = false;
				break;
			case 32: // space
				this.keysPressed.shoot = false;
				break;
		}
	}

	processInput(){
		const { speed } = this.transform;
		if(this.keysPressed.left){
			this.transform.angle -= Math.PI * 2 * speed;
		}
		if(this.keysPressed.right){
			this.transform.angle += Math.PI * 2 * speed;
		}
		if(this.keysPressed.shoot && (this.shootingAfterFrames >= this.shootingCooldown)){
			this.isShooting = true;
			this.shootingAfterFrames = 0;
		} else {
			this.isShooting = false;
			if(this.shootingAfterFrames < this.shootingCooldown) this.shootingAfterFrames += 1;
		}
	}

	draw(ctx) {
		const { playerRadius } = this;
		const { x, y, angle } = this.transform;

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(Math.PI / 2 + angle);
		const img = new Image();
		img.src = 'src/pitrizzo-SpaceShip-gpl3-opengameart-96x96.png';
		ctx.drawImage(img, - playerRadius, - playerRadius, playerRadius * 2, playerRadius * 2);
		ctx.restore();
	}
}
