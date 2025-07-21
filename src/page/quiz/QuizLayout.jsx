import { Outlet, useNavigate } from "react-router-dom";

const QuizLayout = () => {
    const navigator = useNavigate();

    return (
        <div >
            <div>
                <h1>Quiz Page</h1>
                <button onClick={() => navigator(-1)}>뒤로가기</button>
            </div>
            
            <Outlet />
        </div>
    );
};

export default QuizLayout;
