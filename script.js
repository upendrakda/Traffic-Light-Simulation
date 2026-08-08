// ── 1. CANVAS SETUP ─────────────────────────────────────────

const canvas = document.getElementById('simCanvas');
const ctx    = canvas.getContext('2d');

// Set the actual pixel dimensions of the canvas
canvas.width  = 800;
canvas.height = 300;

// Shortcuts so we don't repeat canvas.width everywhere
const W = canvas.width;
const H = canvas.height;


// ── 2. CONSTANTS ────────────────────────────────────────────

const ROAD_TOP    = 155;   // y where road starts
const ROAD_BOT    = 255;   // y where road ends
const CHECKPOINT  = 480;   // x of the stop line
const LIGHT_X     = 645;   // x-centre of the traffic light
const LIGHT_Y     = 35;    // y of the top of the light box
const CAR_W       = 90;    // car width
const CAR_H       = 36;    // car body height
const CAR_Y       = ROAD_TOP + 18; // car sits on the road
const CAR_SPEED   = 2.5;   // pixels per frame
const INTERVAL    = 5000;  // ms between light changes (5 sec)

// Natural, realistic palette — sky, asphalt, grass, and a classic red car
const COLORS = {
  sky:          '#87ceeb',  // sky blue
  ground:       '#4a7c3f',  // grass green
  road:         '#4a4a4a',  // asphalt grey
  roadLine:     '#f2d43d',  // yellow lane markings (like real roads)
  grass:        '#4a7c3f',  // matches ground for a continuous lawn
  checkpoint:   '#ffffff',  // white stop line
  lightPole:    '#5c5c5c',  // steel grey pole
  lightHousing: '#2b2b2b',  // dark housing
  lightBorder:  '#1a1a1a',
  redOn:        '#e8281b',
  redOff:       '#5c1a15',
  greenOn:      '#2fa84f',
  greenOff:     '#164423',
  carBody:      '#c0281f',  // classic red car
  carBodyEdge:  '#8f1e17',
  carRoof:      '#a5221b',
  windshield:   '#cfe8f5',  // pale sky-tinted glass
  headlight:    '#fff6b0',
  wheelOuter:   '#1c1c1c',
  wheelInner:   '#8a8a8a',
};


// ── 3. STATE ────────────────────────────────────────────────

let lightColor = Math.random() < 0.5 ? 'RED' : 'GREEN';
let carX       = 50;
let carChecked = false;      // did car check the light at checkpoint?
let carAction  = 'DRIVING';  // DRIVING | GO | STOP
let lastChange = performance.now();


// ── 4. HUD UPDATER ──────────────────────────────────────────

const elLight     = document.getElementById('lightStatus');
const elCar       = document.getElementById('carStatus');
const elCountdown = document.getElementById('countdown');

function updateHUD(now) {
  // light badge
  elLight.textContent = lightColor;
  elLight.className   = 'badge ' + (lightColor === 'RED' ? 'red' : 'green');

  // car badge
  elCar.textContent = carAction;
  elCar.className   = 'badge ' +
    (carAction === 'GO'   ? 'green' :
     carAction === 'STOP' ? 'red'   : 'neutral');

  // countdown
  const secs = Math.ceil((INTERVAL - (now - lastChange)) / 1000);
  elCountdown.textContent = Math.max(secs, 0) + 's';
  elCountdown.className   = 'badge neutral';
}


// ── 5. DRAW HELPERS ─────────────────────────────────────────

// Draw a filled (and optionally stroked) rounded rectangle
function fillRoundRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h,     x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y,         x + r, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Draw a filled circle
function fillCircle(cx, cy, r, color) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// Draw a stroked circle (ring outline)
function strokeCircle(cx, cy, r, color, lineW) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth   = lineW;
  ctx.stroke();
}


// ── 6. SCENE DRAWERS ────────────────────────────────────────

function drawBackground() {
  // sky
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, W, ROAD_TOP);
  // below road (ground)
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, ROAD_BOT, W, H - ROAD_BOT);
}

function drawRoad() {
  // road surface
  ctx.fillStyle = COLORS.road;
  ctx.fillRect(0, ROAD_TOP, W, ROAD_BOT - ROAD_TOP);

  // grass strips
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, ROAD_BOT, W, H - ROAD_BOT);

  // dashed centre line
  const midY = (ROAD_TOP + ROAD_BOT) / 2;
  ctx.strokeStyle = COLORS.roadLine;
  ctx.lineWidth   = 3;
  ctx.setLineDash([30, 20]);
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(W, midY);
  ctx.stroke();
  ctx.setLineDash([]);   // reset to solid
}

