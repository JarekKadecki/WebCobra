import { useState } from 'react';
import StudySelect from './StudySelect';

const StudyAddRemove = () => {
    const [selectedStudy, selectStudy] = useState("");
    const [selectedAction, setSelectedAction] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedAction) {
        alert("Select a study to add or to remove.");
        return;
        }

        if(selectedAction == "add") {
            const formData = {
                name: document.getElementById("addStudyInput").value
            }

            try {
                await fetch("/api/add_study", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                console.log(`Study ${formData.name} sent to be added.`);
            } catch (err) {
                console.error("add_study failed:", err);
                alert("Submission failed.");
            }
        }

        if(selectedAction == "remove") {
            const formData = {
                name: selectedStudy
            }

            try {
                await fetch("/api/remove_study", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                console.log(`Study ${selectedStudy} sent to be removed.`);
            } catch (err) {
                console.error("remove_study failed:", err);
                alert("Submission failed.");
            }
        };
    }

  return (
    <form onSubmit={handleSubmit}>
        <button onClick={()=>setSelectedAction("add")}>Add Study</button>
        <button onClick={()=>setSelectedAction("remove")}>Remove Study</button>

        {selectedAction == "add" && 
            <input type="text" id="addStudyInput"/> }
        {selectedAction == "remove" &&
            <StudySelect selectCallback={selectStudy}></StudySelect>}
        {selectedAction && 
            <button type="submit"></button>}
      
    </form>
  );
};

export default StudyAddRemove;
