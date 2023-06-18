//This file represents an individual employee in the list of employees
//It is a stateless component that is passed the employee object as a prop
import React from 'react';

//Define the syntax that must be followed to create an Employee object.
export interface Employee {
  id: number;
  sex: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  startDate: string;
  positionID: number;
  branchID: number;
  supervisorID: number | null;
  status: string;
}

//Define the component as a function that takes in the props and returns the JSX
// eslint-disable-next-line @typescript-eslint/no-redeclare
const Employee: React.FC<Employee> = ({ id, sex, firstName, middleName, lastName, email, startDate, positionID, branchID, supervisorID, status }) => {
  return (
    <div>
      <h2>{firstName}</h2> <h2>{middleName}</h2> <h2>{lastName}</h2>
      <p>{email}</p> <p>{startDate}</p> <p>{positionID}</p>
      <p>{id}</p> <p>{sex}</p> <p>{branchID}</p> <p>{supervisorID}</p> <p>{status}</p>
    </div>
  );
};

export default Employee;
