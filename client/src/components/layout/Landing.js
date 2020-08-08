import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>DevFolio</h1>
          <p className='lead'>
            Level up your networking game with DevFolio.</p>
            <p className='lead'>
            Create your Portfolio, Showcase your Skills and Engage with other Developers. Please login/register to view detailed profiles of users and their posts.</p>

          <div className='buttons'>
            <Link to='/register' className='btn btn-primary m-1'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light m-1'>
              Login
            </Link>
            <Link to='/profiles' className='btn btn-primary m-1'>
              Developers
            </Link>
            
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
