//Create the ParameterForm component
import React, { useState } from 'react';
import { Employee } from './Employee';
import { generateEmployees, getEmployeeDataFromDatabase } from '../utils/employeeUtils';

//Create an interface for the state to store the form input values
interface ParameterFormState {
    employeeCount: number;
    maxGroupSize: number;
    minGroupSize: number;
    maxGroupCount: number;
    minGroupCount: number;
    employeesPerYear: { year: number, employees: number }[];
    //add more state properties here
}

const ParameterForm: React.FC<{ setEmployees: (employees: Employee[]) => void }> = ({ setEmployees }) => {

    //Create state to store the form input values
    const [state, setState] = useState<ParameterFormState>({
        employeeCount: 0,
        maxGroupSize: 0,
        minGroupSize: 0,
        maxGroupCount: 0,
        minGroupCount: 0,
        employeesPerYear: [],
        //Set the initial values of the other parameters here
    });

    //Create state to store the number of employees
    const [employeeCount, setEmployeeCount] = useState<number>(0);

    //Create a function to handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //Update the state
        setState({
          ...state,
          [e.target.name]: Number(e.target.value),  // convert input string to number
        });
        //Update the employee count state
        setEmployeeCount(parseInt(e.target.value));
    };

    const [employeesPerYear, setEmployeesPerYear] = useState<{ year: number, employees: number }[]>([]);
    const [leavingEmployeesPerYear, setLeavingEmployeesPerYear] = useState<{ year: number, leavingEmployees: number }[]>([]);
    const [newHiresPerYear, setNewHiresPerYear] = useState<{ year: number, newHires: number }[]>([]);

    //Create a function to handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {employeesPerYear, leavingEmployeesPerYear, newHiresPerYear} = await generateEmployees(employeeCount);

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
                    <input type="number" value={employeeCount} onChange={handleInputChange} />
                </label>
                <button type="submit">Generate</button>
            </form>
        </div>
    );
};

export default ParameterForm;