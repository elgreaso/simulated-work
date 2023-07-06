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
      <p>Years Experience: {employee.YearsExperience}</p>
      <p>Street Address: {employee.StreetAddress}</p>
      <p>City: {employee.City}</p>
      <p>State: {employee.State}</p>
      <p>Zip Code: {employee.ZipCode}</p>
      <p>Country: {employee.Country}</p>
      <p>Cell Number: {employee.CellNumber}</p>
      <p>Home Number: {employee.HomeNumber}</p>
      <p>Work Number: {employee.WorkNumber}</p>
      <p>Position ID: {employee.PositionID}</p>
      <p>Employment Type: {employee.EmploymentType}</p>
      <p>Salary ID: {employee.SalaryID}</p>
      <p>Branch ID: {employee.BranchID}</p>
      <p>Supervisor ID: {employee.SupervisorID}</p>
      <p>Status: {employee.Status}</p>
      {/* Display other fields as needed */}
    </div>
  );
};

export default Employee;
