import { Employee } from '../types';
import populationData from './data/population.json';
import seedrandom from 'seedrandom';
import * as employeeData from './employeeData'

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



    let seed = 'mySeed';
    seedrandom(seed, { global: true });

    const employeesPerYear = employeeData.calculateEmployeesPerYear(numEmployees, simStartYear, simEndYear);
    const initialStartDates = employeeData.calculateInitialStartDates(employeesPerYear, simStartYear, employeeHalfLife);

    let employees: Employee[] = [];
    for (let year = simStartYear; year <= simEndYear; year++) {
        let yearEmployees = employeeData.targetYearEmployees(employeesPerYear, year);
        console.log(year);
        for (let i = 0; i < numNewHires; i++) {
            let iD = employees.length;
            let startDate = employeeData.calculateStartDatesForYear(simStartYear, numNewHires);
            let endDate = employeeData.calculateEndDate(year, startDate, employeeHalfLife);
            let sex = employeeData.calculateSex();
            let birthDate = employeeData.calculateBirthDate(startDate, avgStartAge, stdevStartAge);
            let firstName = employeeData.calculateFirstName(sex, birthDate);
            let middleName = employeeData.calculateMiddleName(sex, birthDate);
            let lastName = employeeData.calculateLastName();
            let email = employeeData.calculateEmail(firstName, middleName, lastName);
            let positionID = 0;
            let branchID = 0;
            let supervisorID = 0;
            let status = "Removed";

            let employee: Employee = {
                ID: iD,
                StartDate: startDate.getTime(),
                EndDate: endDate.getTime(),
                DOB: birthDate.getTime(),
                Sex: sex,
                FirstName: firstName,
                MiddleName: middleName,
                LastName: lastName,
                Email: email,
                PositionID: positionID,
                BranchID: branchID,
                SupervisorID: supervisorID,
                Status: status
            };

            employees.push(employee);
        }
    }

}




/*-----------------------------------------------------------------------------*/

// This code will let me increment a value. I can use this to increment the number of employees in a given year.



// let yearEmployeesData: YearEmployeesData[] = [ /* your array of YearEmployeesData objects */ ];

// let targetYear = 2016;  // The year you're interested in

// // Find the object for the target year
// let targetYearObject = yearEmployeesData.find(data => data.year === targetYear);

// if (targetYearObject) {
//     // If the object exists, increment the employees count
//     targetYearObject.employees += 1;
// } else {
//     // If the object doesn't exist, create a new one and set the employees count to 1
//     yearEmployeesData.push({ year: targetYear, employees: 1 });
// }

/*-----------------------------------------------------------------------------*/

