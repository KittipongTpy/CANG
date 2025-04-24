type Frame = {
  width: number;
  height: number;
};

let currentFrame: Frame | null = null; // Store the current frame configuration

/**
 * Initializes a frame with the given dimensions.
 * @param command - The command string in the format "INIT <width> <height>"
 */
export function init(command: string): string | null {
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

    if (currentFrame !== null) {
        return "Syntax error: Frame set only once.";
    }
  
    currentFrame = { width, height };
    console.log("Frame initialized:", currentFrame);
    return null;
  }
  

/**
 * Gets the current frame configuration.
 * @returns The current frame or null if not initialized.
 */
export function getCurrentFrame(): Frame | null {
  return currentFrame;
}