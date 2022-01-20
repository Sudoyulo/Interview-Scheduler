import React from "react";
import "components/InterviewerListItem.scss";
import classNames from "classnames";

export default function InterviewerListItem(props) {

  const { name, selected, avatar, setInterviewer, key } = props;

  const buttonClass = classNames("interviewers__item", {
    "interviewers__item--selected": selected
  });

  return (

    <li className={buttonClass} onClick={setInterviewer} key={key}>
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
      {selected && name}
    </li>

  );
}