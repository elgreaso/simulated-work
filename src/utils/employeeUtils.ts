import { Employee } from '../components/Employee';

//Library to generate fake data
const { faker } = require('@faker-js/faker');

//Generate a specified number of employees with random names and positions
export function generateEmployees(numEmployees: number): Employee[] {
    let employees: Employee[] = [];
    for (let i = 0; i < numEmployees; i++) {
        employees.push({
            id: i,
            sex: faker.person.sex(),
            firstName: faker.name.firstName(), // generates a random first name
            lastName: faker.name.lastName(), // generates a random last name
            position: faker.name.jobTitle(), // generates a random job title
        });
    }
    return employees;
}
