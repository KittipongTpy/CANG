type Frame = {
  width: number;
  height: number;
};

let currentFrame: Frame | String; // Store the current frame configuration

/**
 * Initializes a frame with the given dimensions.
 * @param command - The command string in the format "INIT <width> <height>"
 */
export function init(command: string): string | Frame {
  const parts = command.trim().split(/\s+/);

  if (parts.length !== 3 || parts[0].toUpperCase() !== "INIT") {
    return "Syntax error: Use INIT <width> <height>";
  }

  const [, widthStr, heightStr] = parts;
  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);

  if (isNaN(width) || isNaN(height)) {
    return "Syntax error: Width/height must be numbers.";
  }
  if (width <= 0 || height <= 0) {
    return "Syntax error: Width/height must be positive";
  }

  currentFrame = { width, height };
  // console.log("Frame initialized:", currentFrame);

  return currentFrame
}

// /**
//  * Gets the current frame configuration.
//  * @returns The current frame or null if not initialized.
//  */
// export function getCurrentFrame(): Frame | null {
//   return currentFrame;
// }
