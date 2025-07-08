import { useState } from 'react';
import StudySelect from './StudySelect';

const GenerateKeys = () => {
    const [selectedStudy, selectStudy] = useState("");
    const [keysNumber, setKeysNumber] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStudy) {
                alert("Select a study to generate keys.");
            return;
        }
        if (!keysNumber || Number(keysNumber) <= 0) {
                alert("Select number of keys to generate.");
            return;
        }

        const formData = {
            number: keysNumber,
            study: selectedStudy
        }

        try {
            await fetch("/api/generate_keys", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            console.log(`Generating ${keysNumber} keys for ${selectedStudy}.`);
        } catch (err) {
            console.error("generate_keys failed:", err);
            alert("Submission failed.");
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <label>Select study</label><br/>
        <StudySelect selectCallback={selectStudy}></StudySelect>
        <label>Provide number o keys to generate</label><br/>
        <input type="number" id="numberInput" value="0" onChange={(e) => setKeysNumber(e.target.value)} min="0"/>
        <button type="submit"></button>
      
    </form>
  );
};

export default GenerateKeys;
