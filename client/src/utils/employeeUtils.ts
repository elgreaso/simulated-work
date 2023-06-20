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
export const generateEmployees = async (numEmployees: number): Promise<void> => {

    //Calculates the number of employees every year, assuming that it tracks with the US population
    const employeesPerYear = calculateEmployeesPerYear(numEmployees, populationData);

    //Calculates the number of employees leaving every year, assuming that 15% of employees leave every year
    const leavingEmployeesPerYear = calculateLeavingEmployeesPerYear(employeesPerYear);

    //Calculates the number of new hires every year, based on next year's employee count
    const newHiresPerYear = calculateNewHiresPerYear(employeesPerYear, leavingEmployeesPerYear);

    //Calculate total number of hires
    const totalHires = calculateTotalHires(newHiresPerYear);

    //Calculates the initial number of employees from the target year
    let targetStartYear = 1950;
    const initialEmployees = targetStartYearEmployees(employeesPerYear, targetStartYear);

    // Calculate the start date of the initial employees. The employeeHalfLife is the number of years it takes for half of the employees to leave.
    let employeeHalfLife = 5;
    const startDatesInitial = calculateStartDateInitial(initialEmployees, targetStartYear, employeeHalfLife);

    // Calculate the end dates of the initial employees
    const endDatesInitial = calculateEndDatesInitial(targetStartYear, startDatesInitial, employeeHalfLife);

    // Calculate the start date of the rest of the employees
    let targetEndYear = 2100;
    const startDatesAll = calculateStartDatesAll(newHiresPerYear, startDatesInitial, targetStartYear, targetEndYear);

    // Calculate the end dates of all employees
    const endDatesAll = calculateEndDatesAll(startDatesAll, employeeHalfLife, initialEmployees, endDatesInitial);

    // Array to hold all generated employees
    const allEmployees: Employee[] = [];
    
    // Generate a new employee
    for (let i = 1; i <= totalHires; i++) {        

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
            FirstName: faker.person.firstName(),
            MiddleName: faker.person.middleName(),
            LastName: faker.person.lastName(),
            Email: faker.internet.email(),
            StartDate: faker.date.past().toISOString().split('T')[0],
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

//Calculates the number of employees leaving every year, assuming that 15% of employees leave every year
const calculateLeavingEmployeesPerYear = (employeesPerYear: YearEmployeesData[]): YearLeavingEmployeesData[] => {
    return employeesPerYear.map((data) => {
        return {
            year: data.year,
            leavingEmployees: Math.round(data.employees * 0.15),
        };
    });
}

interface YearNewHiresData {
    year: number;
    newHires: number;
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

// Calculate the initial number of employees from a given year
const targetStartYearEmployees = (employeesPerYear: YearEmployeesData[], targetStartYear: number): number => {
    let targetStartYearEmployees = employeesPerYear.find(data => data.year === targetStartYear)?.employees || 0;
    
    return targetStartYearEmployees;
};

//Calculate total number of hires
const calculateTotalHires = (newHiresPerYear: YearNewHiresData[]): number => {
    let totalHires = newHiresPerYear.reduce((total, data) => total + data.newHires, 0);

    return totalHires;
}

interface StartDate {
    employeeID: number;
    startDate: Date;
}

/**
 * Calculate the number of years the employee has been employed,
 * based on their position in the hiring order.
 */
const calculateStartDateInitial = (initialEmployees: number, targetStartYear: number, employeeHalfLife: number): StartDate[] => {
    let result: StartDate[] = [];

    for (let i = 1; i <= initialEmployees; i++) {
        // Calculate the number of years the employee has been employed, based on their position in the hiring order
        var yearsEmployed = (employeeHalfLife/0.693) * Math.log(initialEmployees / i) + .05;
        // Cap the number of years at 30
        if (yearsEmployed > 30) {
            yearsEmployed = 30;
        }
        
        const daysEmployed = Math.round(yearsEmployed * 365.25);

        let startDate = new Date(targetStartYear - 1, 11, 30);
        startDate.setDate(startDate.getDate() - daysEmployed);

        // Set the start date to a Monday the correct number of years ago
        startDate = getPreviousMonday(startDate);

        result.push({
            employeeID: i,
            startDate: startDate
        });
    }
    return result;
};

interface EndDate {
    employeeID: number;
    endDate: Date;
}

/**
 * Calculate the employee's end date, based on their start date.
 */
const calculateEndDatesInitial = (targetStartYear: number, startDates: StartDate[], employeeHalfLife: number): EndDate[] => {
    let endDates: EndDate[] = [];
    
    for (let startDateItem of startDates) {

        let yearsEmployed: number;
        let targetDate = new Date(targetStartYear, 0, 1);  // January 1 of targetStartYear
        let diffTime = Math.abs(targetDate.getTime() - startDateItem.startDate.getTime());
        let diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));  // convert difference from milliseconds to years

        do {
            yearsEmployed = (employeeHalfLife / 0.693) * Math.log(1 / Math.random());
        } while(yearsEmployed < diffYears || yearsEmployed > 40);

        const daysEmployed = Math.round(yearsEmployed * 365.25);

        // Create a new Date object to avoid mutating the original one
        let endDate = new Date(startDateItem.startDate);
        endDate.setDate(endDate.getDate() + daysEmployed);

        endDates.push({
            employeeID: startDateItem.employeeID,
            endDate: endDate
        });
    }

    return endDates;
};

// Calculate the start dates for new hires
const calculateStartDatesAll = (newHiresPerYear: YearNewHiresData[], startDate: StartDate[], targetStartYear: number, targetEndYear: number): StartDate[] => {
    for (let i = targetStartYear; i <= targetEndYear; i++) {
        let firstMonday = firstMondayOfYear(i);
        let newHiresThisYear = newHiresPerYear.find(data => data.year === i)?.newHires || 0;
        if (newHiresThisYear === 0) {
            break;
        }
        let newHiresThisWeek = Math.round(newHiresThisYear / 26);
        let hiringDate = new Date(firstMonday); // Avoid mutating the original date
        console.log(firstMonday, newHiresThisYear, newHiresThisWeek);

        for (let j = 0; j < 26; j++) {
            // Advance to the next hiring week once enough hires have been made in the current week
            for (let k = 0; k < newHiresThisWeek; k++)  {
                startDate.push({
                    employeeID: startDate.length + 1,
                    startDate: hiringDate
                });
            }
            hiringDate.setDate(hiringDate.getDate() + 14);
            console.log(startDate.length+1, hiringDate);         
        }             
    }
    return startDate;
};

// Calculate the first Monday of the year
function firstMondayOfYear(year: number): Date {
    let date = new Date(year, 0, 1); // Start from January 1

    // Check if January 1 is a Monday, if not, find the next Monday
    while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1);
    }
    return date;
}

// Calculate the end dates for all employees
const calculateEndDatesAll = (startDates: StartDate[], employeeHalfLife: number, initialEmployees: number, endDatesInitial: EndDate[]): EndDate[] => {
    // Begin calculation from the next employee after the initial employees
    for (let i = initialEmployees; i < startDates.length; i++) {
        let startDate = startDates[i];
        let yearsEmployed: number;

        do {
            yearsEmployed = (employeeHalfLife / 0.693) * Math.log(1 / Math.random());
        } while(yearsEmployed > 35);
        const daysEmployed = Math.round(yearsEmployed * 365.25);

        // Create a new Date object to avoid mutating the original one
        let endDate = new Date(startDate.startDate);
        endDate.setDate(endDate.getDate() + daysEmployed);

        endDatesInitial.push({
            employeeID: startDate.employeeID,
            endDate: endDate
        });
    }

    return endDatesInitial;
};

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

//Get the previous Monday from a given date
function getPreviousMonday(date: Date): Date {
    const day = date.getDay();
    if(day !== 1) { // Only adjust if not Monday
        let diff = date.getDate() - day + (day === 0 ? 1 : 8); // adjust when day is Sunday
        return new Date(date.setDate(diff));
    }
    return date;
}
