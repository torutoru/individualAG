import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './page/home/Home';
import NotFound from './page/NotFound';
import QuizBlink from './page/quiz/games/QuizBlink';
import QuizBlink_V2 from './page/quiz/games/QuizBlink_V2';
import QuizHome from './page/quiz/QuizHome';
import QuizLayout from './page/quiz/QuizLayout';
import QuizRecognition from './page/quiz/games/QuizRecognition';

import Profile from './page/profile/Profile';
import Leaderboard from './page/quiz/leaderboard/Leaderboard'
import Settings from './page/Settings/Settings'
import Stats from './page/quiz/stats/Stats'
import RpsInhibitionGame from './page/quiz/games/RpsInhibitionGame/RpsInhibitionGame'
import TrafficLightReaction from './page/quiz/games/TrafficLightReaction/TrafficLightReaction'
import StopwatchSense from './page/quiz/games/StopwatchSense/StopwatchSense'
import ClockHandMatch from './page/quiz/games/ClockHandMatch/ClockHandMatch'
import EmojiMatch from './page/quiz/games/EmojiMatch/EmojiMatch'
import QuizBlinkWord from './page/quiz/games/blink_word/QuizBlinkWord';
import QuizBlinkWordle from './page/quiz/games/blink_wordle/QuizBlinkWordle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<QuizLayout />}>
          <Route path="/quiz-home" element={<QuizHome />} />
        </Route>
        <Route path="/quiz" element={<QuizLayout />}>
          {/* Game SL */}
          <Route path="blink" element={<QuizBlink />} />
          <Route path="blink-v2" element={<QuizBlink_V2 />} />
          <Route path="blink-word" element={<QuizBlinkWord />} />
          <Route path="blink-wordle" element={<QuizBlinkWordle />} />
          <Route path="rps-reverse" element={<RpsInhibitionGame />} />
          <Route path="rps" element={<RpsInhibitionGame />} />
          <Route path="traffic" element={<TrafficLightReaction />} />
          <Route path="stopwatch" element={<StopwatchSense />} />
          <Route path="clock" element={<ClockHandMatch />} />
          <Route path="emoji" element={<EmojiMatch />} />
          {/* Game EL */}
          <Route path="recognition" element={<QuizRecognition />} />
          <Route path="leader-board" element={<Leaderboard />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
