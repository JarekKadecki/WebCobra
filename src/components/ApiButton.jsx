import { useState } from 'react';

const ApiButton = ({ study, editionField, onSubmit, api }) => {
  const [data, setData] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ study: study })
      });

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const json = await res.json();
      const dataStr = JSON.stringify(json, null, 2);
      document.getElementById(editionField).value = dataStr;
      setData(dataStr);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  let buttonText = "?";

  switch (api) {
    case "/get_configuration":
      buttonText = "Configuration";
      break;
    case "/get_questions":
      buttonText = "Questions";
      break;
    case "/get_raport":
      buttonText = "Raport";
      break;
    default:
      buttonText = "?";
  }

  return <button type="button" onClick={fetchData}>{buttonText}</button>;
};

export default ApiButton;
