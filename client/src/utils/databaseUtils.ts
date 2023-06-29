import { Employee } from '../types';

/**
 * Sends employee data to the database in batches.
 * @param allEmployees An array of Employee objects to send to the database.
 * @param batchSize The number of employees to send in each batch.
 * @throws An error if the HTTP response status is not ok.
 */
export const sendEmployeeDataToDatabase = async (allEmployees: Employee[], batchSize: number) => {
    for (let i = 0; i < allEmployees.length; i += batchSize) {
        const batch = allEmployees.slice(i, i + batchSize);

        const response = await fetch('http://localhost:3001/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(batch)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
};

/*-----------------------------------------------------------------------------*/

/**
 * Retrieves employee data from the database.
 * @param limit The maximum number of employees to retrieve. Defaults to 100.
 * @returns A Promise that resolves to an array of Employee objects.
 * @throws An error if the HTTP response status is not ok.
 */
export const getEmployeeDataFromDatabase = async (limit: number = 100): Promise<Employee[]> => {
    const response = await fetch(`http://localhost:3001/api/employees?limit=${limit}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const employees: Employee[] = await response.json();
        return employees;
    }
};
