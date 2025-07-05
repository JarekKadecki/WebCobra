import React, { useEffect, useState } from 'react';
import Question from './Question';

const Questionnaire = () => {
//   const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       const res = await fetch('/api/get_questions', { method: 'POST' });
//       const data = await res.json();
//       setQuestions(data);
//     };
//     fetchQuestions();
//   }, []);

const questions = [
        {
            "id": "q1",
            "text": "What is your favorite color?",
            "options": ["Red", "Blue", "Green", "Yellow"]
        },
        {
            "id": "q2",
            "text": "What is your preferred pet?",
            "options": ["Dog", "Cat", "Bird"]
        }
    ]


  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/submit_answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    });
    alert('Answers submitted!');
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question) => (
        <Question
          key={question.id}
          question={question}
          onAnswer={handleAnswer}
        />
      ))}
      {questions.length > 0 && <button type="submit">Submit</button>}
    </form>
  );
};

export default Questionnaire;
