const { Engine, Render, Bodies, World, Mouse, MouseConstraint } = Matter;


let walls = []; // Array to keep track of the wall bodies
let ball; // The ball body
const engine = Engine.create();
const world = engine.world;
const canvas = document.getElementById('canvas');

const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// Add mouse control
const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
World.add(world, mouseConstraint);

function createBall(scaledPosition, scaledVelocity) {
    // Remove the existing ball if it exists
    if (ball) {
        World.remove(world, ball);
    }

    // Create a new ball with the same size but at the scaled position
    // Assuming the initial position and velocity are stored or can be calculated
    ball = Bodies.circle(scaledPosition.x, scaledPosition.y, 30, { restitution: 0.9 });

    // Set the velocity of the new ball to the scaled velocity
    Body.setVelocity(ball, scaledVelocity);

    // Add the new ball to the world
    World.add(world, ball);
}
createBall({ x: 100, y: 100 }, { x: 0, y: 0 });

// Function to update the walls
function updateWalls() {
    // Options for the walls; make them static and invisible
    const wallOptions = { isStatic: true, render: { visible: false } };

    // Remove existing walls
    walls.forEach(wall => {
        World.remove(world, wall);
    });

    // Clear the array after removing the walls from the world
    walls = [];

    // Define new walls with updated dimensions
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, wallOptions);
    const ceiling = Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, wallOptions);
    const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, wallOptions);
    const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, wallOptions);

    // Add new walls to the world and the tracking array
    walls.push(ground, ceiling, leftWall, rightWall);
    World.add(world, walls);
}

// Initialize walls
updateWalls();

// Update the walls on window resize
window.addEventListener('resize', function() {

    // Store the ball's position as a fraction of the current window size
    const relativeX = ball.position.x / window.innerWidth;
    const relativeY = ball.position.y / window.innerHeight;
    const relativeVelocityX = ball.velocity.x / window.innerWidth;
    const relativeVelocityY = ball.velocity.y / window.innerHeight;

    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    // Update the walls to match the new canvas size
    updateWalls();

    // Calculate the new position based on the new window dimensions
    const newX = relativeX * window.innerWidth;
    const newY = relativeY * window.innerHeight;

    // Calculate the new velocity based on the new window dimensions
    const newVelocityX = relativeVelocityX * window.innerWidth;
    const newVelocityY = relativeVelocityY * window.innerHeight;

    // This will depend on how you want to scale them relative to the new canvas size
    let scaledPosition = { x: newX, y: newY };
    let scaledVelocity = { x: newVelocityX, y: newVelocityY };
    
    // Remove the old ball and add a new one with the updated properties
    createBall(scaledPosition, scaledVelocity);

    // Ensure the renderer considers the new dimensions
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });
});

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
