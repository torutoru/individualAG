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
import Stats from './page/quiz/stats/Stats'
import Settings from './page/Settings/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<QuizLayout />}>
          <Route path="/quiz-home" element={<QuizHome />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/quiz" element={<QuizLayout />}>
          <Route path="blink" element={<QuizBlink />} />
          <Route path="blink-v2" element={<QuizBlink_V2 />} />
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
