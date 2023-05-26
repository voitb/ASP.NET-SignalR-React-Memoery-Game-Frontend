import React from "react";
import "./App.css";
import Board from "./components/Board/Board";
import useApp from "./helpers/useApp";

const App = () => {
	const {
		board,
		addPlayer,
		selected,
		setSelected,
		isStartingDelay,
		name,
		connectionWS,
		isTurn,
		playerScore,
		winner,
		gameFetched,
		onPlay,
	} = useApp();

	return (
		<div className="App">
			<button onClick={addPlayer}>ADD PLAYER</button>
			<div className="score">
				<span>{name} </span>
				<span>{name ? `Score: ${playerScore}` : ""}</span>
			</div>
			{winner && (
				<div className="score">
					Zwycięzca {winner?.name} {`Score: ${winner?.score}`}
				</div>
			)}

			<div>
				<Board
					data={{
						board,
						selected,
						isStartingDelay,
						connectionWS,
						isTurn,
						winner,
					}}
					methods={{ setSelected }}
				/>
			</div>
			{!gameFetched && (
				<button onClick={onPlay}>{winner ? "Play again" : "Start"}</button>
			)}
		</div>
	);
};

export default App;
