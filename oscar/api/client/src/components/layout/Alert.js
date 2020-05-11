import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => {
    // console.log('alerts', alerts);
    return alerts !== null
        && alerts.length > 0
        && alerts.map(al => (
            <div key={al.id} className={`alert alert-${al.alertType}`}>
                {al.msg}
            </div>
        ));
}

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
