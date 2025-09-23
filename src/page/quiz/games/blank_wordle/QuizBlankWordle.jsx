import { GameData } from "../../../../common/gameManager";
import { getSkillTypeName } from "../../../../common/cognitiveSkillsManager";

const QuizBlinkWordle = () => {

    return (
        <>
            <h1>Quiz Blink wordle</h1>
            <h2>{GameData.BLANK_WORDLE.discription}</h2>
            <h3>Game Data: during time(한 게임 수행한 시간), level(단어의 어려움 1(쉬움) / 2(보통) / 3(어려움))</h3>
            <h3>Game Skill: {GameData.BLANK_WORDLE.skillTypes.map((type) => getSkillTypeName(type)).join(', ')}</h3>
        </>
    )
};

export default QuizBlinkWordle;