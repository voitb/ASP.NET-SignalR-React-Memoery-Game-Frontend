import React, { useEffect, useState } from "react";
import "./Board.css";
import { ajaxFunction } from "../../helpers/useApp";

const Board = (props) => {
	const {
		data: { board, selected, isStartingDelay, isTurn, winner },
	} = props;

	const handleCellClick = (i, j) => {
		isTurn && ajaxFunction({ request: "update", value: { i, j } });
	};

	const isNotShowTimeColor = (i, j, color) =>
		selected[i][j] || isStartingDelay ? color : "grey";
	return (
		<div>
			{winner && (
				<div className="game-over">
					<span>GAME OVER</span>
				</div>
			)}
			<div
				style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)` }}
				className="board"
			>
				{board.flatMap((row, i) =>
					row.map((color, j) => (
						<div
							onClick={() =>
								!selected[i][j] &&
								color &&
								!isStartingDelay &&
								handleCellClick(i, j)
							}
							key={`${i}-${j}`}
							style={{ backgroundColor: isNotShowTimeColor(i, j, color) }}
							className="cell"
						/>
					))
				)}
			</div>
		</div>
	);
};

export default Board;
