let stopSprite, walkSprite, walk2Sprite;
const STOP_FRAMES = 5;
const STOP_TOTAL_W = 155;
const STOP_TOTAL_H = 27;
const STOP_W = STOP_TOTAL_W / STOP_FRAMES;
const STOP_H = STOP_TOTAL_H;

const WALK_FRAMES = 8;
const WALK_TOTAL_W = 235;
const WALK_TOTAL_H = 23;
const WALK_W = WALK_TOTAL_W / WALK_FRAMES;
const WALK_H = WALK_TOTAL_H;

// walk2 現在為 9 幀，圖檔尺寸 265x25（9 張圖片）
const WALK2_FRAMES = 9;
const WALK2_TOTAL_W = 265;
const WALK2_TOTAL_H = 25;
const WALK2_W = WALK2_TOTAL_W / WALK2_FRAMES;
const WALK2_H = WALK2_TOTAL_H;

const ANIM_FPS = 8; // 可調整動畫速度
const MOVE_SPEED = 200; // 像素/秒，按鍵時的移動速度

let posX, posY; // 角色中心位置

function preload() {
  // 預載入三組精靈圖，避免切換時閃爍
  stopSprite = loadImage('1/stop/stop.png');
  walkSprite = loadImage('1/walk/walk.png');
  walk2Sprite = loadImage('1/walk2/walk2.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noSmooth(); // 若要保持像素化可開啟
  posX = width / 2;
  posY = height / 2;
}

function draw() {
  background('#f5ebe0');

  // 判斷按鍵：左優先（按左則走左），否則若按右則走右，否則停住
  const usingLeft = keyIsDown(LEFT_ARROW);
  const usingRight = keyIsDown(RIGHT_ARROW);

  let frames, spriteImg, singleW, singleH;
  let movingLeft = false;
  let movingRight = false;

  if (usingLeft) {
    frames = WALK2_FRAMES;
    spriteImg = walk2Sprite;
    singleW = WALK2_W;
    singleH = WALK2_H;
    movingLeft = true;
  } else if (usingRight) {
    frames = WALK_FRAMES;
    spriteImg = walkSprite;
    singleW = WALK_W;
    singleH = WALK_H;
    movingRight = true;
  } else {
    frames = STOP_FRAMES;
    spriteImg = stopSprite;
    singleW = STOP_W;
    singleH = STOP_H;
  }

  // 計算當前幀
  const frameDurationMs = 1000 / ANIM_FPS;
  const frameIndex = floor(millis() / frameDurationMs) % frames;

  // 依畫面大小縮放角色
  const scale = min(windowWidth, windowHeight) / 8 / singleH;
  const drawW = singleW * scale;
  const drawH = singleH * scale;
  const halfDrawW = drawW / 2;

  // 移動（使用 deltaTime 讓速度與幀率無關）
  if (movingLeft) {
    posX -= MOVE_SPEED * (deltaTime / 1000);
  } else if (movingRight) {
    posX += MOVE_SPEED * (deltaTime / 1000);
  }

  // 限制角色不會移出畫布
  posX = constrain(posX, halfDrawW, width - halfDrawW);
  posY = height / 2; // 維持垂直置中

  // 從精靈圖取出當前幀並繪製在畫布
  const sx = frameIndex * singleW;
  image(spriteImg, posX, posY, drawW, drawH, sx, 0, singleW, singleH);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  posY = height / 2;
  // 也要確保在 resize 後仍在畫面內
  const conservativeScale = min(windowWidth, windowHeight) / 8 / STOP_H;
  const conservativeHalfW = (STOP_W * conservativeScale) / 2;
  posX = constrain(posX, conservativeHalfW, width - conservativeHalfW);
}
