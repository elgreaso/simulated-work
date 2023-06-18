//Create the ParameterForm component
import React, { useState } from 'react';
import { ParameterFormState, Employee } from '../types';
import { generateEmployees, getEmployeeDataFromDatabase } from '../utils/employeeUtils';

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
        maxGroupSize: 0,
        minGroupSize: 0,
        maxGroupCount: 0,
        minGroupCount: 0,
        employeesPerYear: [],
    };

    // Create state variables and their setter functions using the 'useState' hook.
    const [state, setState] = useState<ParameterFormState>(initialState);
    const [employeesPerYear, setEmployeesPerYear] = useState<{ year: number, employees: number }[]>([]);
    const [leavingEmployeesPerYear, setLeavingEmployeesPerYear] = useState<{ year: number, leavingEmployees: number }[]>([]);
    const [newHiresPerYear, setNewHiresPerYear] = useState<{ year: number, newHires: number }[]>([]);

    // Create a function to handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
          ...state,
          [e.target.name]: Number(e.target.value),  // convert input string to number
        });
    };

    //Create a function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {employeesPerYear, leavingEmployeesPerYear, newHiresPerYear} = await generateEmployees(state.employeeCount);

        const dbEmployees = await getEmployeeDataFromDatabase();
        setEmployees(dbEmployees);
        setEmployeesPerYear(employeesPerYear);
        setLeavingEmployeesPerYear(leavingEmployeesPerYear);
        setNewHiresPerYear(newHiresPerYear);

        console.log(state);
    };

    return (
        <div>
            <h2>New Hires per Year:</h2>
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
            ))}

            <form onSubmit={handleSubmit}>
                <label>
                    Employee Count:
                    <input type="number" name="employeeCount" value={state.employeeCount} onChange={handleInputChange} />
                </label>
                <label>
                    Maximum Group Size:
                    <input type="number" name="maxGroupSize" value={state.maxGroupSize} onChange={handleInputChange} />
                </label>
                <label>
                    Minimum Group Size:
                    <input type="number" name="minGroupSize" value={state.minGroupSize} onChange={handleInputChange} />
                </label>
                <label>
                    Maximum Group Count:
                    <input type="number" name="maxGroupCount" value={state.maxGroupCount} onChange={handleInputChange} />
                </label>
                <label>
                    Minimum Group Count:
                    <input type="number" name="minGroupCount" value={state.minGroupCount} onChange={handleInputChange} />
                </label>
                {/* Add additional input fields as needed */}
                <button type="submit">Submit</button>
                <label>
                    Number of Employees:
                    <input type="number" value={state.employeeCount} onChange={handleInputChange} />
                </label>
                <button type="submit">Generate</button>
            </form>
        </div>
    );
};

export default ParameterForm;