//import Phaser from "phaser";

class HomeScene extends Phaser.Scene {
  constructor() {
    super("HomeScene");
    this.humidity = 0;
    this.plantState = 1; // Start with sad plant
    this.stateTimer = 0;
  }

  preload() {
    this.load.image("wateringCan", "/watering_can.png");
    this.load.image("droplet", "droplet.png");
    this.load.image("deadPlant", "sad_plant.png");
    this.load.image("lessDeadPlant", "mid_plant.png");
    this.load.image("happyPlant", "happy_plant.png");
  }

  create() {
    // Setup plant sprites
    this.deadPlant = this.add.image(400, 450, "deadPlant");
    this.lessDeadPlant = this.add
      .image(400, 450, "lessDeadPlant")
      .setVisible(false);
    this.happyPlant = this.add.image(400, 450, "happyPlant").setVisible(false);

    // Add watering can sprite
    this.wateringCan = this.add.image(300, 200, "wateringCan");

    // Create particle emitter for water droplets
    const particles = this.add.particles('droplet');
    this.emitter = particles.createEmitter({
      x: 400,
      y: 150,
      speedY: { min: 100, max: 200 },
      speedX: { min: -20, max: 20 },
      gravityY: 300,
      lifespan: 1500,
      quantity: 2,
      frequency: 50,
      on: false  // Replace emitting: false with on: false
    });

    // Create splash emitter
    const splashParticles = this.add.particles('droplet');
    this.splashEmitter = splashParticles.createEmitter({
      x: 400,
      y: 430,
      speedY: { min: -20, max: -10 },
      speedX: { min: -70, max: 70 },
      gravityY: 300,
      scale: { start: 0.5, end: 0.1 },
      lifespan: 600,
      quantity: 2,
      frequency: 50,
      on: false  // Replace emitting: false with on: false
    });

    // Setup input handling
    this.input.on("pointerdown", this.startWatering, this);

    // Start with state 1
    this.updatePlantState(1);
  }

  startWatering() {
    // Progress through states
    const nextState = this.plantState < 4 ? this.plantState + 1 : 1;
    this.updatePlantState(nextState);
  }

  updatePlantState(newState) {
    this.plantState = newState;

    // Reset all visual elements
    this.wateringCan.angle = 0;
    this.wateringCan.setPosition(300, 200);
    this.emitter.stop();
    this.splashEmitter.stop();
    this.deadPlant.setVisible(false);
    this.lessDeadPlant.setVisible(false);
    this.happyPlant.setVisible(false);

    // Setup the current state
    switch (newState) {
      case 1: // Sad plant, can mid-air stationary
        this.deadPlant.setVisible(true);
        this.humidity = 10; // Very low humidity
        break;

      case 2: // Water falling but not hitting, mid-happy plant
        this.lessDeadPlant.setVisible(true);
        this.humidity = 30;

        // Tilt watering can
        this.wateringCan.angle = -30;
        this.wateringCan.setPosition(400, 150);

        // Start water emitter
        this.emitter.setPosition(430, 170);
        this.emitter.start();
        break;

      case 3: // Water hits plant, not splashing, mid-happy plant
        this.lessDeadPlant.setVisible(true);
        this.humidity = 60;

        // Tilt watering can
        this.wateringCan.angle = -30;
        this.wateringCan.setPosition(400, 150);

        // Start water emitter with direct path to plant
        this.emitter.setPosition(430, 170);
        this.emitter.start();

        // Adjust droplet path to hit plant precisely
        this.emitter.setSpeedY({ min: 200, max: 250 });
        this.emitter.setSpeedX({ min: -10, max: 10 });
        break;

      case 4: // Water hits plant, splashing, happy plant
        this.happyPlant.setVisible(true);
        this.humidity = 90;

        // Watering can returns to stationary position
        this.wateringCan.setPosition(300, 200);

        // Show water already falling (not coming from can)
        this.emitter.setPosition(400, 300);
        this.emitter.start();

        // Add splash effect
        this.splashEmitter.start();

        // Set a timer to stop the water after a moment
        this.time.delayedCall(2000, () => {
          this.emitter.stop();
          this.splashEmitter.stop();
        });
        break;
    }

    // Update humidity display
    this.updateHumidityDisplay();
  }

  updateHumidityDisplay() {
    // Clean up existing text if it exists
    if (this.humidityText) {
      this.humidityText.destroy();
    }

    // Create humidity text
    this.humidityText = this.add.text(20, 20, `Humidity: ${this.humidity}%`, {
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: {
        x: 10,
        y: 5,
      },
    });
  }

  update(time, delta) {
    // Check if water droplets are hitting the plant in state 3
    if (this.plantState === 3) {
      this.stateTimer += delta;
      if (this.stateTimer > 3000) {
        // After 3 seconds in state 3
        this.stateTimer = 0;
        this.updatePlantState(4); // Move to state 4 (splashing)
      }
    }
  }
}

// export default HomeScene;
window.HomeScene = HomeScene;