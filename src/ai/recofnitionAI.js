import Cookie from 'js-cookie';
import { HfInference } from '@huggingface/inference';
const hf = new HfInference(Cookie.get('hf_key') || '');

const analyzeImage = async (image) => {
    // const arrayBuffer = await image.arrayBuffer();
    // const bytes = new Uint8Array(arrayBuffer);

    // const result = await hf.imageToText({
    //     data: bytes,
    //     model: 'microsoft/kosmos-2-patch14-224',
    // });

    // return result.generated_text;
    // 현재 무료로 사용할 수 있는 AI 모델 중 이미지 캡셔닝 모델이 없다.
    const randomDesc = ['A woman from Korea in her late 30s with a bright and cheerful personality.', 'A man from Korea in him late 30s with a bright and cheerful personality.'];
    if (Math.random() < 0.5) {
        return randomDesc[0];
    }
    return randomDesc[1];
};

const createRandomImage = async (desc) => {
    try {
        const blob = await hf.textToImage({
            inputs: desc,
            model: 'black-forest-labs/FLUX.1-dev',
            parameters: {
                guidance_scale: 7.5,
                num_inference_steps: 25,
            }
        });

        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.error('Error creating random image:', error);
        const index = Math.round(Math.random() * 10) % 5 + 1;
        return `/img/human_${index}.png`;
    }

};

export { analyzeImage, createRandomImage };