import fetch from 'node-fetch';

/* eslint-disable no-case-declarations */
const API_HOST = 'http://localhost:8080';

const initialState = {
  patients: [],
  appointments: [],
};

const REQUEST_PATIENTS = 'REQUEST_PATIENTS';
const LOAD_PATIENTS = 'LOAD_PATIENTS';
const CREATE_PATIENT = 'CREATE_PATIENT';
const REQUEST_APPOINTMENTS = 'REQUEST_APPOINTMENTS';
const LOAD_APPOINTMENTS = 'LOAD_APPOINTMENTS';
const CREATE_APPOINTMENT = 'CREATE_APPOINTMENT';

// Actions
export const loadPatients = patients => ({
  type: LOAD_PATIENTS,
  patients,
});

export const requestInialPatients = () => ({
  type: REQUEST_PATIENTS,
});

export const createPatient = patient => ({
  type: CREATE_PATIENT,
  patient,
});

export const createAppointment = appointment => ({
  type: CREATE_APPOINTMENT,
  appointment,
});

export const requestAppointments = () => ({
  type: REQUEST_APPOINTMENTS,
});

export const loadAppointments = appointments => ({
  type: LOAD_APPOINTMENTS,
  appointments,
});

async function fetchPatients() {
  const response = await fetch(`${API_HOST}/patient`);
  return await response.json();
}

async function postPatient(patient) {
  const response = await fetch(`${API_HOST}/patient`, {
    method: 'post',
    body: JSON.stringify(patient),
  });
  return await response.json();
}

async function fetchAppointments() {
  const response = await fetch(`${API_HOST}/appointment`);
  return await response.json();
}

async function postAppointment(appointment) {
  const response = await fetch(`${API_HOST}/appointment`, {
    method: 'post',
    body: JSON.stringify(appointment),
  });
  return await response.json();
}

// Reducers
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PATIENTS:
      return { ...state, patients: action.patients };
    case LOAD_APPOINTMENTS:
      return { ...state, appointments: action.appointments };
    default:
      return state;
  }
};

// Middleware/Reducer
export const patientMiddleware = ({ getState, dispatch }) => next => async action => {
  const result = next(action);
  switch (action.type) {
    case REQUEST_PATIENTS:
      const patients = await fetchPatients();
      dispatch(loadPatients(patients));
      break;
    case CREATE_PATIENT:
      const newPatient = await postPatient(action.patient);
      const oldPatientList = getState().app.patients;
      const newPatientList = [newPatient, ...oldPatientList];
      dispatch(loadPatients(newPatientList));
      break;
    case REQUEST_APPOINTMENTS:
      const appointments = await fetchAppointments();
      dispatch(loadAppointments(appointments));
      break;
    case CREATE_APPOINTMENT:
      await postAppointment(action.appointment);
      dispatch(requestAppointments());
  }
  return Promise.resolve(result);
};
