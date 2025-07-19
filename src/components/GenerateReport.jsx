import { useState } from 'react';
import StudySelect from './StudySelect';
import { generateReport } from '../game/functions/generateReport';

const GenerateReport = () => {
    const [selectedStudy, selectStudy] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStudy) {
                alert("Select a study to generate report.");
            return;
        }

        const formData = {
            study: selectedStudy
        }

        const res = await fetch("/api/generate_report", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        console.log(`Generating report for ${selectedStudy}.`);

        if (res.ok) {

            const reportData = await res.json();
            const fileContent = generateReport(reportData);

            //insert data validation and processing

            const blob = new Blob([fileContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `report_${selectedStudy}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else if(!res.ok)
        {
            console.error("generate_report failed:", err);
            alert("Submission failed.");
        }
    }

  return (
    <form onSubmit={handleSubmit}>
        <label>Select study</label><br/>
        <StudySelect selectCallback={selectStudy}></StudySelect><br/>
        <button type="submit">Generate</button>
    </form>
  );
};

export default GenerateReport;
