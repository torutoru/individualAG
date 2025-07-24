import React, { useState, useEffect } from 'react';
import ProgressLoader from './ProgressLoader';
import { createRandomImage } from '../../../../ai/recofnitionAI';

const ImageQuiz = ({ quizDataList }) => {

    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [isLoadingImg, setIsLoadingImg] = useState(true);
    const [quizData, setQuizData] = useState([]);

    const onClickHandler = (e) => {
        const isCorrect = e.target.dataset.correct === 'true';
        if (isCorrect) {
            if (currentQuizIndex === quizDataList.length - 1) {
                alert('축하합니다! 모든 퀴즈를 완료했습니다.');
            } else {
                setCurrentQuizIndex((prevIndex) => prevIndex + 1);
            }
        } else {
            alert('틀렸습니다. 다시 시도해보세요.');
        }
    };

    const createQuiz = async () => {
        const imgUrl = await createRandomImage(quizDataList[currentQuizIndex].desc);
        const data = [];
        if (Math.random() > 0.5) {
            data.push({
                url: quizDataList[currentQuizIndex].url,
                correct: true
            });
            data.push({
                url: imgUrl,
                correct: false
            });
        } else {
            data.push({
                url: imgUrl,
                correct: false
            });
            data.push({
                url: quizDataList[currentQuizIndex].url,
                correct: true
            });
        }
        setQuizData(data);
    }

    useEffect(() => {
        setIsLoadingImg(true);
        createQuiz().finally(() => {
            setIsLoadingImg(false);
        });
    }, [currentQuizIndex]);



    return (
        <>
            <ProgressLoader open={isLoadingImg} />
            {quizDataList.length > 0 ? (
                <div>
                    <h2>{`${quizDataList[currentQuizIndex].name} ...?`}</h2>
                    <div>
                        {quizData.map((item, index) => (
                            <img onClick={onClickHandler} data-correct={item.correct} src={item.url} alt={`${item.url}_${index}`} style={{ width: '40%', height: 'auto', cursor: 'pointer', padding: '5px' }} />
                        ))}
                    </div>
                </div>
            ) : (
                <p>퀴즈 데이터가 없습니다.</p>
            )}
            <h1></h1>
        </>
    )
};

export default ImageQuiz;