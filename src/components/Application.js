import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "./DayList";

import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {

    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {

      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));

    });
  }, []);

  let dailyAppointments = [];
  dailyAppointments = getAppointmentsForDay(state, state.day);
  let dailyInterviewers = getInterviewersForDay(state, state.day);

  function bookInterview(id, interview) {

    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then((response) => {
        console.log("hey",response);
        setState({...state, appointments});
      })
      
  }

  const calendar = dailyAppointments.map((appointment) => {

    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {calendar}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}


  // const daysUrl = "http://localhost:8001/api/days"
  //   useEffect(() => {
  //     axios.get(daysUrl).then(response => {
  //       setDays([...response.data])
  //     });
  // }, [])  <--- my old code

  // const calendar = dailyAppointments.map(appointment => {
  //   return (
  //     <Appointment key={appointment.id} {...appointment} />
  //   )
  // })

  // const setDays = days => setState(prev => ({ ...prev, days }));