import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";
// import score from main script
import { score } from "./script.js";

const dinoElem = document.querySelector('[data-dino]');
const JUMP_SPEED = .45;
const GRAVITY = .0015;
const DINO_FRAME_COUNT = 2;
const DINO_STAR_FRAME_COUNT = 8;
const FRAME_TIME = 100;

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity
let starMode
/**
 * The function sets up the initial state of the dinosaur character in a game, including variables for
 * jumping, frame animation, and y velocity, and adds an event listener for the jump action.
 */
export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(dinoElem, "--bottom", 0);
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
}

/**
 * The function updates the dinosaur's movement and jumping based on the given time and speed scale.
 * @param deltaTime - The deltaTime parameter represents the time elapsed since the last frame update.
 * It is typically measured in seconds and is used to calculate smooth and consistent movement
 * regardless of the frame rate.
 * @param speedScale - The speedScale parameter is a value that determines the speed at which the
 * dinosaur moves. It can be used to adjust the speed of the dinosaur based on different factors or
 * game mechanics.
 */
export function updateDino(deltaTime, speedScale) {
  handleRun(deltaTime, speedScale);
  handleJump(deltaTime);
}


/**
 * The function `getDinoRect` returns an object representing the dimensions and position of a dinosaur
 * element with a specified padding percentage.
 * @param paddingPercentage - The `paddingPercentage` parameter is a number that represents the
 * percentage of padding to be applied to the dinosaur element's bounding rectangle. It determines how
 * much space should be added or subtracted from each side of the rectangle.
 * @returns an object with the following properties: top, right, bottom, left, width, and height. These
 * properties represent the coordinates and dimensions of a rectangle that surrounds the dinosaur
 * element, with a specified padding percentage applied.
 */
export function getDinoRect(paddingPercentage) {
  const dinoRect = dinoElem.getBoundingClientRect();
  const paddingX = dinoRect.width * (paddingPercentage / 100);
  const paddingY = dinoRect.height * (paddingPercentage / 100);
  return {
    top: dinoRect.top + paddingY,
    right: dinoRect.right - (paddingX * 2),
    bottom: dinoRect.bottom - paddingY,
    left: dinoRect.left + paddingX,
    width: dinoRect.width - 2 * paddingX,
    height: dinoRect.height - 2 * paddingY
  }
}

/**
 * The function sets the source of an image element to display a losing dinosaur image.
 */
export function setDinoLose() {
  dinoElem.src = `imgs/dino-lose.png`
}

/**
 * The function handles the animation of a running dinosaur character in a game, updating the frame of
 * the animation based on the elapsed time and speed scale.
 * @param deltaTime - The deltaTime parameter represents the time elapsed since the last frame was
 * rendered. It is typically measured in seconds and is used to calculate smooth animations and
 * movements based on the frame rate of the application.
 * @param speedScale - The `speedScale` parameter is a value that determines the speed at which the
 * animation should play. It is used to scale the `deltaTime` value, which represents the time elapsed
 * since the last frame update. By multiplying `deltaTime` with `speedScale`, we can control the speed
 * of
 * @returns nothing (undefined).
 */
function handleRun(deltaTime, speedScale) {
  if (isJumping && !starMode) {
    dinoElem.src = `imgs/dino-stationary.png`
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    if (score < 50) {
      dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
      dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
      currentFrameTime -= FRAME_TIME;
    } else if (score >= 50) {
      dinoFrame = (dinoFrame + 1) % DINO_STAR_FRAME_COUNT;
      dinoElem.src = `imgs/dino-star-${dinoFrame}.png`
      starMode = true; // flag to indicate that the star mode is on
      currentFrameTime -= FRAME_TIME;
    }
  }

  currentFrameTime += deltaTime * speedScale;
}

/**
 * The function handles the jumping behavior of a dinosaur element by updating its position and
 * velocity based on the elapsed time.
 * @param deltaTime - The deltaTime parameter represents the time elapsed since the last frame or
 * update. It is typically measured in seconds and is used to calculate the change in position or
 * velocity over time.
 * @returns If the variable `isJumping` is false, the function will return nothing.
 */
function handleJump(deltaTime) {
  if (!isJumping) return;

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * deltaTime);
  
  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    isJumping = false;
    setCustomProperty(dinoElem, "--bottom", 0);
  }

  yVelocity -= GRAVITY * deltaTime;
}

/**
 * The function "onJump" checks if the spacebar is pressed and the character is not already jumping,
 * and if so, sets the character's vertical velocity to the jump speed and marks the character as
 * jumping.
 * @param e - The parameter "e" is an event object that represents the event that triggered the
 * function. In this case, it is likely an event object related to a key press event.
 * @returns If the condition `e.code !== "Space" || isJumping` is true, then nothing is being returned.
 * If the condition is false, then the function will return undefined.
 */
function onJump(e) {
  if (e.code !== "Space" || isJumping) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
}