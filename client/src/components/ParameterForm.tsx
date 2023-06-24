//Create the ParameterForm component
import React, { useState } from 'react';
import { ParameterFormState, Employee } from '../types';
import { generateEmployees } from '../utils/employeeGenerate';
import { getEmployeeDataFromDatabase } from '../utils/databaseUtils';


/**
 * `ParameterForm` Component
 *
 * Provides an interface for the user to enter various parameters for employee generation.
 * 
 * After form submission, it fetches employee data from the database and updates the parent component's state.
 */

const ParameterForm: React.FC<{ setEmployees: (employees: Employee[]) => void }> = ({ setEmployees }) => {

    //Create state to store the form input values
    const initialState: ParameterFormState = {
        employeeCount: 0,
        limit: 0,
        randomSeed: Math.floor(Math.random() * 1000000),
        startYear: 1950,
        endYear: 2100,
        empHalfLife: 5,
        // Add other form fields as needed
    };

    // Create state variables and their setter functions using the 'useState' hook.
    const [state, setState] = useState<ParameterFormState>(initialState);
    // const [employeesPerYear, setEmployeesPerYear] = useState<{ year: number, employees: number }[]>([]);
    // const [leavingEmployeesPerYear, setLeavingEmployeesPerYear] = useState<{ year: number, leavingEmployees: number }[]>([]);
    // const [newHiresPerYear, setNewHiresPerYear] = useState<{ year: number, newHires: number }[]>([]);

    // Create a function to handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
          ...state,
          [e.target.name]: Number(e.target.value),  // convert input string to number
        });
    };

    // Create a function to handle form submission
    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {            
            const employeeCount = state.employeeCount; // Or however you're getting the count
            const startYear = state.startYear;
            const endYear = state.endYear;
            const empHalfLife = state.empHalfLife;
            generateEmployees(employeeCount, startYear, endYear, empHalfLife);
            //const {employeesPerYear, leavingEmployeesPerYear, newHiresPerYear} = await generateEmployees(employeeCount);
            // setEmployeesPerYear(employeesPerYear);
            // setLeavingEmployeesPerYear(leavingEmployeesPerYear);
            // setNewHiresPerYear(newHiresPerYear);
        } catch (error) {
            console.error("An error occurred while generating or fetching employees:", error);
            // Here you might want to update your UI to indicate that an error occurred
        }
    };

    // Create a function to handle form submission
    const handleRetrieve = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const limit = state.limit; // Or however you're getting the count            
            const dbEmployees = await getEmployeeDataFromDatabase(limit);
            setEmployees(dbEmployees);
        } catch (error) {
            console.error("An error occurred while generating or fetching employees:", error);
            // Here you might want to update your UI to indicate that an error occurred
        }
    };

    return (
        <div>

            <form onSubmit={handleGenerate}>
                <label>
                    Random Seed:
                    <input type="number" name="randomSeed" value={state.randomSeed} onChange={handleInputChange} />
                </label>
                <label>
                    Employee Count:
                    <input type="number" name="employeeCount" value={state.employeeCount} onChange={handleInputChange} />
                </label>
                <label>
                    Start Year:
                    <input type="number" name="startYear" value={state.startYear} onChange={handleInputChange} />
                </label>
                <label>
                    End Year:
                    <input type="number" name="endYear" value={state.endYear} onChange={handleInputChange} />
                </label>
                <label>
                    Employee Half-Life:
                    <input type="number" name="empHalfLife" value={state.empHalfLife} onChange={handleInputChange} />
                </label>
                {/* Add additional input fields as needed */}
                <button type="submit">Generate</button>
            </form>

            <form onSubmit={handleRetrieve}>
                <label>
                    Retrieve Records:
                    <input type="number" name="limit" value={state.limit} onChange={handleInputChange} />
                </label>
                {/* Add additional input fields as needed */}
                <button type="submit">Retrieve</button>

            </form>

            {/* <h2>New Hires per Year:</h2>
            {newHiresPerYear.map(data => (
                <div key={data.year}>
                    Year: {data.year}, New Hires: {data.newHires}
                </div>
            ))}

            <h2>Employees per Year:</h2>
            {employeesPerYear.map(data => (
                <div key={data.year}>
                    Year: {data.year}, Employees: {data.employees}
                </div>
            ))}

            <h2>Employees Leaving per Year:</h2>
            {leavingEmployeesPerYear.map(data => (
                <div key={data.year}>
                    Year: {data.year}, Leaving Employees: {data.leavingEmployees}
                </div>
            ))} */}

        </div>
    );
};

export default ParameterForm;