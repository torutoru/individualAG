
/**
 * make 5 games
 * @returns Array<BlinkQuizData>
 */
const makeBlinkQuizData = async (level) => {
    let row = level || 2, blinkTime = 1000;

    // blink data 생성
    const gameList = [];
    for (let i = 0; i < 5; i++) {
        const blinkData = Array.from({ length: row * row }, (_, j) => j);
        blinkData.sort(() => Math.random() - 0.5); // Shuffle the array
        
        gameList.push({
            row: row,
            blinkTime: blinkTime - (100 * i),
            correct: blinkData.splice(0, 4),
        });
    }

    return gameList;
};

export { makeBlinkQuizData };