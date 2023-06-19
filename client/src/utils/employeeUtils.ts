import { Employee } from '../types';
import populationData from './populationData.json';

//Library to generate fake data
const { faker } = require('@faker-js/faker');

/**
 * This function generates new employees.
 * It calculates their individual data such as hiring date, which is based on their position in the hiring order,
 * and sets their start date to a Monday the correct number of years ago.
 * The new employee's other details are also generated and sent to the server to be added to the database.
 */
export const generateEmployees = async (numEmployees: number): Promise<{employeesPerYear: any[], leavingEmployeesPerYear: any[], newHiresPerYear: any[]}> => {

    //Calculates the number of employees every year, assuming that it tracks with the US population
    const employeesPerYear = calculateEmployeesPerYear(numEmployees, populationData);

    //Calculates the number of employees leaving every year, assuming that 15% of employees leave every year
    const leavingEmployeesPerYear = calculateLeavingEmployeesPerYear(employeesPerYear);

    //Calculates the number of new hires every year, based on next year's employee count
    const newHiresPerYear = calculateNewHiresPerYear(employeesPerYear, leavingEmployeesPerYear);

    //Calculate total number of hires
    const totalHires = calculateTotalHires(newHiresPerYear, employeesPerYear);

    // Array to hold all generated employees
    const allEmployees: Employee[] = [];
    
    // Generate a new employee
    for (let i = 1; i <= totalHires; i++) {
        
        const startDate = calculateStartDate(i, totalHires);

        /**
         * Generate the new employee's details.
         * ID is their position in the hiring order.
         * Sex, first name, middle name, and last name are randomly generated.
         * Start date is calculated above.
         * Position ID, branch ID, and supervisor ID are randomly selected.
         * Status is 'Removed'.
         */
        const newEmployee: Employee = {
            ID: i,
            Sex: faker.person.sex(),
            FirstName: faker.name.firstName(),
            MiddleName: faker.name.firstName(),
            LastName: faker.name.lastName(),
            Email: faker.internet.email(),
            StartDate: startDate.toISOString().split('T')[0],
            PositionID: Math.ceil(Math.random() * 10),
            BranchID: Math.ceil(Math.random() * 10),
            SupervisorID: i === 1 ? null : Math.ceil(Math.random() * (i - 1)),
            Status: 'Removed',
        };

        // Add new employee to the array of all employees
        allEmployees.push(newEmployee);
    }

    // Define the size of each batch, which is the number of employees to send to the server at once, and send the data to the server
    const batchSize = 100;
    await sendEmployeeDataToDatabase(allEmployees, batchSize);

    return {employeesPerYear, leavingEmployeesPerYear, newHiresPerYear};
};

interface YearPopulationData {
    year: number;
    population: number;
}

//Calculates the number of employees every year, assuming that it tracks with the US population
const calculateEmployeesPerYear = (numEmployees: number, populationData: YearPopulationData[]): { year: number; employees: number }[] => {
    const currentYear = new Date().getFullYear();
    const populationThisYear = populationData.find((item) => item.year === currentYear)?.population || 0;
    const employeePercentOfPopulation = numEmployees / populationThisYear;

    const employeesPerYear = populationData.map((data) => {
        return {
            year: data.year,
            employees: Math.round(data.population * employeePercentOfPopulation)
        };
    });

    return employeesPerYear;
};

interface YearEmployeesData {
    year: number;
    employees: number;
}

interface YearLeavingEmployeesData {
    year: number;
    leavingEmployees: number;
}

interface YearNewHiresData {
    year: number;
    newHires: number;
}

//Calculates the number of employees leaving every year, assuming that 15% of employees leave every year
const calculateLeavingEmployeesPerYear = (employeesPerYear: YearEmployeesData[]): YearLeavingEmployeesData[] => {
    return employeesPerYear.map((data) => {
        return {
            year: data.year,
            leavingEmployees: Math.round(data.employees * 0.15),
        };
    });
}

//Calculates the number of new hires every year, based on next year's employee count
const calculateNewHiresPerYear = (employeesPerYear: YearEmployeesData[], leavingEmployeesPerYear: YearLeavingEmployeesData[]): YearNewHiresData[] => {
    return leavingEmployeesPerYear.map((data, index) => {
        if (index === leavingEmployeesPerYear.length - 1) {
            // No new hires for the last year, since there's no next year data
            return {
                year: data.year,
                newHires: 0
            };
        } else {
            const thisYearEmployees = employeesPerYear[index].employees;
            const nextYearEmployees = employeesPerYear[index + 1].employees;
            const newHires = Math.max(nextYearEmployees - thisYearEmployees + data.leavingEmployees, 0);
            return {
                year: data.year,
                newHires: newHires
            };
        }
    });
}

//Calculate total number of hires
const calculateTotalHires = (newHiresPerYear: YearNewHiresData[], employeesPerYear: YearEmployeesData[]): number => {
    let totalHires = newHiresPerYear.reduce((total, data) => total + data.newHires, 0);

    // Add initial number of employees from 1950
    const initialEmployees = employeesPerYear.find(data => data.year === 1950)?.employees || 0;
    totalHires += initialEmployees;

    return totalHires;
}

/**
* Calculate the number of years the employee has been employed,
* based on their position in the hiring order.
*/
const calculateStartDate = (employeeNumber: number, totalEmployees: number): Date => {
    const yearsEmployed = (1/-0.17) * Math.log(employeeNumber / totalEmployees);
    const daysEmployed = Math.floor(yearsEmployed * 365.25); 

    let startDate = new Date();
    startDate.setDate(startDate.getDate() - daysEmployed);

    // Set the start date to a Monday the correct number of years ago
    startDate = getPreviousMonday(startDate);

    return startDate;
}

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
    const response = await fetch('http://localhost:3001/api/employees?limit=$(limit)'); // Replace with server URL and endpoint

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        // Parse the data as JSON and return
        const employees: Employee[] = await response.json();
        return employees;
    }
};

//Get the previous Monday from a given date
function getPreviousMonday(date: Date): Date {
    const day = date.getDay();
    if(day !== 1) { // Only adjust if not Monday
        let diff = date.getDate() - day + (day === 0 ? -6:1); // adjust when day is Sunday
        return new Date(date.setDate(diff));
    }
    return date;
}
