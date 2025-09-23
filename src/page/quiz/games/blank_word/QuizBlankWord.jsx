import { GameData } from "../../../../common/gameManager";
import { getSkillTypeName } from "../../../../common/cognitiveSkillsManager";

const QuizBlinkWord = () => {

    return (
        <>
            <h1>Quiz Blink Word</h1>
            <h2>{GameData.BLANK_WORD.discription}</h2>
            <h3>Game Data: during_time(한게임 진행한 시간), level: 보기 개수(1 - 정답 수 + 2, 2 - 정답수 + 3, 3 - 정답수 + 5)</h3>
            <h3>Game Skill: {GameData.BLANK_WORD.skillTypes.map((type) => getSkillTypeName(type)).join(', ')}</h3>
        </>
    )
};

export default QuizBlinkWord;