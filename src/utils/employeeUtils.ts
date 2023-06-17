import { Employee } from '../components/Employee';

//Library to generate fake data
const { faker } = require('@faker-js/faker');

//Generate a specified number of employees with random names and positions
export const generateEmployees = (numEmployees: number): Employee[] => {
    const employees: Employee[] = [];
    const dateNow = new Date();
  
    for (let i = 1; i <= numEmployees; i++) {
        const yearsEmployed = 100 / 17 * Math.log(numEmployees / i);
        const daysEmployed = Math.floor(yearsEmployed * 365.25); // Consider leap years
  
        let startDate = new Date();
        startDate.setDate(dateNow.getDate() - daysEmployed);
  
        // Check if startDate is a weekend
        let day = startDate.getDay();
        if(day === 0) // Sunday
            startDate.setDate(startDate.getDate() - 2);
        else if(day === 6) // Saturday
            startDate.setDate(startDate.getDate() - 1);
  
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
        };
      
      employees.push(newEmployee);
    }
  
    return employees;
};