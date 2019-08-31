import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { patientType, appointmentType } from '../propTypes';

import './index.css';

import { createPatient, createAppointment } from '../state/app';

function PatientList({ patients = [] }) {
  return (
    <ul className="patient__list">
      <li className="patient__list-item patient_list-heading">
        <span>Nombre</span>
        <span>Fecha de Nacimiento</span>
      </li>
      {patients.reverse().map(p => (
        <li className="patient__list-item" key={p._id}>
          <span>
            {p.firstName} {p.lastName || '-'}
          </span>
          <span>{p.dob || '-'}</span>
        </li>
      ))}
    </ul>
  );
}

PatientList.propTypes = {
  patients: PropTypes.arrayOf(patientType),
};

function PatientForm({ onSubmit }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function createUser(ev) {
    ev.preventDefault();
    const { firstName, lastName, dob } = ev.target.elements;
    const body = {
      firstName: firstName.value,
      lastName: lastName.value,
      dob: dob.value,
    };
    ev.target.reset();
    setIsExpanded(false);
    onSubmit(body);
  }

  function expandForm() {
    setIsExpanded(!isExpanded);
  }

  return (
    <form className="patient__creation-form" onSubmit={createUser}>
      <button className="btn" onClick={expandForm} type="button">
        Crear nuevo paciente
      </button>
      {isExpanded && (
        <>
          <div className="form__field">
            <label htmlFor="firstName">Nombre:</label>
            <input className="line-input" id="firstName" name="firstName" required autoFocus />
          </div>
          <div className="form__field">
            <label htmlFor="lastName">Apellido:</label>
            <input className="line-input" id="lastName" name="lastName" />
          </div>
          <div className="form__field">
            <label htmlFor="dob">Fecha de Nacimiento:</label>
            <input
              className="line-input"
              id="dob"
              type="date"
              name="dob"
              defaultValue={new Date()}
            />
          </div>
          <button className="btn" type="submit">
            Crear paciente
          </button>
        </>
      )}
    </form>
  );
}
PatientForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

function AppointmentForm({ patients, onSubmit }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function submit(ev) {
    ev.preventDefault();
    const { person, date, description, time } = ev.target.elements;
    const body = {
      patientId: person.value,
      date: date.value,
      description: description.value,
      time: time.value,
    };
    ev.target.reset();
    setIsExpanded(false);
    onSubmit(body);
  }

  function showMoreFields() {
    setIsExpanded(!isExpanded);
  }

  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);
  const nowString = today.toLocaleTimeString().slice(0, 5);

  return (
    <form className="patient__creation-form" onSubmit={submit}>
      {!isExpanded ? (
        <button className="btn" onClick={showMoreFields}>
          Nueva cita
        </button>
      ) : (
        <>
          <div className="form__field">
            <label htmlFor="patient-select-list">Paciente</label>
            <select className="line-input" id="patient-select-list" name="person" autoFocus>
              {patients.map(p => (
                <option key={p._id} value={p._id}>
                  {p.lastName}, {p.firstName}
                </option>
              ))}
            </select>
          </div>
          <div className="form__field">
            <label htmlFor="date">Fecha de la cita: </label>
            <input
              className="line-input"
              required
              type="date"
              id="date"
              name="date"
              defaultValue={todayString}
              min={todayString}
            />
          </div>
          <div className="form__field">
            <label htmlFor="time">Hora de la cita:</label>
            <input
              required
              className="line-input"
              id="time"
              type="time"
              name="time"
              defaultValue={nowString}
              step="30"
            />
          </div>
          <div className="form__field">
            <label htmlFor="description">Descripcion:</label>
            <textarea
              name="description"
              id="description"
              required
              placeholder="Cual es el tema de la cita?"
            />
          </div>
          <button className="btn" type="submit">
            Crear cita
          </button>
        </>
      )}
    </form>
  );
}
AppointmentForm.propTypes = {
  patients: PropTypes.arrayOf(patientType),
  onSubmit: PropTypes.func.isRequired,
};

function AppointmentList({ appointments = [] }) {
  return (
    <ul className="patient__list">
      <li className="patient__list-item patient_list-heading">
        <span>Paciente</span>
        <span>Fecha</span>
        <span>Hora</span>
        <span>Descripcion</span>
      </li>
      {appointments.map(a => (
        <li className="patient__list-item" key={a._id}>
          <span>
            {a.patient.firstName} {a.patient.lastName}
          </span>
          <span>{a.date}</span>
          <span>{a.time}</span>
          <span>{a.description}</span>
        </li>
      ))}
    </ul>
  );
}
AppointmentList.propTypes = {
  appointments: PropTypes.arrayOf(appointmentType),
};

function getClosestAppointment(appointments = []) {
  return appointments[0] || {};
}

const IndexPage = ({ patients = [], appointments = [], createPatient, createAppointment }) => {
  const closesAppointment = getClosestAppointment(appointments);
  return (
    <Layout>
      <SEO title="Home" />
      <section className="notification">
        <h2>Centro de Notificationes</h2>
        <p>
          Bienvenido, usted tiene <span className="notification__count">{appointments.length}</span>{' '}
          citas hoy.
        </p>
        <p>
          La mas cercana sera a las{' '}
          <span className="notification__count">{closesAppointment.time}</span>
        </p>
      </section>
      <section className="appointments">
        <h2>Citas</h2>
        <AppointmentForm patients={patients} onSubmit={createAppointment}></AppointmentForm>
      </section>

      <section className="patients">
        <h2>Citas Pendientes</h2>
        <AppointmentList appointments={appointments} />
      </section>

      <section className="patients">
        <h2>Pacientes</h2>
        <PatientForm onSubmit={createPatient} />
        <PatientList patients={patients} />
      </section>
    </Layout>
  );
};

IndexPage.propTypes = {
  patients: PropTypes.arrayOf(patientType),
  appointments: PropTypes.arrayOf(appointmentType),
  createPatient: PropTypes.func.isRequired,
  createAppointment: PropTypes.func.isRequired,
};

export default connect(
  state => {
    return {
      patients: state.app.patients,
      appointments: state.app.appointments,
    };
  },
  {
    createPatient,
    createAppointment,
  },
)(IndexPage);
