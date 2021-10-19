export const CONSTANTS = {
  gridSize: 20,
  tileSizeMultiplier: 0.9,
  get tileSize() {
    return this.gridSize * this.tileSizeMultiplier;
  }
};

export interface Velocity {
  x: number;
  y: number;
}

export interface GameState {
  playerPosition: { x: number; y: number };
  applePosition: {
    x: number;
    y: number;
  };
  trail: { x: number; y: number }[];
  tailSize: number;
}

export const initialGameState = {
  playerPosition: { x: CONSTANTS.gridSize / 2, y: CONSTANTS.gridSize / 2 },
  applePosition: {
    x: Math.floor(Math.random() * CONSTANTS.tileSize),
    y: Math.floor(Math.random() * CONSTANTS.tileSize)
  },
  trail: [{ x: 10, y: 10 }],
  tailSize: 5
};

export enum DifficultyMultiplier {
  EASY = 0.95,
  MEDIUM = 0.9,
  HARD = 0.8
}

const START_FPS = 6;

export const startGame = (
  difficulty: DifficultyMultiplier,
  fps: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  onUpdate = (newGameState: GameState) => {}
) => {
  let velocity = {
    x: 0,
    y: 0
  };
  const setVelocity = (newVelocity: Velocity) => {
    velocity = newVelocity;
  };
  // start with 5 fps
  let frameInterval = 1000 / START_FPS;
  let then = Date.now();
  // to be used by the render loop
  let mutableGameState = { ...initialGameState };

  const animate = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    onUpdate: (newState: GameState) => void
  ) => {
    // render loop control
    requestAnimationFrame(() => animate(canvas, ctx, onUpdate));
    const now = Date.now();
    const elapsed = now - then;
    if (elapsed > frameInterval) {
      then = now - (elapsed % frameInterval);

      // animation
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const {
        playerPosition: { x: px, y: py },
        trail,
        applePosition: { x: ax, y: ay },
        tailSize
      } = mutableGameState;

      const newPlayerPosition = {
        x: px + velocity.x,
        y: py + velocity.y
      };

      if (newPlayerPosition.x < 0) {
        newPlayerPosition.x = CONSTANTS.gridSize - 1;
      }
      if (newPlayerPosition.x > CONSTANTS.gridSize - 1) {
        newPlayerPosition.x = 0;
      }
      if (newPlayerPosition.y < 0) {
        newPlayerPosition.y = CONSTANTS.gridSize - 1;
      }
      if (newPlayerPosition.y > CONSTANTS.gridSize - 1) {
        newPlayerPosition.y = 0;
      }

      ctx.fillStyle = "lime";
      let newTailSize = tailSize;
      for (var i = 0; i < trail.length; i++) {
        ctx.fillRect(
          trail[i].x * CONSTANTS.gridSize,
          trail[i].y * CONSTANTS.gridSize,
          CONSTANTS.tileSize,
          CONSTANTS.tileSize
        );
        if (
          trail[i].x === newPlayerPosition.x &&
          trail[i].y === newPlayerPosition.y
        ) {
          newTailSize = 5;
          frameInterval = 1000 / START_FPS;
        }
      }

      const isOnApple =
        ax === newPlayerPosition.x && ay === newPlayerPosition.y;
      if (isOnApple) {
        // grow tail
        newTailSize++;
        // speed up
        frameInterval *= difficulty;
      }

      const newGameState = {
        playerPosition: newPlayerPosition,
        trail:
          JSON.stringify(trail[trail.length - 1]) !==
          JSON.stringify(newPlayerPosition)
            ? trail
                .concat(newPlayerPosition)
                .slice(-newTailSize)
            : trail,
        applePosition: isOnApple
          ? {
              x: Math.floor(Math.random() * CONSTANTS.gridSize),
              y: Math.floor(Math.random() * CONSTANTS.gridSize)
            }
          : { x: ax, y: ay },
        tailSize: newTailSize
      };

      ctx.fillStyle = "red";
      ctx.fillRect(
        ax * CONSTANTS.gridSize,
        ay * CONSTANTS.gridSize,
        CONSTANTS.tileSize,
        CONSTANTS.tileSize
      );

      if (JSON.stringify(mutableGameState) !== JSON.stringify(newGameState)) {
        mutableGameState = newGameState;
        onUpdate(newGameState);
      }
    }
  };
  animate(canvas, ctx, onUpdate);
  // return setVelocity method
  return {
    setVelocity
  };
};
