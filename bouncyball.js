const { Engine, Render, Bodies, World, Mouse, MouseConstraint } = Matter;

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

// Keep the canvas full screen
window.addEventListener('resize', function() {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
});

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
