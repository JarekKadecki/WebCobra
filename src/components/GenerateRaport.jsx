import { useState } from 'react';
import StudySelect from './StudySelect';

const GenerateKeys = () => {
    const [selectedStudy, selectStudy] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStudy) {
                alert("Select a study to generate keys.");
            return;
        }

        const formData = {
            study: selectedStudy
        }

        const res = await fetch("/api/generate_raport", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        console.log(`Generating raport for ${selectedStudy}.`);

        if (res.ok) {

            const raportData = await res.json();
            const fileContent = raportData.join('\n');

            //insert data validation and processing

            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `raport_${selectedStudy}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else if(!res.ok)
        {
            console.error("generate_raport failed:", err);
            alert("Submission failed.");
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <label>Select study</label><br/>
        <StudySelect selectCallback={selectStudy}></StudySelect><br/>
        <label>Provide number o keys to generate</label><br/>
        <button type="submit">Generate</button>
      
    </form>
  );
};

export default GenerateKeys;
