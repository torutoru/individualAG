import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { makeBlinkQuizData } from "../../../ai/gameAI";
import { GameData } from "../../../common/gameManager";
import { saveBlinkUserGameData } from "../../../storage/storageManager";
import { getSkillTypeName } from "../../../common/cognitiveSkillsManager";

const QuizBlink = () => {
  const time = useRef(0);
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
    if (clickPositionList.length === 1) {
      time.current = new Date().getTime();
    }

    if (gameData && gameData[gameIndex]) {
      if (clickPositionList.length >= gameData[gameIndex].correct.length) {
        const duringTime = new Date().getTime() - time.current;
        for (let i = 0; i < clickPositionList.length; i++) {
          if (clickPositionList[i] !== gameData[gameIndex].correct[i]) {
            alert("틀렸습니다!");
            setClickPositionList([]);
            return;
          }
        }

        if (gameIndex === gameData.length - 1) {
          saveBlinkUserGameData(gameLevel, duringTime);
          alert("축하합니다! 모든 게임을 완료했습니다.");
          setGameIndex(0);
          setClickPositionList([]);
        } else {
          saveBlinkUserGameData(gameLevel, duringTime);
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
      <h1>게임 설명</h1>
      <h2>{GameData.BLINK.discription}</h2>
      <h3>Game Data: during_time(한게임 진행한 시간), level: 1부터 5까지 제공</h3>
      <h3>Game Skill: {GameData.BLINK.skillTypes.map((type) => getSkillTypeName(type)).join(', ')}</h3>
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