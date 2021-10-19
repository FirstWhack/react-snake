import * as React from "react";
import {
  CONSTANTS,
  Velocity,
  startGame,
  DifficultyMultiplier
} from "./Game";

const velocityByKeyCode: {[key: number]: Velocity} = {
  37: { x: -1, y: 0 },
  38: { x: 0, y: -1 },
  39: { x: 1, y: 0 },
  40: { x: 0, y: 1 },
}

const handleKeyDown = (
  setVelocity: (velocity: Velocity) => void,
  { keyCode }: React.KeyboardEvent<HTMLDivElement>
) => {
  if (velocityByKeyCode[keyCode]) {
    setVelocity(velocityByKeyCode[keyCode]);
  }
};

export default function Snake() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  // not really stateful but state is convenient to perform an update once we have this
  const [setVelocity, setVelocitySetter] = React.useState<
    ReturnType<typeof startGame>["setVelocity"]
  >(() => () => {});

  React.useLayoutEffect(() => {
    if (canvasRef.current) {
      const { current: canvas } = canvasRef;
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const game = startGame(DifficultyMultiplier.MEDIUM, 5, canvas, ctx);
        setVelocitySetter(() => game.setVelocity);
      }
    }
  }, []);

  return (
    <div
      className="snake"
      onKeyDown={handleKeyDown.bind(null, setVelocity)}
      tabIndex={1}
    >
      <canvas
        ref={canvasRef}
        width={CONSTANTS.gridSize * 20}
        height={CONSTANTS.gridSize * 20}
      />
    </div>
  );
}
