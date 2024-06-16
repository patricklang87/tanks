import Title from "./components/Title";
import Canvas from "./components/Canvas";
import TankControls from "./components/TankControls";
import { useInitiateGame } from "./gameplay/gameControls";

function Index() {
  const canvasHeight = 500;
  const canvasWidth = 1200;

  const { gameState, setGameState } = useInitiateGame({
    // numberOfPlayers: 3,
    numberOfPlayers: 1,
    canvasHeight,
    canvasWidth,
    increments: 50,
    maxVariationCoefficient: 0.05,
    minHeightCoefficient: 0.2,
    maxHeightCoefficient: 0.8,
  });

  return (
    <>
      <Title />
      <Canvas
        gameState={gameState}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
      />
      <TankControls setGameState={setGameState} gameState={gameState} />
    </>
  );
}

export default Index;
