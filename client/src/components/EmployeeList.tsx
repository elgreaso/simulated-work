import React from 'react';
import { EmployeeListProps } from '../types';
import EmployeeComponent from './Employee';

/**
 * `EmployeeList` Component
 * 
 * Represents a list of employees.
 * 
 * Maps over the `employees` array passed as a prop and renders an `EmployeeComponent` for each employee.
 */

const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
    return (
      <div>
        {employees.map((employee) => (
          <EmployeeComponent key={employee.id} {...employee} />
        ))}
      </div>
    );
};

export default EmployeeList;
