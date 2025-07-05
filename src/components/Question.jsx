import React from 'react';

const Question = ({ question, onAnswer }) => {
  return (
    <div className="question-block">
      <h3>{question.text}</h3>
      {question.options.map((option, idx) => (
        <label key={idx}>
          <input
            type="radio"
            name={question.id}
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