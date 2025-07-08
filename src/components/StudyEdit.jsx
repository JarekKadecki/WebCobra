import { useEffect, useState } from 'react';
import ApiButton from './ApiButton';
import StudySelect from './StudySelect';

const StudyEdit = () => {
  const [selectedStudy, selectStudy] = useState("");
  const [apiCall, setApiCall] = useState("");
  const [fieldtoUpdate, setFieldToUpdate] = useState("");
  const [textAreaContent, setTextAreaContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fieldtoUpdate || !selectedStudy) {
      alert("Select a study and an action before submitting.");
      return;
    }

    const formData = {
      study: selectedStudy,
      fieldToUpdate: fieldtoUpdate,
      value: textAreaContent
    };

    try {
      await fetch(apiCall, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      alert('Changes submitted!');
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed.");
    }
  };

  const textAreaId = "editionArea";

  const onSubmitEnclosure = (fieldToUpdate) => () => {
    setApiCall(`/api/set_${fieldToUpdate}`);
    setFieldToUpdate(fieldToUpdate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <StudySelect selectCallback={selectStudy}></StudySelect>

      {selectedStudy && (
        <>
          <ApiButton
            study={selectedStudy}
            editionField={textAreaId}
            onSubmit={onSubmitEnclosure("configuration")}
            api="/api/get_configuration"
          />
          <ApiButton
            study={selectedStudy}
            editionField={textAreaId}
            onSubmit={onSubmitEnclosure("questions")}
            api="/api/get_questions"
          />
          <textarea
            id={textAreaId}
            value={textAreaContent}
            onChange={(e) => setTextAreaContent(e.target.value)}
            rows={12}
            style={{ width: "100%", marginTop: "1em" }}
          />
          <button type="submit">Edit data</button>
        </>
      )}
    </form>
  );
};

export default StudyEdit;
