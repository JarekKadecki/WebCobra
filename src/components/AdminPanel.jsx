import { useState } from 'react';
import StudyAddRemove from './StudyAddRemove';
import StudyEdit from './StudyEdit';
import GenerateKeys from './GenerateKeys';

const AdminPanel = () => {
  const [selection, setSelection] = useState();


  return (
  <>
    <div id="leftAdminPanel">
      <label>Choose panel</label>
      <div>
        <button class="leftAdminPanelButtons" onClick={()=>setSelection("addRemove")}>Add/Remove study</button><br/>
        <button class="leftAdminPanelButtons" onClick={()=>setSelection("edit")}>Edit study</button><br/>
        <button class="leftAdminPanelButtons" onClick={()=>setSelection("generateKeys")}>Generate keys</button><br/>
        <button class="leftAdminPanelButtons" onClick={()=>setSelection("generateRaport")}>Generate raport</button><br/>
      </div>
    </div>
    <div id="centralAdminPanel">
      {selection == "addRemove" && <StudyAddRemove></StudyAddRemove>}
      {selection == "edit" && <StudyEdit></StudyEdit>}
      {selection == "generateKeys" && <GenerateKeys></GenerateKeys>}
    </div>
  </>
  );
};

export default AdminPanel;
