import { SkillTypes } from "./cognitiveSkillsManager";

// DB Table Name, Game Unique Key
const GameTitles = {
    BLINK: 'blink',
    BLINK_WORD: 'blink-word',
    BLINK_WORDLE: 'blink-wordle',
    R_P_C: 'rock-papper-scissors',
    HUMAN_IMAGE: 'human-image',
};

const GameData = {
    BLINK: {
        gameLink: '/quiz/blink',
        skillTypes: [SkillTypes.MEMORY, SkillTypes.ATTENTION, SkillTypes.AGILITY],
        discription: '이 게임은 n * n 크기의 격자판에서 특정 위치가 깜빡이는 것을 기억하는 게임입니다. 사용자는 깜빡이는 위치를 순서대로 클릭해야 합니다. 게임의 난이도는 격자판 크기, 깜박이는 개수로 결정됩니다. 게임의 난이도는 총 5단계 존재하며, 1단계: 격자크기 2x2, 맞춰야 하는 갯수 4개,  2단계 - 격자크기 3x3, 맞춰야 하는 갯수 4개, 3단계 - 격자크기 3x3, 맞춰야 하는 갯수 5개, 4단계 - 격자크기 4x4, 맞춰야 하는 개수 5개, 5단계 - 격자크기 4x4, 맞춰야 하는 개수 6개 입니다.',
    },
    BLANK_WORD: {
        gameLink: '/quiz/blank-word',
        skillTypes: [SkillTypes.LANGUAGE, SkillTypes.ATTENTION],
        discription: '이 게임은 동물/사물 사진을 보고 해당 단어를 맞추는 게임입니다. 사용자는 제시된 보기를 선택하여 단어를 조합해야 하는데, 한국어는 한 음절, 영어는 알파벳 하나씩 선택 후 조합하여 사진 단어를 맞춰야 합니다. 게임의 난이도는 보기의 개수에 따라 달라지며, 총 3단계로 구성 되어 있습니다. 1단계: 정답 단어수 + 2개, 2단계: 정답 단어수 + 3개, 3단계: 정답 단어수 + 5개 입니다.',
    },
    BLANK_WORDLE: {
        gameLink: '/quiz/blank-wordle',
        skillTypes: [SkillTypes.LANGUAGE, SkillTypes.ATTENTION],
        discription: '이 게임은 n 개의 빈칸이 주어지며, 사용자는 빈칸에 임의의 단어를 입력하여 숨겨진 단어를 맞추는 게임입니다. 사용자가 입력한 단어의 각 글자가 숨겨진 단어에 포함되어 있는지, 포함되어 있다면 위치까지 일치하는지에 따라 피드백을 제공합니다. 게임에 level이 있고, level은 일상생활 사용 빈도수, 학습 난이도, 직관적 이해 가능성으로 설정하였습니다. level 1은 쉬움, level 2는 보통, level 3은 어려움입니다.',
    },
    R_P_C: {
        gameLink: '/quiz/rps-reverse',
        discription: 'rock-papper-scissors',
    },
    HUMAN_IMAGE: {
        gameLink: '/quiz/recognition',
        skillTypes: [SkillTypes.MEMORY, SkillTypes.ATTENTION],
        discription: '이 게임은 특정 사람과 그 사람과 비슷한 사람(나이, 성별, 인종, 사진 속 배경) 사진을 생성하고, 사용자는 두 사진 중 특정 사람을 맞추는 게임입니다.',
    },
}

export { GameTitles, GameData };