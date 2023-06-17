import { Employee } from '../components/Employee';

//Library to generate fake data
const { faker } = require('@faker-js/faker');

//Generate a specified number of employees with random names and positions
export const generateEmployees = (numEmployees: number): Employee[] => {
    const employees: Employee[] = [];
    const dateNow = new Date();
  
    for (let i = 1; i <= numEmployees; i++) {
        const yearsEmployed = (1/-0.17) * Math.log(i / numEmployees);
        const daysEmployed = Math.floor(yearsEmployed * 365.25); // Consider leap years
  
        let startDate = new Date();
        startDate.setDate(dateNow.getDate() - daysEmployed);
  
        // Ensure startDate is a Monday
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
  
    return employees;
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
