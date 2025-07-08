import { useState } from 'react';
import StudyAddRemove from './StudyAddRemove';
import StudyEdit from './StudyEdit';
import GenerateKeys from './GenerateKeys';

const AdminPanel = () => {
  const [selection, setSelection] = useState();


  return (
  <>
    <label>Choose panel</label>
    <button onClick={()=>setSelection("addRemove")}>Add/Remove study</button><br/>
    {selection == "addRemove" && <StudyAddRemove></StudyAddRemove>}
    <button onClick={()=>setSelection("edit")}>Edit study</button><br/>
    {selection == "edit" && <StudyEdit></StudyEdit>}
    <button onClick={()=>setSelection("generateKeys")}>Generate keys</button><br/>
    {selection == "generateKeys" && <GenerateKeys></GenerateKeys>}
  </>
  );
};

export default AdminPanel;
