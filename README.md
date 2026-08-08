# Traffic Light Simulation

A simple browser-based simulation of a car approaching a traffic light, built with plain HTML5 Canvas and vanilla JavaScript — no frameworks, no dependencies.

The simulation demonstrates a moving car interacting with a traffic light. The car checks the signal at a checkpoint and either continues through the intersection or stops until the signal turns green.

## Features

* Animated car movement
* Automatic traffic light switching
* Red and green signal states
* Checkpoint detection
* Car stops at the checkpoint when the light is red
* Car continues when the light turns green
* Car restarts its journey after leaving the screen
* Real-time simulation status
* Traffic light countdown timer
* Responsive canvas layout

## Technologies Used

* **HTML5** — Page structure
* **CSS3** — Styling and layout
* **JavaScript** — Simulation logic and animation
* **HTML Canvas API** — Drawing the road, car, traffic light, and environment

## Project Structure

```text
Traffic-Light-Simulation/
│
├── index.html
├── style.css
├── script.js
├── LICENSE
└── README.md
```

## How to Run

### Method 1 — Open Directly

1. Clone or download the repository.
2. Open the project folder.
3. Double-click `index.html`.
4. The simulation will start in your browser.

### Method 2 — Using VS Code

1. Open the project folder in **Visual Studio Code**.
2. Open `index.html`.
3. Use the **Live Server** extension.
4. Click **Go Live**.
5. The simulation will open in your browser.

## Simulation Flow

```text
              ┌───────────────┐
              │  Car Starts   │
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │ Approach      │
              │ Checkpoint    │
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │ Check Signal  │
              └───────┬───────┘
                 ┌────┴────┐
                 ↓         ↓
              GREEN       RED
                 ↓         ↓
                GO        STOP
                 ↓         ↓
                 │      Wait for
                 │       Green
                 │         ↓
                 └────┬────┘
                      ↓
              ┌───────────────┐
              │ Cross         │
              │ Checkpoint    │
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │ Keep Driving  │
              └───────┬───────┘
                      ↓
              ┌───────────────┐
              │ Leave Screen  │
              └───────┬───────┘
                      ↓
                 New Journey
```

## Canvas

The simulation is rendered using the HTML5 Canvas API.

The canvas contains:

* Sky/background
* Road
* Grass
* Center road marking
* Checkpoint line
* Traffic light
* Traffic light pole
* Moving car
* Car wheels, roof, windshield, and headlight

## Configuration

The main simulation values can be modified in `script.js`.

For example:

```javascript
const CAR_SPEED = 2.5;
const INTERVAL = 5000;
const CHECKPOINT = 555;
```

### Change Car Speed

Increase the value:

```javascript
const CAR_SPEED = 5;
```

to make the car move faster.

### Change Traffic Light Interval

The value:

```javascript
const INTERVAL = 5000;
```

represents **5000 milliseconds (5 seconds)**.

For a 10-second interval:

```javascript
const INTERVAL = 10000;
```

## License

This project is open-source and available for learning and educational purposes.

---

⭐ If you found this project useful, consider giving the repository a star!
