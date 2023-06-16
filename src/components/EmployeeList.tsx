//This component represents a list of employees
//It is a stateless component that is passed an array of employees as a prop
//It renders the Employee component for each employee in the array
import React from 'react';
import Employee from './Employee';

//Define an interface for the props that are passed to this component
interface EmployeeData {
  id: number;
  sex: string;
  firstName: string;
  lastName: string;
  position: string;
}

interface EmployeeListProps {
    employees: EmployeeData[];
}

//Define the component as a function that takes in the props and returns the JSX
const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
    return (
      <div>
        {employees.map((employee) => (
          <Employee key={employee.id} {...employee} />
        ))}
      </div>
    );
};

//Export the component
export default EmployeeList;