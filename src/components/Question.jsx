import React from 'react';

const Question = ({ question, questionKey, onAnswer }) => {
  return (
    <div className="question-block">
      <h3>{question.title}</h3>
      {question.answers.map((option, idx) => (
        <label key={idx}>
          <input
            type="radio"
            name={questionKey}
            value={option}
            onChange={() => onAnswer(questionKey, option)}
          />
          {option}
          <br />
        </label>
      ))}
    </div>
  );
};

export default Question;