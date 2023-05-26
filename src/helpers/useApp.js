import { useEffect, useState } from "react";
import useReceiver from "./useReceiver";
import useSender from "./useSender";
import { HubConnectionBuilder } from "@microsoft/signalr";
export const xhr = new XMLHttpRequest();
export const ajaxFunction = ({ request, callback, type = "POST", value }) => {
	xhr.open(type, `http://localhost:5186/api/game/${request}`, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			callback && callback(this);
		} else {
			console.error("Error:", xhr.statusText);
		}
	};

	xhr.onerror = function () {
		console.error("Request error...");
	};

	value ? xhr.send(JSON.stringify(value)) : xhr.send();
};

const useApp = () => {
	const [connectionWS, setConnectionWS] = useState(null);
	const [connected, setConnected] = useState(false);
	const [isStartingDelay, setIsStartingDelay] = useState(false);
	const [gameFetched, setGameFetched] = useState(false);
	const [requetSent, setRequestSent] = useState(false);
	const [playersCount, setPlayersCount] = useState(0);
	const [playerScore, setPlayerScore] = useState(0);
	const [winner, setWinner] = useState();
	const [board, setBoard] = useState([
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
		[null, null, null, null, null, null],
	]);
	const [name, setName] = useState("");
	const [playerTurn, setPlayerTurn] = useState("");
	const [selected, setSelected] = useState([
		[false, false, false, false, false, false],
		[false, false, false, false, false, false],
		[false, false, false, false, false, false],
		[false, false, false, false, false, false],
		[false, false, false, false, false, false],
		[false, false, false, false, false, false],
	]);

	const isTurn = playerTurn === name;

	useEffect(() => {
		if (connected) return;
		const connection = new HubConnectionBuilder()
			.withUrl("http://localhost:5186/gamehub")
			.build();

		connection
			.start()
			.then(() => {
				setConnected(true);
				ajaxFunction({ request: "reset-players" });
			})
			.catch((err) =>
				console.error(
					"Błąd podczas nawiązywania połączenia z Hubem SignalR: ",
					err
				)
			);
		setConnectionWS(connection);
		setPlayersCount(0);
	}, []);

	const addPlayer = () => {
		ajaxFunction({
			request: "add",
			callback: (xhrArg) => {
				setName(JSON.parse(xhrArg.responseText).name);
			},
		});
	};

	const requestGameStart = () => {
		setWinner(undefined);
		if ((gameFetched && requetSent) || playersCount !== 2) return;

		setRequestSent(true);
		ajaxFunction({
			type: "GET",
			request: "start",
			callback: () => {
				setGameFetched(true);
			},
		});
	};

	const reinitialize = () => {
		if ((gameFetched && requetSent) || playersCount !== 2) return;
		setSelected([
			[false, false, false, false, false, false],
			[false, false, false, false, false, false],
			[false, false, false, false, false, false],
			[false, false, false, false, false, false],
			[false, false, false, false, false, false],
			[false, false, false, false, false, false],
		]);
		setRequestSent(true);
		ajaxFunction({
			type: "GET",
			request: "reinitialize",
			callback: (xhrArg) => {
				setGameFetched(true);
			},
		});
	};
	const onPlay = () => (winner ? reinitialize() : requestGameStart());

	useSender(connectionWS);
	useReceiver(
		{ name, connection: connectionWS, playerTurn, selected },
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
	);

	return {
		board,
		requestGameStart,
		addPlayer,
		selected,
		setSelected,
		isStartingDelay,
		name,
		connectionWS,
		isTurn,
		playerScore,
		winner,
		onPlay,
		gameFetched,
	};
};

export default useApp;
