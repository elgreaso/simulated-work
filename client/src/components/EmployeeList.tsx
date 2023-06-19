// EmployeeList.tsx
import React from 'react';
import Employee from './Employee';
import { Employee as EmployeeType } from '../types';  // Import the Employee interface

interface EmployeeListProps {
  employees: EmployeeType[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
  //console.log(employees); // Debug: check the data received from the server
  return (
    <div>
      {employees.length > 0 
        ? employees.map((employee: EmployeeType) => {
            //console.log(employee); // Debug: check the employee ID
            return <Employee key={employee.ID} employee={employee} />;
          })
        : <p>No employees found</p>
      }
    </div>
  );
};

export default EmployeeList;
