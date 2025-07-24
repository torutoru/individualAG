import React, { useState, useEffect } from 'react';
import { analyzeImage } from '../../../../ai/recofnitionAI'; // Assuming this is the correct path to your AI function

const FileChooser = ({ fileList, onNext }) => {

    const [imageFileList, setImageFileList] = useState(fileList);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFileList([...imageFileList, {
                originFile: file,
                url: URL.createObjectURL(file),
                name: file.name
            }]);
        }
    }

    const handleNameChange = (e) => {
        const imgIndex = e.target.dataset.imgindex;
        const value = e.target.value;
        imageFileList[imgIndex].name = value;
        setImageFileList([...imageFileList]);
        // console.log(`이미지 ${imgIndex}의 이름이 변경되었습니다: ${value}`);
    }

    return (
        <>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <table border='1'>
                <thead>
                    <tr>
                        <th>업로드 이미지</th>
                        <th>이름</th>
                    </tr>
                </thead>
                <tbody>
                    {imageFileList.map((image, index) => (
                        <tr key={index}>
                            <td>
                                <img src={image.url} alt={`이미지 ${index + 1}`} style={{ width: '100px', height: '100px' }} />
                            </td>
                            <td>
                                <input type="text" onChange={handleNameChange} value={image.name} style={{ width: '200px' }} data-imgindex={index} /> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => onNext(imageFileList)}>다음</button>
        </>
    )
};

export default FileChooser;