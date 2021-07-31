import React from "react";
import Auxiliary from "util/Auxiliary";
import EasyEdit from 'react-easy-edit';


const AboutItem = ({data}) => {
  const {title, icon, desc, userList} = data;
  const save = (value) => {alert(value)}
  const cancel = () => {alert("Cancelled")}
  return (

    <Auxiliary>
      <div className="gx-media gx-flex-nowrap gx-mt-3 gx-mt-lg-4 gx-mb-2">
        <div className="gx-mr-3">
          <i className={`icon icon-${icon} gx-fs-xlxl gx-text-orange`}/>
        </div>
        <div className="gx-media-body">
          <h6 className="gx-mb-1 gx-text-grey">{title}</h6>

            <EasyEdit
            type="text"
            onSave={save}
            onCancel={cancel}
            saveButtonLabel="Save Me"
            cancelButtonLabel="Cancel Me"
            attributes={{ name: "awesome-input", id: 1}}
            instructions="Star this repo!"
          />
          {userList === '' ? null : userList}
          {desc === '' ? null : <p className="gx-mb-0">{desc}</p>}
        </div>
      </div>
    </Auxiliary>
  );
};

export default AboutItem;
