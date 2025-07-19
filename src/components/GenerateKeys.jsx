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

        const res = await fetch("/api/generate_keys", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        console.log(`Generating ${keysNumber} keys for ${selectedStudy}.`);

        if (res.ok) {
            const keysRes = await fetch("/api/get_keys", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const keysList = await keysRes.json();
            const fileContent = keysList.join('\n');

            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'keys.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else if(!res.ok)
        {
            console.error("generate_keys failed:");
            alert("Submission failed.");
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <label>Select study</label><br/>
        <StudySelect selectCallback={selectStudy}></StudySelect><br/>
        <label>Provide number o keys to generate</label><br/>
        <input type="number" id="numberInput" onChange={(e) => setKeysNumber(Number(e.target.value))} min="0"/><br/>
        <button type="submit">Submit</button>
      
    </form>
  );
};

export default GenerateKeys;
