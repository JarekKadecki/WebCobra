import React from 'react';

const Question = ({ question, questoinId, onAnswer }) => {
  return (
    <div className="question-block">
      <h3>{question.title}</h3>
      {question.answers.map((option, idx) => (
        <label key={idx}>
          <input
            type="radio"
            name={questoinId}
            value={option}
            onChange={() => onAnswer(question.id, option)}
          /><br/>
          {option}
        </label>
      ))}
    </div>
  );
};

export default Question;