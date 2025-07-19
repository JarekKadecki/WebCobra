import React, { useEffect, useState } from 'react';
import Question from './Question';

const Questionnaire = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('/api/get_questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Could not fetch questions.");
      } else {
        console.log(`Question received ${JSON.stringify(data.questions)}`);
      }

      setQuestions(data.questions);

      const initialAnswers = {};
      data.questions.forEach((_, idx) => {
        initialAnswers[`q${idx + 1}`] = 'unanswered';
      });
      setAnswers(initialAnswers);
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (questionKey, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: answer,
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
      {questions.map((question, idx) => (
        <Question
          key={`q${Number(idx) + 1}`}
          question={question}
          questionKey={`q${Number(idx) + 1}`}
          onAnswer={handleAnswer}
        />
      ))}
      {questions.length > 0 && <button type="submit">Submit</button>}
    </form>
  );
}

export default Questionnaire;