function drawCheckpoint() {
  // white stop line
  ctx.strokeStyle = COLORS.checkpoint;
  ctx.lineWidth   = 4;
  ctx.beginPath();
  ctx.moveTo(CHECKPOINT, ROAD_TOP);
  ctx.lineTo(CHECKPOINT, ROAD_BOT);
  ctx.stroke();

  // label above the line
  ctx.fillStyle  = '#ffffff';
  ctx.font       = 'bold 12px Segoe UI';
  ctx.textAlign  = 'center';
  ctx.fillText('CHECKPOINT', CHECKPOINT, ROAD_TOP - 8);
}

function drawTrafficLight() {
  const cx = LIGHT_X;   // horizontal centre of the light

  // pole
  ctx.fillStyle = COLORS.lightPole;
  ctx.fillRect(cx - 4, LIGHT_Y + 80, 8, 55);

  // black housing box
  fillRoundRect(cx - 20, LIGHT_Y, 40, 78, 6, COLORS.lightHousing, COLORS.lightBorder);

  // red bulb (top) — bright when RED, dark otherwise
  const redColor   = lightColor === 'RED'   ? COLORS.redOn   : COLORS.redOff;
  const greenColor = lightColor === 'GREEN' ? COLORS.greenOn : COLORS.greenOff;

  fillCircle(cx, LIGHT_Y + 22, 13, redColor);
  fillCircle(cx, LIGHT_Y + 57, 13, greenColor);
}

function drawCar(x) {
  const y = CAR_Y;

  // body
  fillRoundRect(x, y, CAR_W, CAR_H, 6, COLORS.carBody, COLORS.carBodyEdge);

  // roof
  fillRoundRect(x + 14, y - 20, CAR_W - 28, 22, 5, COLORS.carRoof, COLORS.carBodyEdge);

  // windshield (semi-transparent)
  ctx.globalAlpha = 0.7;
  fillRoundRect(x + 16, y - 18, CAR_W - 32, 18, 3, COLORS.windshield, null);
  ctx.globalAlpha = 1.0;

  // headlight
  ctx.fillStyle = COLORS.headlight;
  ctx.fillRect(x + CAR_W - 8, y + 8, 8, 10);

  // wheels
  fillCircle(x + 16,         y + CAR_H + 2, 11, COLORS.wheelOuter);
  fillCircle(x + CAR_W - 18, y + CAR_H + 2, 11, COLORS.wheelOuter);
  fillCircle(x + 16,         y + CAR_H + 2,  5, COLORS.wheelInner);
  fillCircle(x + CAR_W - 18, y + CAR_H + 2,  5, COLORS.wheelInner);
}


// ── 7. MAIN LOOP ────────────────────────────────────────────
// The browser calls this function automatically ~60 times/sec.

function loop(now) {

  // a) Toggle the light every INTERVAL ms
  if (now - lastChange >= INTERVAL) {
    lightColor = (lightColor === 'RED') ? 'GREEN' : 'RED';
    lastChange = now;
  }

  // b) Car logic
  const carFront = carX + CAR_W;   // x-position of the car's front

  // When front reaches the checkpoint for the first time → check light
  if (carFront >= CHECKPOINT && !carChecked) {
    carChecked = true;
    carAction  = (lightColor === 'GREEN') ? 'GO' : 'STOP';
  }

  // If the car is waiting at a red light and the light turns green,
  // release it so it keeps driving instead of waiting forever.
  if (carAction === 'STOP' && lightColor === 'GREEN') {
    carAction = 'GO';
  }

  if (carAction === 'STOP') {
    carX = CHECKPOINT - CAR_W;   // freeze car before the line
  } else {
    carX += CAR_SPEED;            // move forward
  }

  // Reset when car exits the right edge
  if (carX > W + 20) {
    carX       = -CAR_W;
    carChecked = false;
    carAction  = 'DRIVING';
  }

  // c) Draw everything (order matters — later draws appear on top)
  drawBackground();
  drawRoad();
  drawCheckpoint();
  drawTrafficLight();
  drawCar(carX);

  // d) Update the HTML info badges
  updateHUD(now);

  // e) Schedule the next frame
  requestAnimationFrame(loop);
}

// Start!
requestAnimationFrame(loop);