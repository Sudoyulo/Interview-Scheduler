import React from 'react'
import "components/Appointment/styles.scss";
import useVisualMode from 'hooks/useVisualMode';
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) { //saves interviewer on edit and create
    const interview = {
      student: name,
      interviewer
    };

    if (interviewer) {
      transition(SAVING);
      props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error)=> {
        console.log("Error", error)
        transition(ERROR_SAVE, true)
      })
    } else { //no interviewer
      transition(ERROR_SAVE, true)
    }
  }

  function cancelInterview() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY)
      })
      .catch((error)=> transition(ERROR_DELETE, true)) 
  }

  function confirm() {
    transition(CONFIRM);
  }

  function edit(){
    transition(EDIT);
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={edit}
          onDelete={confirm}
        />
      )}
      {mode === CREATE && <Form name="" interviewer={null} interviewers={props.interviewers} onSave={save} onCancel={back} />}
      {mode === SAVING && <Status message="Please wait" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && <Confirm message="Are you sure you want delete this appointment?" onCancel={back} onConfirm={cancelInterview} />}
      {mode === EDIT && <Form name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onSave={save} onCancel={back} edit={1} />}
      {mode === ERROR_SAVE && <Error message={"Failed to save"} onClose={back}/>}
      {mode === ERROR_DELETE && <Error message={"Failed to delete"} onClose={back}/>}
    </article>

  );
};