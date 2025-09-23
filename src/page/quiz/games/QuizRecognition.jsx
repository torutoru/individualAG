import { useState } from 'react';
import { GameData } from '../../../common/gameManager';
import FileChooser from './recognition/FileChooser';
import ImageAnalysis from './recognition/ImageAnalysis';
import ImageQuiz from './recognition/ImageQuiz';
import { getSkillTypeName } from '../../../common/cognitiveSkillsManager';

const QuizRecognition = () => {
    const [step, setStep] = useState(0);
    const [imageFileList, setImageFileList] = useState([]);
    const [quizDataList, setQuizDataList] = useState([]);

    const nextStep = (data) => {
        if (step === 0) {
            setImageFileList(data);
        } else {
            setQuizDataList(data);
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    }

    const getRenderComponent = () => {
        switch (step) {
            case 0:
                return <FileChooser fileList={imageFileList} onNext={nextStep} />;
            case 1:
                return <ImageAnalysis imageList={imageFileList} onNext={nextStep} />;
            case 2:
                return <ImageQuiz quizDataList={quizDataList} />;
            default:
                return null;
        }
    }

    return (
        <>
            <h1>얼굴인식 퀴즈</h1>
            <h2>{GameData.HUMAN_IMAGE.discription}</h2>
            <h3>Game Data: during time(한 게임 수행한 시간)</h3>
            <h3>Game Skill: {GameData.HUMAN_IMAGE.skillTypes.map((type) => getSkillTypeName(type)).join(', ')}</h3>
            {getRenderComponent()}
        </>
    )
};

export default QuizRecognition;