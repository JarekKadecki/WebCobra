import React, { useState } from 'react';
import Question from './Question';
import { EventBus } from '../game/EventBus';

const Questionnaire = ({ questions = [] }) => {
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionKey, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: answer,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    EventBus.emit('hide-questionnaire', answers);
  };

  return (
    <div id="questionnaire-box">
      <form onSubmit={handleSubmit}>
        {questions.map((question, idx) => (
          <Question
            key={`q${idx + 1}`}
            question={question}
            questionKey={`q${idx + 1}`}
            onAnswer={handleAnswer}
          />
        ))}
        {questions.length > 0 && <button type="submit">Submit</button>}
      </form>
    </div>
  );
};

export default Questionnaire;
