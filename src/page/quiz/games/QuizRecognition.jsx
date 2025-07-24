import React, { useState, useEffect } from 'react';
import FileChooser from './recognition/FileChooser';
import ImageAnalysis from './recognition/ImageAnalysis';
import ImageQuiz from './recognition/ImageQuiz';

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
            {getRenderComponent()}
        </>
    )
};

export default QuizRecognition;