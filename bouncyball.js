const { Engine, Render, Bodies, World, Mouse, MouseConstraint } = Matter;


let walls = []; // Array to keep track of the wall bodies
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

// Create circle
const circle = Bodies.circle(100, 100, 30, { restitution: 0.9 });
World.add(world, circle);

// Add mouse control
const mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
World.add(world, mouseConstraint);


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
    const relativeX = circle.position.x / window.innerWidth;
    const relativeY = circle.position.y / window.innerHeight;

    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    // Update the walls to match the new canvas size
    updateWalls();

    // Calculate the new position based on the new window dimensions
    const newX = relativeX * window.innerWidth;
    const newY = relativeY * window.innerHeight;
    
    // Set the ball's position to the new calculated position
    Matter.Body.setPosition(circle, { x: newX, y: newY });

    // Ensure the renderer considers the new dimensions
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });
});

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
