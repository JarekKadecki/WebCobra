import { useState } from 'react';

const ApiButton = ({ study, editionField, updateOnSubmit, api }) => {
  const [data, setData] = useState("");

  const fetchData = async () => {
    updateOnSubmit()
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
      document.getElementById(editionField).value = "";
      document.getElementById(editionField).value = dataStr;
      setData(dataStr);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  let buttonText = "?";

  switch (api) {
    case "/api/get_configuration":
      buttonText = "Configuration";
      break;
    case "/api/get_questions":
      buttonText = "Questions";
      break;
    case "/api/get_report":
      buttonText = "Report";
      break;
    default:
      buttonText = "?";
  }

  return <button type="button" onClick={fetchData}>{buttonText}</button>;
};

export default ApiButton;
