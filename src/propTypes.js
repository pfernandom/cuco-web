import PropTypes from 'prop-types';

export const patientType = PropTypes.shape({
  firstName: PropTypes.string,
  lastName: PropTypes.string,
});

export const appointmentType = PropTypes.shape({
  patientId: PropTypes.string,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
});
