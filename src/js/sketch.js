// Declare global variables
let cam;              // Webcam capture
let canvasElement;    // Canvas element
let w, h;             // Width and height of the camera feed
let bg;               // Graphics buffer for drawing

// Noise parameters
const ns = 60;        // Noise scale for spatial variation
const nss = 150;      // Noise scale for temporal variation
const ni = 6;         // Noise intensity multiplier

/**
 * Setup function runs once when the program starts
 * Initializes the webcam and canvas
 */
function setup() {
    // Create and hide the webcam capture
    cam = createCapture(VIDEO);
    cam.hide();

    // Create a canvas that fills the window
    canvasElement = createCanvas(windowWidth, windowHeight);

    // Set initial background to black
    background(0);
}

// Variables for pixel color values
let i, r, g, b;

/**
 * Draw function runs continuously in a loop
 * Processes the webcam feed with visual effects
 */
function draw() {
    // Create a semi-transparent black background for trail effect
    background(0, 25);

    // Wait until camera is loaded
    if (cam.width > 0) {
        w = cam.width;
        h = cam.height;
    }

    // Set parameters based on camera orientation
    let sz, space, walk, spd;
    if (w > h) {
        // Landscape orientation
        sz = 5;        // Size of particles
        space = 1;     // Space between particles
        walk = 30;     // Orbital distance
        spd = 35;      // Animation speed
    } else {
        // Portrait orientation
        sz = 5;
        space = 5;
        walk = 15;
        spd = 5;
    }

    // Create graphics buffer for off-screen rendering
    bg = createGraphics(w - (walk * 2), h - (walk * 2));
    bg.noStroke();

    // Calculate dimensions for maintaining aspect ratio
    let nW, nH, oX, oY;
    if (width / height >= w / h) {
        // Window is wider than camera aspect ratio
        nW = width;
        nH = width / (w / h);
        oX = 0;
        oY = (height - nH) / 2;
    } else {
        // Window is taller than camera aspect ratio
        nW = height * (w / h);
        nH = height;
        oX = (width - nW) / 2;
        oY = 0;
    }

    // Load pixel data from webcam
    cam.loadPixels();

    // Loop through pixels at intervals to create particles
    for (let x = 0; x < w; x += sz + space) {
        for (let y = 0; y < h; y += sz + space) {
            // Calculate pixel index and get RGB values
            i = ((y * w) + x) * 4;
            r = cam.pixels[i];
            g = cam.pixels[i + 1];
            b = cam.pixels[i + 2];
            
            // Set fill color based on pixel color
            bg.fill(r, g, b);
            
            // Calculate orbital movement
            let orbitX = sin(frameCount / spd) * walk;
            let orbitY = cos(frameCount / spd) * walk;
            
            // Add noise-based displacement
            let nx = noise(x / ns, y / ns) * noise(frameCount / nss) * ni;
            let ny = noise(y / ns, x / ns) * noise(frameCount / nss) * ni;
            
            // Draw the particle (ellipse)
            bg.ellipse((x - walk) + (orbitX * nx), (y - walk) + (orbitY * ny), sz, sz);
        }
    }

    // Draw the processed image to the canvas
    // Use push/pop to apply transformations only to this image
    push();
    // Flip horizontally to create mirror effect
    translate(width, 0);
    scale(-1, 1);
    // Draw the graphics buffer to screen
    image(bg, oX, oY, nW, nH);
    pop();
}

/**
 * Handle window resizing
 * Resizes the canvas to match the new window dimensions
 */
function windowResized() {
    canvasElement = createCanvas(windowWidth, windowHeight);
}

/**
 * Handle mouse clicks
 * Toggles fullscreen mode when the user clicks
 */
function mousePressed() {
    if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
        let fs = fullscreen();
        fullscreen(!fs);
    }
}

