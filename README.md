# Flow Mirror

A creative webcam visualization that transforms your camera feed into dynamic, flowing particles. This interactive sketch uses p5.js to create an organic, responsive experience that reacts to color and movement.

![Flow Mirror Preview](.src/assets/images/pixel-me.png)

## Overview

Flow Mirror captures your webcam input and transforms it into a constellation of colorful particles that orbit and flow with natural, organic movement. The visualization maintains the colors from your camera feed while adding mesmerizing motion through perlin noise algorithms.

## Features

- **Responsive Design**: Automatically adapts to any screen size and orientation
- **Organic Movement**: Uses perlin noise for natural, flowing animation patterns
- **Color Extraction**: Preserves the color palette from your webcam input
- **Performance Optimized**: Samples pixels at intervals for smooth performance
- **Fullscreen Support**: Click anywhere to toggle fullscreen mode
- **Mirror Effect**: Horizontally flips the input for a more intuitive experience

## Quick Start

1. Clone this repository
2. Open `index.html` in a web browser that supports webcam access
3. Allow camera access when prompted
4. Click anywhere to toggle fullscreen mode

## Customization

The sketch is designed to be easily customizable. Here are some parameters you can modify in `sketch.js` to create different visual effects:

### Particle System

```javascript
// In the draw() function, modify these values:
sz = 5;        // Size of particles (smaller = more detailed, larger = more abstract)
space = 1;     // Space between particles (smaller = denser, larger = sparser)
```

### Motion Controls

```javascript
// Adjust these constants at the top of the file:
const ns = 60;    // Noise scale for spatial variation (smaller = more chaotic, larger = smoother)
const nss = 150;  // Noise scale for temporal variation (affects animation speed)
const ni = 8;     // Noise intensity multiplier (higher = more dramatic movement)

// In the draw() function:
walk = 30;     // Orbital distance (higher = more movement range)
spd = 35;      // Animation speed (lower = faster)
```

### Visual Effects

```javascript
// In the draw() function:
background(0, 25);  // Controls the trail effect (second parameter: lower = longer trails)

// Try different shapes instead of ellipses:
// bg.ellipse(...) can be changed to:
// bg.rect(...) for square particles
// Or create custom shapes with bg.beginShape(), bg.vertex(), bg.endShape()
```

### Orientation-Specific Settings

The code automatically detects whether your camera is in landscape or portrait orientation and adjusts parameters accordingly. You can customize each mode separately:

```javascript
if (w > h) {
    // Landscape orientation settings
    sz = 5;
    space = 1;
    walk = 30;
    spd = 35;
} else {
    // Portrait orientation settings
    sz = 5;
    space = 5;
    walk = 15;
    spd = 5;
}
```

## Advanced Customization Ideas

- **Color Manipulation**: Add filters or transformations to the RGB values
- **Multiple Particle Types**: Create different types of particles based on brightness or position
- **Audio Reactivity**: Add p5.sound to make particles react to music or microphone input
- **Interactive Elements**: Add mouse interaction to affect the flow of particles
- **Custom Shaders**: Replace the particle system with GLSL shaders for more complex effects

## Technical Details

Flow Mirror uses several key techniques:

1. **Pixel Sampling**: Instead of processing every pixel, it samples the webcam feed at regular intervals for better performance
2. **Off-screen Rendering**: Uses a graphics buffer for efficient rendering
3. **Perlin Noise**: Creates organic movement with coherent randomness
4. **Aspect Ratio Preservation**: Maintains the correct proportions regardless of window size

## Requirements

- A modern web browser with webcam support
- p5.js library (included via CDN)

## License

[MIT License](LICENSE)

## Acknowledgements

This project uses [p5.js](https://p5js.org/), a JavaScript library for creative coding.

## Contact

For questions, feedback, or collaboration opportunities, please open an issue on this repository or reach out directly.

---

Happy coding and creating!