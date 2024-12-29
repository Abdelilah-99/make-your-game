# Tetris Game Project

A modern implementation of the classic Tetris game using JavaScript, HTML, and CSS.

## Team Members
- Ayoub Lahmami
- Yassin Kharkhach
- Abdelilah Bouchikhi

## Features

- Classic Tetris gameplay mechanics
- Life system (3 lives)
- Score tracking system
- Time limit of 3 minutes per life
- FPS counter
- Pause/Resume functionality
- Game over screen with final score

## Controls

- **←** (Left Arrow): Move piece left
- **→** (Right Arrow): Move piece right
- **↓** (Down Arrow): Move piece down
- **↑** (Up Arrow): Rotate piece
- **Space**: Drop piece instantly
- **P**: Pause game
- **C**: Continue game (when paused)

## Game Rules

1. Players start with 3 lives
2. Each life has a 3-minute time limit
3. Points are awarded for:
   - Moving pieces down (1 point)
   - Completing lines (100 points)
   - Quick drops (points based on drop distance)
4. Game ends when all lives are lost or time runs out

## Technical Features

- Responsive grid-based game board (20x10)
- Seven different Tetris pieces with unique colors
- Collision detection system
- Line clearing mechanism
- Smooth piece rotation with border detection
- Frame-rate-independent game loop
- DOM element caching for performance

## Game Pieces

1. Square (Red)
2. Z-Shape (Blue)
3. S-Shape (Green)
4. I-Shape (Yellow)
5. L-Shape (Orange)
6. Reverse L-Shape (Purple)
7. T-Shape (Cyan)

## How to Run

1. Clone the repository
2. Open the HTML file in a modern web browser
3. Click "Start Game" to begin playing

## Future Improvements

- High score system
- Different difficulty levels
- Sound effects and background music
- Mobile touch controls
- Multiplayer support

## License

Feel free to use and modify the code while providing appropriate attribution to the team members.