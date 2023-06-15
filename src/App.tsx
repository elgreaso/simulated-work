//Import EmployeeList component and pass in hardcoded employees
import React, { useEffect, useState } from 'react';
import EmployeeList from './components/EmployeeList';
import ParameterForm from './components/ParameterForm';
import { Employee } from './components/Employee';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  //Fetch employees from the API
  useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(err => console.error(err));
  }, []);

  //Render the JSX
  return (
    <div>
      <h1>Task Allocation and Scheduling App</h1>
      <ParameterForm setEmployees={setEmployees} />
      <EmployeeList employees={employees} />
      {/* The rest of the App component JSX */}
    </div>
  );
};

export default App;
