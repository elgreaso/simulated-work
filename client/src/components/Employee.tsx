import React from 'react';
import { Employee as EmployeeType } from '../types';  // Import the Employee interface

interface EmployeeProps {
  employee: EmployeeType;
}

const Employee: React.FC<EmployeeProps> = ({ employee }) => {
  const startDate = new Date(employee.StartDate * 1000);
  const startDateString = startDate.toLocaleDateString("en-US");

  const endDate = employee.EndDate ? new Date(employee.EndDate * 1000) : null;
  const endDateString = endDate ? endDate.toLocaleDateString("en-US") : "N/A";

  const dob = new Date(employee.DOB * 1000);
  const dobString = dob.toLocaleDateString("en-US");

  return (
    <div>
      <h2>{employee.FirstName} {employee.MiddleName} {employee.LastName}</h2>
      <p>ID: {employee.ID}</p>
      <p>Date of Birth: {dobString}</p>
      <p>Sex: {employee.Sex}</p>
      <p>Email: {employee.Email}</p>
      <p>Start Date: {startDateString}</p>
      <p>End Date: {endDateString}</p>
      <p>Position ID: {employee.PositionID}</p>
      <p>Branch ID: {employee.BranchID}</p>
      <p>Supervisor ID: {employee.SupervisorID}</p>
      <p>Status: {employee.Status}</p>
      {/* Display other fields as needed */}
    </div>
  );
};

export default Employee;
