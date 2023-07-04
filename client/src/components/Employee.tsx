import React from 'react';
import { Employee as EmployeeType } from '../types';  // Import the Employee interface

interface EmployeeProps {
  employee: EmployeeType;
}

const Employee: React.FC<EmployeeProps> = ({ employee }) => {
  const startDate = new Date(employee.StartDate);
  const startDateString = startDate.toLocaleDateString("en-US");

  const endDate = employee.EndDate ? new Date(employee.EndDate) : null;
  const endDateString = endDate ? endDate.toLocaleDateString("en-US") : "N/A";

  const dob = new Date(employee.DOB);
  const dobString = dob.toLocaleDateString("en-US");

  console.log(employee.ID);

  return (
    <div>
      <h2>{employee.FirstName} {employee.MiddleName} {employee.LastName}</h2>
      <p>ID: {employee.ID}</p>
      <p>Date of Birth: {dobString}</p>
      <p>Sex: {employee.Sex}</p>
      <p>Email: {employee.Email}</p>
      <p>Start Date: {startDateString}</p>
      <p>End Date: {endDateString}</p>
      <p>Education Level: {employee.EducationLevel}</p>
      <p>YearsExperience: {employee.YearsExperience}</p>
      <p>Position ID: {employee.PositionID}</p>
      <p>Branch ID: {employee.BranchID}</p>
      <p>Supervisor ID: {employee.SupervisorID}</p>
      <p>Status: {employee.Status}</p>
      {/* Display other fields as needed */}
    </div>
  );
};

export default Employee;
