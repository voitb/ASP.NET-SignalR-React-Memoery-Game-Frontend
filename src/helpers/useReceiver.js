import { useEffect } from "react";

const useReceiver = (
	{ name, connection, selected, winner, playerTurn },
	{
		setName,
		setIsStartingDelay,
		setBoard,
		setPlayersCount,
		setSelected,
		setPlayerTurn,
		setPlayerScore,
		setWinner,
		setGameFetched,
		setRequestSent,
	}
) => {
	useEffect(() => {
		if (connection) {
			connection.on("SetTurn", (player) => {
				name === player.name && setPlayerScore(player.score);
				setPlayerTurn(player.name);
			});
			connection.on("CurrentPlayerAdd", (count) => {
				if (name || !count) return;
				setName(`Player ${count}`);
			});
			connection.on("ReceiveGameBoard", (gameBoard) => {
				setGameFetched(true);
				setRequestSent(true);
				setIsStartingDelay(true);
				const timeoutId = setTimeout(() => {
					setIsStartingDelay(false);
				}, 2000);

				setBoard(gameBoard);
				return () => clearTimeout(timeoutId);
			});
			connection.on("CoordinateUpdated", (coordinates) => {
				const { i, j } = coordinates;
				setSelected((prev) =>
					prev.map((row, rowIndex) =>
						row.map((cell, cellIndex) => {
							return rowIndex === i && cellIndex === j ? true : cell;
						})
					)
				);
			});
			connection.on("PlayersLength", (length) => {
				setPlayersCount(length);
			});
			connection.on("EndGame", (winner) => {
				setWinner(winner);
				setGameFetched(false);
				setRequestSent(false);
				setSelected([
					[false, false, false, false, false, false],
					[false, false, false, false, false, false],
					[false, false, false, false, false, false],
					[false, false, false, false, false, false],
					[false, false, false, false, false, false],
					[false, false, false, false, false, false],
				]);
			});
			connection.on("ResetWinner", () => {
				setWinner(undefined);
				setPlayerScore(0);
			});
			connection.on("CoordinatesToHide", (coordinatesArr) => {
				coordinatesArr.forEach((coord) => {
					setSelected((prev) =>
						prev.map((row, rowIndex) =>
							row.map((cell, cellIndex) => {
								return rowIndex === coord.i && cellIndex === coord.j
									? false
									: cell;
							})
						)
					);
				});
			});
		}
	}, [connection, name, selected, JSON.stringify(winner), playerTurn]);

	return {};
};

export default useReceiver;
