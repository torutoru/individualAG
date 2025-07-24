import { Link } from "react-router-dom";

const QuizHome = () => {

    return (
        <div>
            <h1><Link to={'/quiz/blink'}>1. Blink 기억력 게임</Link></h1>
            <h1><Link to={'/quiz/recognition'}>2. 얼굴인식</Link></h1>
        </div>
    );
};

export default QuizHome;
