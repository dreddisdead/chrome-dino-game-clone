import { setupGround, updateGround } from './ground.js';
import { setupDino, updateDino, getDinoRect, setDinoLose } from './dino.js';
import { setupCactus, updateCactus, getCactusRects } from './cactus.js';

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const startScreenElem = document.querySelector('[data-start-screen]');

setPixelToWorldScale()
window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener("keydown", handleStart, { once: true });

let lastTime
let speedScale
let score
/**
 * The function "update" is a recursive function that updates the game state and handles game logic
 * based on the elapsed time.
 * @param time - The `time` parameter represents the current time in milliseconds. It is used to
 * calculate the time difference between frames and to update the game elements accordingly.
 * @returns nothing (undefined).
 */
function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const deltaTime = time - lastTime;

  updateGround(deltaTime, speedScale);
  updateDino(deltaTime, speedScale);
  updateCactus(deltaTime, speedScale);
  updateSpeedScale(deltaTime);
  updateScore(deltaTime);
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

/**
 * The function checks if the dinosaur collides with any cactus.
 * @returns a boolean value.
 */
function checkLose() {
  const dinoRect = getDinoRect(20);
  return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

/**
 * The function checks if two rectangles collide with each other.
 * @param rect1 - The rect1 parameter represents the first rectangle in the collision check. It should
 * be an object with properties for the left, top, right, and bottom coordinates of the rectangle.
 * @param rect2 - The above code defines a function called `isCollision` that takes two rectangle
 * objects as parameters: `rect1` and `rect2`. The function checks if the two rectangles are colliding
 * with each other.
 * @returns a boolean value indicating whether there is a collision between two rectangles.
 */
function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

/**
 * The function updates the speed scale by increasing it based on the delta time.
 * @param deltaTime - The deltaTime parameter represents the time elapsed since the last update. It is
 * usually measured in seconds.
 */
function updateSpeedScale(deltaTime) {
  speedScale += deltaTime * SPEED_SCALE_INCREASE;
}

/**
 * The function updates the score by adding a calculated value based on the elapsed time.
 * @param deltaTime - The deltaTime parameter represents the time difference between the current frame
 * and the previous frame. It is usually measured in seconds and is used to calculate the score
 * increment based on the elapsed time.
 */
function updateScore(deltaTime) {
  score += deltaTime * .01;
  scoreElem.textContent = Math.floor(score);
}

/**
 * The function "handleStart" sets up the game environment and starts the game loop.
 */
function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDino();
  setupCactus();
  startScreenElem.classList.add('hide');
  window.requestAnimationFrame(update);

}

/**
 * The function "handleLose" sets the dinosaur to a losing state, then shows the start screen after a
 * delay of 100 milliseconds.
 */
function handleLose() {
  setDinoLose();
  setTimeout(() => {
    startScreenElem.classList.remove('hide');
    document.addEventListener("keydown", handleStart, { once: true });
  }, 100);
}

/**
 * The function sets the width and height of an element based on the scale between the window size and
 * the desired world size.
 */
function setPixelToWorldScale() {
  let worldToPixelScale
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) 
  {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}

// export score variable
export { score };

