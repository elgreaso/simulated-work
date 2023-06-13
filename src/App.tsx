//Import EmployeeList component and pass in hardcoded employees
import React from 'react';
import EmployeeList from './components/EmployeeList';

const App: React.FC = () => {
  const employees = [
    { id: 1, name: 'John Doe', position: 'Software Engineer' },
    { id: 2, name: 'Jane Smith', position: 'Project Manager' },
    // add more hardcoded employees as needed
  ];

  return (
    <div>
      <h1>Task Allocation and Scheduling App</h1>
      <EmployeeList employees={employees} />
    </div>
  );
};

export default App;
