class RadialTransform2D {
	constructor(anchorX, anchorY, radius, angle) {
		//Anchor of the object 2D
		this.anchorX = anchorX;
		this.anchorY = anchorY;

		//Cartesian coordinates
		this.x = 0;
		this.y = 0;

		//Polar coordinates
		this.radius = radius;
		this.angle = angle;

		this.speed = 0.01;
		this.calculateNewPosition();
	}

	calculateNewPosition() {
		let { anchorX, anchorY, radius, angle } = this;
		this.x = radius * Math.cos(angle) + anchorX;
		this.y = radius * Math.sin(angle) + anchorY;
	}
}
