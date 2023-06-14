//This file represents an individual employee in the list of employees
//It is a stateless component that is passed the employee object as a prop
import React from 'react';

//Define an interface for the props that are passed to this component
interface EmployeeProps {
  id: number;
  name: string;
  position: string;
}

//Define the component as a function that takes in the props and returns the JSX
const Employee: React.FC<EmployeeProps> = ({ id, name, position }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{position}</p>
    </div>
  );
};

export default Employee;
