import { Employee } from '../components/Employee';
import populationData from './populationData.json';

//Library to generate fake data
const { faker } = require('@faker-js/faker');

//Generate a specified number of employees with random names and positions
export const generateEmployees = async (numEmployees: number): Promise<{employees: Employee[], employeesPerYear: any[]}> => {
    const currentYear = new Date().getFullYear();
    const populationThisYear = populationData.find((item: { year: number; population: number }) => item.year === currentYear)?.population || 0;

    const employeePercentOfPopulation = numEmployees / populationThisYear;

    const employeesPerYear = populationData.map((data: { year: number, population: number }) => {
        return {
            year: data.year,
            employees: Math.round(data.population * employeePercentOfPopulation)
        };
    });

    const employees: Employee[] = [];
    const dateNow = new Date();

    for (let i = 1; i <= numEmployees; i++) {
        const yearsEmployed = (1/-0.17) * Math.log(i / numEmployees);
        const daysEmployed = Math.floor(yearsEmployed * 365.25); 

        let startDate = new Date();
        startDate.setDate(dateNow.getDate() - daysEmployed);

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
      
        employees.push(newEmployee);
    }

    return {employees, employeesPerYear};
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
