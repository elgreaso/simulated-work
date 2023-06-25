import { Employee } from '../types';

/**
 * Asynchronously send employee data to a database server in smaller batches.
 * 
 * The purpose of sending in batches is to avoid overwhelming the server with too much data at once. 
 * This function loops through the entire list of employees and sends a batch to the server at each iteration.
 * The size of the batch is determined by the batchSize parameter.
 *
 * If the server's response indicates an error (response.ok is false), the function throws an error with the response status.
 *
 * @param allEmployees - An array containing all employee data.
 * @param batchSize - The number of employees to be sent to the server in each batch.
 * 
 * @throws Will throw an error if the server response indicates an unsuccessful request.
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
 * Asynchronously fetch employee data from a database server.
 * 
 * This function sends a GET request to the server to retrieve employee data.
 * The number of employee records retrieved is determined by the limit parameter.
 * If the server's response indicates an error (response.ok is false), the function throws an error with the response status.
 * If the server's response indicates success, the function returns the parsed employee data.
 *
 * @param limit - The maximum number of employee records to retrieve from the server. Defaults to 100 if not specified.
 * 
 * @return A promise that resolves to an array of Employee objects.
 * 
 * @throws Will throw an error if the server response indicates an unsuccessful request.
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
