import React from "react";
import Widget from "components/Widget";
//import {contactList} from '../../../routes/Profile/data'
import EasyEdit from 'react-easy-edit';
const contactList = [
  {
    id: 1,
    title: 'Email',
    icon: 'email',
    desc: [<span className="gx-link" key={1}>kiley.brown@example.com</span>]
  },
  {
    id: 2,
    title: 'Web page',
    icon: 'link',
    desc: [<span className="gx-link" key={2}>example.com</span>]
  }, {
    id: 3,
    title: 'Phone',
    icon: 'phone',
    desc: ['+1-987 (454) 987']
  },
];
const save = (value) => { console.log(contactList)}
const cancel = () => {alert("Cancelled")}
const Contact = () => {

  return (
    <Widget title="Contact" styleName="gx-card-profile-sm">
      {contactList.map((data, index) =>
        <div key={index} className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
          <div className="gx-mr-3">
            <i className={`icon icon-${data.icon} gx-fs-xxl gx-text-grey`}/>
          </div>
          <div className="gx-media-body">
            <span className="gx-mb-0 gx-text-grey gx-fs-sm">{data.title}</span>
            <p className="gx-mb-0">
            <EasyEdit
            type="text"
            onSave={save}
            onCancel={cancel}
            saveButtonLabel="Save Me"
            cancelButtonLabel="Cancel Me"
            attributes={data.desc}
            instructions="Star this repo!"
          />
            </p>
          </div>
        </div>
      )}
    </Widget>
  )
}

export default Contact;
