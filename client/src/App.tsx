//Import the useState and useEffect hooks from React.
import React, { useEffect, useState } from 'react';
// Import the EmployeeList and ParameterForm components.
import EmployeeList from './components/EmployeeList';
import ParameterForm from './components/ParameterForm';
// Import the Employee interface.
import { Employee } from './types';

// Define the state variable 'employees' and its setter function 'setEmployees' using the 'useState' hook.
const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch the employees from the server when the component mounts.
  useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then(response => response.json())
      .then(data => setEmployees(data))
      .catch(err => console.error(err));
  }, []);

  //Render the JSX, passing the 'setEmployees' function to the ParameterForm component as a prop.
  //Pass the 'employees' state variable to the EmployeeList component as a prop.
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
