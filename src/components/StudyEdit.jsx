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
      alert(`Select a study ${selectedStudy} and an action ${fieldtoUpdate} before submitting.`);
      return;
    }

    const formData = {
      study: selectedStudy,
      fieldToUpdate: fieldtoUpdate,
      value: textAreaContent
    };

    const res = await fetch("/api/set_questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Submission failed:", errorText);
      document.getElementById("errorMessage").innerHTML = errorText;
    } else {
      document.getElementById("errorMessage").innerHTML = "";
    }

    if(res.ok) {
      alert("Changes submitted");
    }

  };

  const textAreaId = "editionArea";

  const onSubmitEnclosure = (fieldToUpdate) => () => {
    setApiCall(`/api/set_${fieldToUpdate}`);
    setFieldToUpdate(fieldToUpdate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <StudySelect selectCallback={selectStudy}></StudySelect><br/>

      {selectedStudy && (
        <>
          <ApiButton
            study={selectedStudy}
            editionField={textAreaId}
            updateOnSubmit={onSubmitEnclosure("configuration")}
            api="/api/get_configuration"
          />
          <br/>
          <label id="errorMessage">
          </label>
          <textarea
            id={textAreaId}
            value={textAreaContent}
            onChange={(e) => setTextAreaContent(e.target.value)}
            rows={12}
            style={{ width: "100%", marginTop: "1em" }}
          />
          <br/>
          {fieldtoUpdate && 
            <>
              <label>Changing <b>{fieldtoUpdate}</b> of <b>{selectedStudy}</b>.</label><br/>
            </>}
          <button type="submit">Edit data</button>
        </>
      )}
    </form>
  );
};

export default StudyEdit;
