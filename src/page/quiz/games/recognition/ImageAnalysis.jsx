import { useEffect, useState } from "react";
import { analyzeImage, createRandomImage } from "../../../../ai/recofnitionAI";

const ImageAnalysis = ({ imageList, onNext }) => {

    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [analyzedImageList, setAnalyzedImageList] = useState(imageList);

    const makeImageDescription = async () => {
        for (let i = 0; i < analyzedImageList.length; i++) {
            const desc = await analyzeImage(analyzedImageList[i].originFile);
            // const quizImgUrl = await createRandomImage(desc);
            analyzedImageList[i].desc = desc;
            // analyzedImageList[i].quizImgUrl = quizImgUrl;
        }
        setAnalyzedImageList([...analyzedImageList]);
    }

    useEffect(() => {
        setIsAnalyzing(true);
        makeImageDescription().finally(() => {
            setIsAnalyzing(false);
        });

    }, []);

    return (
        <>
            <table border='1'>
                <thead>
                    <tr>
                        <th>이미지</th>
                        <th>이미지 이름</th>
                        <th>분석 결과</th>
                    </tr>
                </thead>
                <tbody>
                    {analyzedImageList.map((image, index) => (
                        <tr key={index}>
                            <td>
                                <img src={image.url} alt={`이미지 ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                            </td>
                            <td>
                                {image.name ? image.name : '이름 없음'}
                            </td>
                            {/* <td>
                                <img src={image.quizImgUrl} alt={`이미지 ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                            </td> */}
                            <td>
                                {image.desc ? image.desc : '분석 중...'} 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => onNext(analyzedImageList)}>다음</button>
        </>
    )
};

export default ImageAnalysis;