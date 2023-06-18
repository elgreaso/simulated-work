import { open } from 'sqlite';
import * as sqlite3 from 'sqlite3';
import { Employee } from '../components/Employee';
import populationData from './populationData.json';

//Library to generate fake data
const { faker } = require('@faker-js/faker');

//Generate a specified number of employees with random names and positions
export const generateEmployees = async (numEmployees: number): Promise<{employeesPerYear: any[], leavingEmployeesPerYear: any[], newHiresPerYear: any[]}> => {
    //Calculates the number of employees every year, assuming that it tracks with the US population
    const currentYear = new Date().getFullYear();
    const populationThisYear = populationData.find((item: { year: number; population: number }) => item.year === currentYear)?.population || 0;
    const employeePercentOfPopulation = numEmployees / populationThisYear;
    const employeesPerYear = populationData.map((data: { year: number, population: number }) => {
        return {
            year: data.year,
            employees: Math.round(data.population * employeePercentOfPopulation)
        };
    });

    //Calculates the number of employees leaving every year, assuming that 15% of employees leave every year
    const leavingEmployeesPerYear = employeesPerYear.map((data: { year: number, employees: number }) => {
        return {
            year: data.year,
            leavingEmployees: Math.round(data.employees * 0.15),
        };
    });

    //Calculates the number of new hires every year, based on next year's employee count
    const newHiresPerYear = leavingEmployeesPerYear.map((data, index) => {
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

    //Calculate total number of hires
    let totalHires = 0;
    for (const data of newHiresPerYear) {
        totalHires += data.newHires;
    }

    // Add initial number of employees from 1950
    const initialEmployees = employeesPerYear.find(data => data.year === 1950)?.employees || 0;
    totalHires += initialEmployees;

    //Generate all employees
    //const employees: Employee[] = [];
    const dateNow = new Date();

    //Open the database
    const db = await open({
        filename: '.../db/database.db',
        driver: sqlite3.Database
    });
      
    //Populate the database with employees
    for (let i = 1; i <= totalHires; i++) {
        const yearsEmployed = (1/-0.17) * Math.log(i / numEmployees);
        const daysEmployed = Math.floor(yearsEmployed * 365.25); 

        let startDate = new Date();
        startDate.setDate(dateNow.getDate() - daysEmployed);

        //Set start date to the previous Monday
        startDate = getPreviousMonday(startDate);

        const newEmployee: Employee = {
            id: i,
            sex: faker.person.sex(),
            firstName: faker.name.firstName(),
            middleName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            startDate: startDate.toISOString().split('T')[0],
            positionID: Math.ceil(Math.random() * 10),
            branchID: Math.ceil(Math.random() * 10),
            supervisorID: i === 1 ? null : Math.ceil(Math.random() * (i - 1)),
            status: 'Removed',
        };

        // Insert the new employee into the database
        await db.run(
            `INSERT INTO Employees (ID, Sex, FirstName, MiddleName, LastName, Email, StartDate, PositionID, BranchID, SupervisorID, Status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [newEmployee.id, newEmployee.sex, newEmployee.firstName, newEmployee.middleName, newEmployee.lastName, newEmployee.email, newEmployee.startDate, newEmployee.positionID, newEmployee.branchID, newEmployee.supervisorID, newEmployee.status]
        );

        //employees.push(newEmployee);
    }

    return {employeesPerYear, leavingEmployeesPerYear, newHiresPerYear};
};

export const getEmployeeDataFromDatabase = async (): Promise<Employee[]> => {
    const db = await open({
        filename: '.../db/database.db',
        driver: sqlite3.Database
    });

    const employees = await db.all('SELECT * FROM Employees LIMIT 100');

    await db.close();

    return employees;
}

//Get the previous Monday from a given date
function getPreviousMonday(date: Date): Date {
    const day = date.getDay();
    if(day !== 1) { // Only adjust if not Monday
        let diff = date.getDate() - day + (day === 0 ? -6:1); // adjust when day is Sunday
        return new Date(date.setDate(diff));
    }
    return date;
}
