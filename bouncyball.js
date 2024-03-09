const { Engine, Render, Bodies, World, Mouse, MouseConstraint, Composite } = Matter;

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
    Composite.remove(world, Composite.allBodies(world).filter(body => body.label === 'Wall'));

    // Add new walls with updated dimensions
    const walls = [
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { ...wallOptions, label: 'Wall' }),
        Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, { ...wallOptions, label: 'Wall' }),
        Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, { ...wallOptions, label: 'Wall' }),
        Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { ...wallOptions, label: 'Wall' })
    ];
    World.add(world, walls);
}

// Initialize walls
updateWalls();

// Update the walls on window resize
window.addEventListener('resize', function() {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    // Update the walls to match the new canvas size
    updateWalls();

    // Ensure the renderer considers the new dimensions
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: window.innerWidth, y: window.innerHeight }
    });
});

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
