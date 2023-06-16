//This file represents an individual employee in the list of employees
//It is a stateless component that is passed the employee object as a prop
import React from 'react';

//Define the syntax that must be followed to create an Employee object.
export interface Employee {
  id: number;
  sex: string;
  firstName: string;
  lastName: string;
  position: string;
}

//Define the component as a function that takes in the props and returns the JSX
// eslint-disable-next-line @typescript-eslint/no-redeclare
const Employee: React.FC<Employee> = ({ id, sex, firstName, lastName, position }) => {
  return (
    <div>
      <h2>{firstName}</h2> <h2>{lastName}</h2>
      <p>{id}</p> <p>{sex}</p> <p>{position}</p>
    </div>
  );
};

export default Employee;
