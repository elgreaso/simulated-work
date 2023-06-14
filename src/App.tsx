//Import EmployeeList component and pass in hardcoded employees
import React, { useEffect, useState } from 'react';
import EmployeeList from './components/EmployeeList';
import ParameterForm from './components/ParameterForm';
import { Employee } from './interfaces/Employee';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'John Doe', position: 'Software Engineer' },
    { id: 2, name: 'Jane Smith', position: 'Project Manager' },
  ]);

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
      <ParameterForm />
      <EmployeeList employees={employees} />
      {/* The rest of the App component JSX */}
    </div>
  );
};

export default App;
