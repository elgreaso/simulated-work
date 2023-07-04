/**
 * Employee interface - A TypeScript interface representing an Employee.
 *
 * This interface defines the shape of an Employee object, and is used
 * throughout the code to ensure we are working with properly structured data.
 *
 * Each property of an Employee is described as follows:
 * 
 * @property {number} ID - The unique ID of the Employee. This is a unique identifier used to reference an individual Employee across the system.
 * @property {number} DOB - The Employee's date of birth represented as a Unix timestamp. It's crucial for calculations related to the employee's age or eligibility for certain benefits.
 * @property {string} Sex - The sex of the Employee. This can be 'Male', 'Female', or 'Non-binary'. Used for demographic analysis and may have implications for health and insurance programs.
 * @property {string} FirstName - The first name of the Employee. This is used for personal identification and formal address.
 * @property {string} MiddleName - The middle name of the Employee, if any. This is also used for personal identification, but is not always present for every individual.
 * @property {string} LastName - The last name of the Employee. This is used for personal identification and formal address.
 * @property {string} Email - The work email address of the Employee. This is used as the primary method of electronic communication with the Employee.
 * @property {number} StartDate - The start date of the Employee's current employment period, represented as a Unix timestamp. This is used for tenure calculations and benefit eligibility.
 * @property {(number|null)} EndDate - The end date of the Employee's current employment period, represented as a Unix timestamp. This is null if the Employee is currently employed. Used for historical records and post-employment benefit calculations.
 * @property {number} PositionID - A numeric ID representing the Employee's job position within the organization. This can be used to lookup more details about their role, including title, responsibilities, and pay grade.
 * @property {number} BranchID - A numeric ID representing the branch or location where the Employee primarily works. This can be used to lookup details about their work location, including address, region, and associated management.
 * @property {(number|null)} SupervisorID - A numeric ID representing the Employee's direct supervisor. This can be used to establish hierarchical relationships between employees. It is null if the Employee is at the top of the hierarchy (e.g., CEO).
 * @property {string} Status - The current employment status of the Employee. Possible values might include 'Active', 'On Leave', 'Terminated', etc. This can be used for HR reporting, payroll, and access control purposes.
 */
export interface Employee {
    ID: number;
    DOB: number;
    Sex: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Email: string;
    StartDate: number;
    EndDate: number | null;
    EducationLevel: string;
    YearsExperience: number;
    PositionID: number;
    BranchID: number;
    SupervisorID: number | null;
    Status: string;
}

/**
 * EmployeeListProps Interface
 * 
 * Represents the properties (props) passed to the EmployeeList component.
 * This interface is used to enforce a contract for the props object, ensuring that all props passed to EmployeeList are of the expected shape and type.
 *
 * In this case, the EmployeeList component is expecting a single prop: an array of Employee objects.
 *
 * @property {Employee[]} employees - The main prop of the EmployeeList component. This is an array of Employee objects, each of which represents a single employee. Each Employee object should adhere to the structure defined by the Employee interface. The EmployeeList component will use this array to render a list of Employee components, each populated with the data from one Employee object.
 *
 * @see Employee - The interface defining the expected structure of each object in the employees array. Each Employee object should have properties for ID, DOB, Sex, FirstName, MiddleName, LastName, Email, StartDate, EndDate, PositionID, BranchID, SupervisorID, and Status, though some of these may be null.
 */
export interface EmployeeListProps {
    employees: Employee[];
}

/**
 * ParameterFormState interface - A TypeScript interface representing the state of a form used to customize data generation parameters.
 *
 * This interface defines the shape of the state object used in the form to input data generation parameters. It is used in conjunction with useState to manage form inputs and ensure they are of the correct type.
 *
 * Each property of the ParameterFormState is described as follows:
 *
 * @property {number} employeeCount - The total number of Employee records that the user wishes to generate. This value directly determines the size of the dataset produced.
 * @property {number} limit - The maximum limit on the number of Employee records that can be fetched in a single request. This value is used to prevent overloading the server with too large of a data request.
 * @property {number} randomSeed - A seed value for the random number generator used in data generation. By setting this value, the user can ensure that the same "random" dataset can be produced multiple times, which is useful for testing and replication purposes.
 * @property {number} startYear - The earliest year from which an Employee's start date can be randomly selected. This value helps ensure that the generated data is appropriate for the time period being modeled.
 * @property {number} endYear - The latest year from which an Employee's end date can be randomly selected. Similar to startYear, this value helps ensure the temporal accuracy of the generated data.
 * @property {number} empHalfLife - A value representing the "half-life" of an Employee, i.e., the number of years at which point there's a 50% chance an Employee will no longer be with the company. This value is used to calculate the probabilities of Employee tenure durations, and can be used to model different retention rates.
 *
 * @note Additional properties can be added as needed to store more form inputs.
 */
export interface ParameterFormState {
    employeeCount: number;
    limit: number;
    randomSeed: number;
    startYear: number;
    endYear: number;
    empHalfLife: number;
    //add more state properties here
}

/**
 * BirthDate Interface
 * 
 * Represents a structure that associates an Employee's ID with their date of birth. This interface enforces a contract for objects that are meant to store or communicate birth date data specifically related to an employee.
 * 
 * Objects implementing this interface are typically used when we need to handle or manipulate the birth dates of employees separately from their other details or when the birth date is crucial in the processing of certain operations (like calculating age).
 *
 * @property {number} employeeID - Unique identifier for an employee. It is used to relate the provided birth date to a specific employee. The value should correspond to the `ID` property of an existing `Employee` object.
 * @property {Date} birthDate - Represents the date of birth of the employee. Stored as a JavaScript `Date` object, which can easily be manipulated and formatted as needed. When creating a new `BirthDate` object, ensure that the `Date` object is correctly instantiated, typically by using the `new Date()` constructor with the appropriate arguments.
 *
 * @see Employee - The `Employee` interface, which contains the `ID` property that should correspond with the `employeeID` property of `BirthDate` objects. This relationship creates a link between `BirthDate` and `Employee` data.
 */
export interface BirthDate {
    employeeID: number;
    birthDate: Date;
}

/**
 * Type: EducationLevel
 *
 * This type represents the different levels of education that an employee can have.
 */
export type EducationLevel = 'No High School Diploma' | 'High School Diploma' | 'Some College, No Degree' | 'Associate Degree' | 'Bachelor\'s Degree' | 'Master\'s Degree' | 'Doctoral or Professional Degree';
