import React from 'react';
import {Route, Switch} from 'react-router-dom';
import { Link } from 'react-router-dom';
import Profile from '../profile/Profile';
import Routes from '../routing/Routes';

const DashboardActions = () => {
  
  return (
    <span class='dash-buttons'>
    
      <Link to='/edit-profile' class=''>
       <button className='btn btn-primary ' ><i class='fas fa-user-circle text-light' /> Edit Profile</button> 
      </Link>
      <Link to='/add-experience' class=''>
        <button className='btn btn-info my-1'><i class='fab fa-black-tie text-primary' /> Add Experience</button>
      </Link>
      <Link to='/add-education' class=''>
       <button className="btn btn-primary "><i class='fas fa-graduation-cap text-light' /> Add Education</button> 
      </Link>
    </span>
  );
};

export default DashboardActions;
