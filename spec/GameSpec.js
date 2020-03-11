describe('RadialTransform2D test enviroment', () => {
    beforeEach(() => {
        const width = 700;
        const height = 700;
        const radius = Math.PI / 2;
        const angle = 0;
        this.transform = new RadialTransform2D(width / 2, height / 2, radius, angle);
    });
    it('test transform', () => {
        this.transform.calculateNewPosition();
        expect(this.transform.x).toBeCloseTo(385, 0);
        expect(this.transform.y).toBeCloseTo(350, 0);
    });
});

describe('Player test enviroment', () => {
    beforeEach(() => {
        const width = 700;
        const height = 700;
        const radius = 35;
        const initialAngle = 0;
        const side = 20;
        //anchorX, anchorY, radius, angle, side
        this.player = new Player(width / 2, height / 2, radius, initialAngle, side);
        this.player.transform.speed = 0.01;
    });
    it('left movement test', () => {
        this.player.keyDownInput(37); // Pressed left
        this.player.processInput(); // Apply movement
        this.player.transform.calculateNewPosition();
        this.player.processInput(); // Apply movement again
        this.player.transform.calculateNewPosition();
        this.player.keyUpInput(37); // Released left
        expect(this.player.transform.x).toBeCloseTo(384, 0);
        expect(this.player.transform.y).toBeCloseTo(347, 0); // Alguns decimais errado
    });
    it('right movement test', () => {
        this.player.keyDownInput(39); // Pressed right
        this.player.processInput(); // Apply movement
        this.player.transform.calculateNewPosition();
        this.player.processInput(); // Apply movement again
        this.player.transform.calculateNewPosition();
        this.player.keyUpInput(39); // Released right
        expect(this.player.transform.x).toBeCloseTo(384, 0);
        expect(this.player.transform.y).toBeCloseTo(352, 0); // Alguns decimais errado
    });
});

describe('Block test enviroment', () => {
    beforeEach(() => {
        const width = 700;
        const height = 700;
        const spawnRadius = width / 2;
        const angle = 0;
        const blockSpeed = 1;
        this.block = new Block(width / 2, height / 2, spawnRadius, angle, 40, blockSpeed);
    });
    it('movement test', () => {
        for(let i = 0; i < 10; i++){
            this.block.moveTowardsCenter();
            this.block.transform.calculateNewPosition();
        } // 10 frames
        expect(this.block.transform.x).toBeCloseTo(690, 0);
        expect(this.block.transform.y).toBeCloseTo(350, 0);
    });
});
