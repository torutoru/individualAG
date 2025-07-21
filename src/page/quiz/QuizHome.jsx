import { Link } from "react-router-dom";

const QuizHome = () => {

    return (
        <div>
            <h1><Link to={'/quiz/blink'}>1. Blink 기억력 게임</Link></h1>
        </div>
    );
};

export default QuizHome;
