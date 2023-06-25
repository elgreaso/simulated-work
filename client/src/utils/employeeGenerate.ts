import { Employee } from '../types';
import seedrandom from 'seedrandom';
import * as employeeData from './employeeData'
import { sendEmployeeDataToDatabase } from './databaseUtils';
import { start } from 'repl';
import { targetYearEmployees } from './employeeData';

/**
 * This function generates new employees.
 * It calculates their individual data such as hiring date, which is based on their position in the hiring order,
 * and sets their start date to a Monday the correct number of years ago.
 * The new employee's other details are also generated and sent to the server to be added to the database.
 */
export const generateEmployees = async (numEmployees: number, simStartYear: number, simEndYear: number, employeeHalfLife: number): Promise<void> => {

    // Stuff to put in the parameter form:
    let avgStartAge = 25;
    let stdevStartAge = 5;
    let depthOfMA = 3;

    let seed = 'mySeed';
    //seedrandom(seed, { global: true });

    // Calculate the expected number of employees per year
    const employeesPerYear = employeeData.calculateEmployeesPerYear(numEmployees, simStartYear, simEndYear);

    // Calculate the start and end dates for the employees who were employed at the start of the simulation
    const [employmentDates, endDatesCount] = employeeData.calculateInitialDates(employeesPerYear, simStartYear, employeeHalfLife);

    // Count the number of current employees
    let numCurrentEmployees = employmentDates.length;
    
    let employees: Employee[] = [];
    for (let year = simStartYear; year <= simEndYear; year++) {
        // Calculate the number of new hires for the current year
        let yearNewHires = employeeData.yearNewHires(employeesPerYear, numCurrentEmployees, depthOfMA, year, endDatesCount);
        let startDates = employeeData.calculateStartDatesForYear(year, yearNewHires);
        //console.log(startDates);
        console.log(numCurrentEmployees);
        numCurrentEmployees -= endDatesCount[year];
        numCurrentEmployees += yearNewHires;
        console.log(`Year ${year}: ${yearNewHires} coming, ${endDatesCount[year]} leaving, ${numCurrentEmployees} at EOY`);
        console.log(startDates.length);
        //console.log(`Year ${year}: ${yearNewHires} new hires, ${numCurrentEmployees} current employees`);
        
        for (let i = 0; i < yearNewHires; i++) {
            // Directly create the employee object in one go
            //console.log("Employee ID: " + employees.length);
            //console.log("Calling calculateBirthDate...");
            let birthDate = employeeData.calculateBirthDate(startDates[i], avgStartAge, stdevStartAge);
            //console.log("Calling calculateSex...");
            let sex = employeeData.calculateSex();
            //console.log(sex);
            //console.log("Calling calculateFirstName...");
            let firstName = employeeData.calculateFirstName(sex, birthDate);
            //console.log(firstName);
            //console.log("Calling calculateMiddleName...");
            let middleName = employeeData.calculateMiddleName(sex, birthDate, firstName);
            //console.log(middleName);
            //console.log("Calling calculateLastName...");
            let lastName = employeeData.calculateLastName();
            //console.log(lastName);
            //console.log("Calling calculateEndDate and calculateEmail...");
            //console.log(year, startDates[i], employeeHalfLife);
            let employee: Employee = {
                ID: employees.length,
                StartDate: startDates[i].getTime(),
                EndDate: employeeData.calculateEndDate(startDates[i], employeeHalfLife).getTime(),
                DOB: 10, //birthDate.getTime(),
                Sex: sex,
                FirstName: firstName,
                MiddleName: middleName,
                LastName: lastName,
                Email: employeeData.calculateEmail(firstName, middleName, lastName),
                PositionID: 0,
                BranchID: 0,
                SupervisorID: 0,
                Status: "Removed"
            };
            employees.push(employee);
        }
    }

    // Send the employee data to the server
    let batchSize = 100;
    sendEmployeeDataToDatabase(employees, batchSize);

}
