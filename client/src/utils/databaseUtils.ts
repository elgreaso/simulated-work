import { Employee } from '../types';

// Send the employees to the server in batches
const sendEmployeeDataToDatabase = async (allEmployees: Employee[], batchSize: number) => {
    // Send the employees to the server in batches
    for (let i = 0; i < allEmployees.length; i += batchSize) {
        const batch = allEmployees.slice(i, i + batchSize);
        const response = await fetch('http://localhost:3001/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(batch)
        });

        // Throw an error if the request was not successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
}

// This function fetches the employee data from the server
export const getEmployeeDataFromDatabase = async (limit: number): Promise<Employee[]> => {
    limit = limit || 100; // Default to 100 employees
    // Fetch data from the server
    const response = await fetch(`http://localhost:3001/api/employees?limit=${limit}`); // Replace with server URL and endpoint

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        // Parse the data as JSON and return
        const employees: Employee[] = await response.json();
        return employees;
    }
};