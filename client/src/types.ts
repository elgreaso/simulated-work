/**
 * `Employee` Interface
 * 
 * Represents an employee in the system.
 * 
 * @param id - The unique ID of the employee.
 * @param sex - The employee's sex, typically 'M' or 'F'.
 * @param firstName - The employee's first name.
 * @param middleName - The employee's middle name.
 * @param lastName - The employee's last name.
 * @param email - The employee's email address.
 * @param startDate - The date when the employee started working, formatted as 'yyyy-mm-dd'.
 * @param positionID - The ID of the employee's current position in the company.
 * @param branchID - The ID of the branch where the employee is currently working.
 * @param supervisorID - The ID of the employee's direct supervisor. Can be `null` if the employee has no supervisor (e.g., CEO).
 * @param status - The employee's status in the company (e.g., 'Active', 'On Leave', 'Retired', etc.).
 */

export interface Employee {
    id: number;
    sex: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    startDate: string;
    positionID: number;
    branchID: number;
    supervisorID: number | null;
    status: string;
}

/**
 * `EmployeeListProps` Interface
 * 
 * Represents the properties passed to the `EmployeeList` component.
 * 
 * @param employees - An array of employees to be displayed in the list.
 */

export interface EmployeeListProps {
    employees: Employee[];
}

//Create an interface for the state to store the form input values
export interface ParameterFormState {
    employeeCount: number;
    maxGroupSize: number;
    minGroupSize: number;
    maxGroupCount: number;
    minGroupCount: number;
    employeesPerYear: { year: number, employees: number }[];
    //add more state properties here
}