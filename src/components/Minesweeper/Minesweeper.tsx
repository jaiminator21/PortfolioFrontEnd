"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Bomb, Flag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './Minesweeper.module.css';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

export default function Minesweeper({ rows = 12, cols = 12, mines = 20 }) {
  const t = useTranslations('Minesweeper');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    generateBoard();
  }, []);

  const generateBoard = () => {
    setGameOver(false);
    setWin(false);
    let newBoard: Cell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0,
      }))
    );

    let minesPlanted = 0;
    while (minesPlanted < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newBoard[r][c].isMine) {
        newBoard[r][c].isMine = true;
        minesPlanted++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr; const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) count++;
            }
          }
          newBoard[r][c].neighborCount = count;
        }
      }
    }
    setBoard(newBoard);
  };

  const checkWin = (currentBoard: Cell[][]) => {
    const hasWon = currentBoard.every(row => 
      row.every(cell => (cell.isMine ? !cell.isRevealed : cell.isRevealed))
    );
    if (hasWon) setWin(true);
  };

  const revealCell = (r: number, c: number) => {
    if (gameOver || win || board[r][c].isRevealed || board[r][c].isFlagged) return;
    const newBoard = [...board.map(row => [...row])];

    if (newBoard[r][c].isMine) {
      setGameOver(true);
      newBoard.forEach(row => row.forEach(cell => { if (cell.isMine) cell.isRevealed = true; }));
      setBoard(newBoard);
      return;
    }

    const floodFill = (b: Cell[][], row: number, col: number) => {
      if (row < 0 || row >= rows || col < 0 || col >= cols || b[row][col].isRevealed || b[row][col].isFlagged) return;
      b[row][col].isRevealed = true;
      if (b[row][col].neighborCount === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) floodFill(b, row + dr, col + dc);
        }
      }
    };

    floodFill(newBoard, r, c);
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || board[r][c].isRevealed) return;
    const newBoard = [...board.map(row => [...row])];
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  };

  if (board.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
      <div className={styles.stats}>
        <div className={styles.statBox}>
          <Bomb size={18} /> <span>{mines}</span>
        </div>
        <button onClick={generateBoard} className={styles.resetBtn}>
          <RefreshCw size={20} className={gameOver ? styles.spin : ''} />
        </button>
        <div className={styles.statBox}>
          <Flag size={18} /> <span>{board.flat().filter(c => c.isFlagged).length}</span>
        </div>
      </div>

      <div 
        className={styles.grid} 
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <motion.div
              key={`${r}-${c}`}
              initial={false}
              animate={{ 
                scale: cell.isRevealed ? 1 : 0.98,
                backgroundColor: cell.isRevealed ? 'var(--secondary)' : 'var(--card)' 
              }}
              className={`${styles.cell} ${cell.isRevealed ? styles.revealed : ''}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={(e) => toggleFlag(e, r, c)}
            >
              {cell.isRevealed && !cell.isMine && cell.neighborCount > 0 && (
                <span className={styles[`num${cell.neighborCount}`]}>{cell.neighborCount}</span>
              )}
              {cell.isRevealed && cell.isMine && <Bomb size={16} className={styles.mineIcon} />}
              {!cell.isRevealed && cell.isFlagged && <Flag size={14} className={styles.flagIcon} />}
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {(gameOver || win) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={styles.status}
          >
            {win ? t('win') : t('gameOver')}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}