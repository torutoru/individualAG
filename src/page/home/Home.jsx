import { Link } from "react-router-dom";

import NoodleBackground from '../../components/NoodleBackground/NoodleBackground';
import { HomeMain } from "./styles";

const Home = () => {

    return (
         <>
            <NoodleBackground />
            <HomeMain>
                <h1><Link to={'/quiz_home'}>퀴즈</Link></h1>
                <p>
                    AI 치매 센터에 오신 것을 환영합니다.
                </p>
            </HomeMain>
        </>
    );
};

export default Home;