type Frame = {
  width: number;
  height: number;
};

let currentFrame: Frame | null = null; // Store the current frame configuration

/**
 * Initializes a frame with the given dimensions.
 * @param command - The command string in the format "INIT <width> <height>"
 */
export function init(command: string): void {
  const parts = command.trim().split(/\s+/);

  // Validate the command structure
  if (parts.length !== 3 || parts[0].toUpperCase() !== "INIT") {
    console.error("Invalid command syntax. Expected: INIT <width> <height>");
    return;
  }

  const [, widthStr, heightStr] = parts;

  // Parse width and height
  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);

  if (isNaN(width) || isNaN(height)) {
    console.error("Invalid parameters. Width and height must be numbers.");
    return;
  }

  // Set the current frame
  currentFrame = { width, height };
  console.log("Frame initialized:", currentFrame);
}

/**
 * Gets the current frame configuration.
 * @returns The current frame or null if not initialized.
 */
export function getCurrentFrame(): Frame | null {
  return currentFrame;
}