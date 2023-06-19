import React from 'react';
import { Employee as EmployeeType } from '../types';  // Import the Employee interface

interface EmployeeProps {
  employee: EmployeeType;
}

const Employee: React.FC<EmployeeProps> = ({ employee }) => {
  console.log(employee); // Debug: check the data received from the server
  return (
    <div>
      <h2>{employee.FirstName} {employee.MiddleName} {employee.LastName}</h2>
      <p>{employee.ID}</p>
      <p>{employee.Sex}</p>
      <p>{employee.Email}</p>
      <p>{employee.StartDate}</p>
      <p>{employee.PositionID}</p>
      <p>{employee.BranchID}</p>
      <p>{employee.SupervisorID}</p>
      <p>{employee.Status}</p>
      {/* Display other fields as needed */}
    </div>
  );
};

export default Employee;
