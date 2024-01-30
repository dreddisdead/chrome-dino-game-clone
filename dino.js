import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const dinoElem = document.querySelector('[data-dino]');
const JUMP_SPEED = .45;
const GRAVITY = .0015;
const DINO_FRAME_COUNT = 2;
const FRAME_TIME = 100;

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity
export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(dinoElem, "--bottom", 0);
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
}

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

export function setDinoLose() {
  dinoElem.src = `imgs/dino-lose.png`
}

function handleRun(deltaTime, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/dino-stationary.png`
    return;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = `imgs/dino-run-${dinoFrame}.png`
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += deltaTime * speedScale;
}

function handleJump(deltaTime) {
  if (!isJumping) return;

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * deltaTime);
  
  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    isJumping = false;
    setCustomProperty(dinoElem, "--bottom", 0);
  }

  yVelocity -= GRAVITY * deltaTime;
}

function onJump(e) {
  if (e.code !== "Space" || isJumping) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
}