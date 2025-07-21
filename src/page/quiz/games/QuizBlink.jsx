import { useEffect, useState } from "react";
import { makeBlinkQuizData } from "../../../ai/gameAI";
import { Button } from "@mui/material";

const QuizBlink = () => {

  const [gameIndex, setGameIndex] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [clickPositionList, setClickPositionList] = useState([]);
  const [blinkIndex, setBlinkIndex] = useState(-1);
  const [gameLevel, setGameLevel] = useState(2);

  const changeGameLevel = (level) => {
    setGameLevel(level);
    setGameIndex(0);
    setClickPositionList([]);
    setBlinkIndex(-1);
  }

  const getTableContent = () => {
    const currentGame = gameData[gameIndex];
    const tableContent = [];

    for (let i = 0; i < currentGame.row; i++) {
      const rowContent = [];
      for (let j = 0; j < currentGame.row; j++) {
        const index = i * currentGame.row + j;
        rowContent.push(
          <td key={index} style={{ width: '50px', height: '50px', textAlign: 'center', backgroundColor: index === blinkIndex ? 'black' : clickPositionList.includes(index) ? 'whitesmoke' : 'white' }} onClick={() => blinkIndex === -1 ? setClickPositionList([...clickPositionList, index]) : undefined}>
          </td>
        );
      }
      tableContent.push(<tr key={i}>{rowContent}</tr>);
    }

    return tableContent;
  }

  const playBlink = () => {
    for (let i = 0; i < gameData[gameIndex].correct.length; i++) {
      setTimeout(() => {
        setBlinkIndex(gameData[gameIndex].correct[i]);
      }, [gameData[gameIndex].blinkTime * (i + 1)]);
    }
    setTimeout(() => {
      setBlinkIndex(-1);
    }, [gameData[gameIndex].blinkTime * (gameData[gameIndex].correct.length + 1)]);
  }

  useEffect(() => {
    if (gameData && gameData[gameIndex]) {
      if (clickPositionList.length >= gameData[gameIndex].correct.length) {
        for (let i = 0; i < clickPositionList.length; i++) {
          if (clickPositionList[i] !== gameData[gameIndex].correct[i]) {
            alert("틀렸습니다!");
            setClickPositionList([]);
            return;
          }
        }

        if (gameIndex === gameData.length - 1) {
          alert("축하합니다! 모든 게임을 완료했습니다.");
          setGameIndex(0);
          setClickPositionList([]);
        } else {
          setClickPositionList([]);
          setGameIndex(gameIndex + 1);
        }

      }
    }

  }, [clickPositionList]);

  useEffect(() => {
    if (gameData) {
      playBlink();
    }
  }, [gameData, gameIndex]);

  useEffect(() => {
    makeBlinkQuizData(gameLevel).then(data => {
      setGameData(data);
    });
  }, [gameLevel]);

  return (
    <div>
      <h1>Quiz Blink</h1>
      <div>
        <label>게임 레벨: </label>
        <select value={gameLevel} disabled={blinkIndex !== -1} onChange={(e) => changeGameLevel(Number(e.target.value))}>
          <option value={2}>2x2</option>
          <option value={3}>3x3</option>
          <option value={4}>4x4</option>
        </select>
      </div>
      {gameData && <>
        <h2>{`${gameIndex + 1}/${gameData.length}`}</h2>
        <Button onClick={playBlink} disabled={blinkIndex !== -1}>다시보기</Button>
        <table border='1'>
          <tbody>
            {getTableContent()}
          </tbody>
        </table>
      </>}
    </div>
  );
};

export default QuizBlink;