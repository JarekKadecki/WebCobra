import { useEffect, useState } from "react";

const StudySelect = ({ selectCallback }) => {

    const [studies, setStudies] = useState([]);

    useEffect(() => {
        const fetchStudies = async () => {
        const res = await fetch('/api/get_studies', { method: 'POST' });
        const data = await res.json();
        setStudies(data);
        };
        fetchStudies();
    }, []);
  
    return (
        <select onChange={(e) => selectCallback(e.target.value)} defaultValue="">
            <option value="" disabled>Select study</option>
            {studies.map((study) => (
            <option key={study.name} value={study.name}>
                {study.name}
            </option>
        ))}
        </select>
);
};

export default StudySelect;
