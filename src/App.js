import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './page/home/Home';
import NotFound from './page/NotFound';
import QuizBlink from './page/quiz/games/QuizBlink';
import QuizHome from './page/quiz/QuizHome';
import QuizLayout from './page/quiz/QuizLayout';
import QuizRecognition from './page/quiz/games/QuizRecognition';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz_home" element={<QuizHome />} />
        <Route path="/quiz" element={<QuizLayout />}>
          <Route path="blink" element={<QuizBlink />} />
          <Route path="recognition" element={<QuizRecognition />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
