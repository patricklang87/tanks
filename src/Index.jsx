import Title from "./components/Title";
import Canvas from "./components/Canvas";
import { useInitiateGame } from "./gameplay/gameControls";
import { PlayDashboard } from "./components/PlayDashboard";

function Index() {
  const canvasHeight = 500;
  const canvasWidth = 1200;

  const { gameState, setGameState } = useInitiateGame({
    numberOfPlayers: 4,
    // numberOfPlayers: 1,
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
      <PlayDashboard setGameState={setGameState} gameState={gameState} />
    </>
  );
}

export default Index;
