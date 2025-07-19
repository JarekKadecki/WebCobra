import { useEffect, useState } from "react";

const StudySelect = ({ selectCallback }) => {

    const [studies, setStudies] = useState([]);

    useEffect(() => {
        const fetchStudies = async () => {
        const res = await fetch('/api/get_studies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
            });
        const data = await res.json();
        console.log(`recived studies: ${JSON.stringify(data)}.`);
        setStudies(data);
        };
        fetchStudies();
    }, []);
  
    return (
        <select onChange={(e) => selectCallback(e.target.value)} defaultValue="">
            <option value="" disabled>Select study</option>
            {studies.map((study) => (
            <option key={study} value={study}>
                {study}
            </option>
        ))}
        </select>
);
};

export default StudySelect;
