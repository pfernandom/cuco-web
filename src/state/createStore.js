import logger from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from '.';

import { patientMiddleware, requestInialPatients, requestAppointments } from './app';

// preloadedState will be passed in by the plugin
export default preloadedState => {
  const store = createStore(
    rootReducer,
    applyMiddleware(patientMiddleware, logger),
    preloadedState,
  );
  store.dispatch(requestInialPatients());
  store.dispatch(requestAppointments());
  return store;
};
