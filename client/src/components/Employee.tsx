import React from 'react';
import { Employee } from '../types';

/**
 * `EmployeeComponent` Component
 * 
 * Represents an individual employee.
 * 
 * Renders the employee's details as text inside a <div> element.
 */

const EmployeeComponent: React.FC<Employee> = ({ id, sex, firstName, middleName, lastName, email, startDate, positionID, branchID, supervisorID, status }) => {
  return (
    <div>
      <h2>{firstName}</h2> <h2>{middleName}</h2> <h2>{lastName}</h2>
      <p>{email}</p> <p>{startDate}</p> <p>{positionID}</p>
      <p>{id}</p> <p>{sex}</p> <p>{branchID}</p> <p>{supervisorID}</p> <p>{status}</p>
    </div>
  );
};

export default EmployeeComponent;
