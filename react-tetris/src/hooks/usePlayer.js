import { useState, useCallback } from 'react';

import { TETROMINOS, randomTetromino } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelpers';

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  const rotate = (matrix, dir) => {
    // Make the rows to become cols
    // ['T', 'T', 'T'],
    // [0,   'T',   0],
    // [0,    0,    0],
    const rotatedTetromino = matrix.map((_, index) => matrix.map(col => col[index]));

    // ['T',   0,   0],
    // ['T',  'T',  0],
    // ['T',   0,   0],  

    // Reverse each row to get a rotated matrix
    if (dir > 0) return rotatedTetromino.map(row => row.reverse());
    // [0,  0,   'T'],
    // [0,  'T',  'T'],
    // [0,   0,   'T'], 

    return rotatedTetromino.reverse();
    // ['T',  0,  0],  
    // ['T', 'T', 0],
    // ['T',  0,  0],

  }

  const playerRotate = (stage, dir) => {
    // to avoid mutating state
    const clonedPlayer = JSON.parse(JSON.stringify(player));

    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  }

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer(prev => ({
      ...prev,
      pos: { x: (prev.pos.x + x), y: (prev.pos.y + y) },
      collided,
    }))
  }

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    })
  }, [])

  return [player, updatePlayerPos, resetPlayer, playerRotate];
}