//Create the ParameterForm component
import React, {useState} from 'react';

//Create an interface for the state to store the form input values
interface ParameterFormState {
    employeeCount: number;
    maxGroupSize: number;
    minGroupSize: number;
    maxGroupCount: number;
    minGroupCount: number;
    //add more state properties here
}

const ParameterForm: React.FC = () => {
    const [state, setState] = useState<ParameterFormState>({
        employeeCount: 0,
        maxGroupSize: 0,
        minGroupSize: 0,
        maxGroupCount: 0,
        minGroupCount: 0,
        //Set the initial values of the other parameters here
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
          ...state,
          [e.target.name]: Number(e.target.value),  // convert input string to number
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //Use the state values here to populate database
        //For now, log the state to the console
        console.log(state);
    };

    return (
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
        </form>
    );
};

export default ParameterForm;