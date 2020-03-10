// Class who represents the Player and contains the game logic for inputs
class Player {
	constructor(anchorX, anchorY, radius, angle, side) {
		this.transform = new RadialTransform2D(anchorX, anchorY, radius, angle);
		this.side = side;
		this.keysPressed = { left: false, right: false };
		document.addEventListener('keydown', (event) => this.keyDownInput(event.keyCode));
		document.addEventListener('keyup', (event) => this.keyUpInput(event.keyCode));
	}

	keyDownInput(keyCode) {
		switch (keyCode) {
			case 37: // left arrow
				this.keysPressed.left = true;
				break;
			case 39: // right arrow
				this.keysPressed.right = true;
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
		}
	}

	proccessInput(){
		const { speed } = this.transform;
		if(this.keysPressed.left){
			this.transform.angle -= Math.PI * 2 * speed;
		}
		if(this.keysPressed.right){
			this.transform.angle += Math.PI * 2 * speed;
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
