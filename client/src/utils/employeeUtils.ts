// import { Employee } from '../types';
// import populationData from './data/population.json';
// import seedrandom from 'seedrandom';

// /**
//  * This function generates new employees.
//  * It calculates their individual data such as hiring date, which is based on their position in the hiring order,
//  * and sets their start date to a Monday the correct number of years ago.
//  * The new employee's other details are also generated and sent to the server to be added to the database.
//  */
// export const generateEmployees = async (numEmployees: number, startYear: number, endYear: number, empHalfLife: number): Promise<void> => {

//     let seed = 'mySeed';
//     seedrandom(seed, { global: true });
    
//     //Calculates the number of employees every year, assuming that it tracks with the US population
//     const employeesPerYear = calculateEmployeesPerYear(numEmployees, populationData);

//     //Calculates the number of employees leaving every year, assuming that 15% of employees leave every year
//     const leavingEmployeesPerYear = calculateLeavingEmployeesPerYear(employeesPerYear);

//     //Calculates the number of new hires every year, based on next year's employee count
//     const newHiresPerYear = calculateNewHiresPerYear(employeesPerYear, leavingEmployeesPerYear);

//     //Calculate total number of hires
//     const totalHires = calculateTotalHires(newHiresPerYear);

//     //Calculates the initial number of employees from the target year
//     let targetStartYear = startYear;
//     const initialEmployees = targetStartYearEmployees(employeesPerYear, targetStartYear);

//     // Calculate the start date of the initial employees. The employeeHalfLife is the number of years it takes for half of the employees to leave.
//     let employeeHalfLife = empHalfLife;
//     const startDatesInitial = calculateStartDateInitial(initialEmployees, targetStartYear, employeeHalfLife);

//     // Calculate the end dates of the initial employees
//     const endDatesInitial = calculateEndDatesInitial(targetStartYear, startDatesInitial, employeeHalfLife);

//     // Calculate the start date of the rest of the employees
//     let targetEndYear = endYear;
//     const startDatesAll = calculateStartDatesAll(newHiresPerYear, startDatesInitial, targetStartYear, targetEndYear);

//     // Calculate the end dates of all employees
//     const endDatesAll = calculateEndDatesAll(startDatesAll, employeeHalfLife, initialEmployees, endDatesInitial);

//     // Calculate the birth dates of all employees
//     const birthDates = calculateBirthDates(startDatesAll, endDatesAll);

//     // Generate the sex of all employees
//     const genders = calculateGenders(birthDates);

//     // Generate the names of all employees
//     const firstNames = calculateFirstNames(genders);
//     const middleNames = calculateMiddleNames(firstNames, genders);
//     const lastNames = calculateLastNames(startDatesAll);

//     // Generate the email addresses of all employees
//     const emails = calculateEmails(firstNames, middleNames, lastNames);

//     // Array to hold all generated employees
//     const allEmployees: Employee[] = [];
//     /**
//      * Generate the new employee's details.
//      * ID is their position in the hiring order.
//      * Sex, first name, middle name, and last name are randomly generated.
//      * Start date is calculated above.
//      * Position ID, branch ID, and supervisor ID are randomly selected.
//      * Status is 'Removed'.
//      */
//     for (let i = 0; i < totalHires; i++) {  // remember, array indices in JavaScript start from 0, not 1
//         let employee: Employee = {
//             ID: i + 1, // add 1 here if you want employee IDs to start from 1
//             DOB: birthDates[i].birthDate.getTime(), // assuming birthDate is a property in each object in birthDates array            
//             FirstName: firstNames[i].firstName, // access the property 'firstName'
//             MiddleName: middleNames[i].middleName, // access the property 'middleName'
//             LastName: lastNames[i].lastName, // access the property 'lastName'
//             Email: emails[i].email, // access the property 'email'
//             StartDate: startDatesAll[i].startDate.getTime(), // assuming startDate is a property in each object in startDatesAll array
//             EndDate: endDatesAll[i].endDate.getTime(), // assuming endDate is a property in each object in endDatesAll array
//             Sex: genders[i].gender, // access the property 'gender' of the object
//             PositionID: Math.ceil(Math.random() * 10),
//             BranchID: Math.ceil(Math.random() * 10),
//             SupervisorID: i === 0 ? null : Math.ceil(Math.random() * i),
//             Status: 'Removed',
//         };
    
//         allEmployees.push(employee);
//     }    

//     // Define the size of each batch, which is the number of employees to send to the server at once, and send the data to the server
//     const batchSize = 100;
//     await sendEmployeeDataToDatabase(allEmployees, batchSize);

// };

// interface YearPopulationData {
//     year: number;
//     population: number;
// }

// //Calculates the number of employees every year, assuming that it tracks with the US population
// const calculateEmployeesPerYear = (numEmployees: number, populationData: YearPopulationData[]): { year: number; employees: number }[] => {
//     const currentYear = new Date().getFullYear();
//     const populationThisYear = populationData.find((item) => item.year === currentYear)?.population || 0;
//     const employeePercentOfPopulation = numEmployees / populationThisYear;

//     const employeesPerYear = populationData.map((data) => {
//         return {
//             year: data.year,
//             employees: Math.round(data.population * employeePercentOfPopulation)
//         };
//     });

//     return employeesPerYear;
// };

// interface YearEmployeesData {
//     year: number;
//     employees: number;
// }

// interface YearLeavingEmployeesData {
//     year: number;
//     leavingEmployees: number;
// }

// //Calculates the number of employees leaving every year, assuming that 15% of employees leave every year
// const calculateLeavingEmployeesPerYear = (employeesPerYear: YearEmployeesData[]): YearLeavingEmployeesData[] => {
//     return employeesPerYear.map((data) => {
//         return {
//             year: data.year,
//             leavingEmployees: Math.round(data.employees * 0.15),
//         };
//     });
// }

// interface YearNewHiresData {
//     year: number;
//     newHires: number;
// }

// //Calculates the number of new hires every year, based on next year's employee count
// const calculateNewHiresPerYear = (employeesPerYear: YearEmployeesData[], leavingEmployeesPerYear: YearLeavingEmployeesData[]): YearNewHiresData[] => {
//     return leavingEmployeesPerYear.map((data, index) => {
//         if (index === leavingEmployeesPerYear.length - 1) {
//             // No new hires for the last year, since there's no next year data
//             return {
//                 year: data.year,
//                 newHires: 0
//             };
//         } else {
//             const thisYearEmployees = employeesPerYear[index].employees;
//             const nextYearEmployees = employeesPerYear[index + 1].employees;
//             const newHires = Math.max(nextYearEmployees - thisYearEmployees + data.leavingEmployees, 0);
//             return {
//                 year: data.year,
//                 newHires: newHires
//             };
//         }
//     });
// }

// // Calculate the initial number of employees from a given year
// const targetStartYearEmployees = (employeesPerYear: YearEmployeesData[], targetStartYear: number): number => {
//     let targetStartYearEmployees = employeesPerYear.find(data => data.year === targetStartYear)?.employees || 0;
    
//     return targetStartYearEmployees;
// };

// //Calculate total number of hires
// const calculateTotalHires = (newHiresPerYear: YearNewHiresData[]): number => {
//     let totalHires = newHiresPerYear.reduce((total, data) => total + data.newHires, 0);

//     return totalHires;
// }

// interface StartDate {
//     employeeID: number;
//     startDate: Date;
// }

// /**
//  * Calculate the number of years the employee has been employed,
//  * based on their position in the hiring order.
//  */
// const calculateStartDateInitial = (initialEmployees: number, targetStartYear: number, employeeHalfLife: number): StartDate[] => {
//     let result: StartDate[] = [];

//     for (let i = 1; i <= initialEmployees; i++) {
//         // Calculate the number of years the employee has been employed, based on their position in the hiring order
//         var yearsEmployed = (employeeHalfLife/0.693) * Math.log(initialEmployees / i) + .05;
//         // Cap the number of years at 30
//         if (yearsEmployed > 30) {
//             yearsEmployed = 30;
//         }
        
//         const daysEmployed = Math.round(yearsEmployed * 365.25);

//         let startDate = new Date(targetStartYear - 1, 11, 30);
//         startDate.setDate(startDate.getDate() - daysEmployed);

//         // Set the start date to a Monday the correct number of years ago
//         startDate = getPreviousMonday(startDate);

//         result.push({
//             employeeID: i,
//             startDate: startDate
//         });
//     }
//     return result;
// };

// interface EndDate {
//     employeeID: number;
//     endDate: Date;
// }

// /**
//  * Calculate the employee's end date, based on their start date.
//  */
// const calculateEndDatesInitial = (targetStartYear: number, startDates: StartDate[], employeeHalfLife: number): EndDate[] => {
//     let endDates: EndDate[] = [];
    
//     for (let startDateItem of startDates) {

//         let yearsEmployed: number;
//         let targetDate = new Date(targetStartYear, 0, 1);  // January 1 of targetStartYear
//         let diffTime = Math.abs(targetDate.getTime() - startDateItem.startDate.getTime());
//         let diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));  // convert difference from milliseconds to years

//         do {
//             yearsEmployed = (employeeHalfLife / 0.693) * Math.log(1 / Math.random());
//         } while(yearsEmployed < diffYears || yearsEmployed > 40);

//         const daysEmployed = Math.round(yearsEmployed * 365.25);

//         // Create a new Date object to avoid mutating the original one
//         let endDate = new Date(startDateItem.startDate);
//         endDate.setDate(endDate.getDate() + daysEmployed);

//         endDates.push({
//             employeeID: startDateItem.employeeID,
//             endDate: endDate
//         });
//     }

//     return endDates;
// };

// // Calculate the start dates for new hires
// const calculateStartDatesAll = (newHiresPerYear: YearNewHiresData[], startDate: StartDate[], targetStartYear: number, targetEndYear: number): StartDate[] => {
//     for (let i = targetStartYear; i <= targetEndYear; i++) {
//         let firstMonday = firstMondayOfYear(i);
//         let newHiresThisYear = newHiresPerYear.find(data => data.year === i)?.newHires || 0;
//         if (newHiresThisYear === 0) {
//             break;
//         }
//         let newHiresThisWeek = Math.round(newHiresThisYear / 26);
//         let hiringDate = new Date(firstMonday); // Avoid mutating the original date

//         for (let j = 0; j < 26; j++) {
//             // Advance to the next hiring week once enough hires have been made in the current week
//             for (let k = 0; k < newHiresThisWeek; k++)  {
//                 startDate.push({
//                     employeeID: startDate.length + 1,
//                     startDate: hiringDate
//                 });
//             }
//             hiringDate.setDate(hiringDate.getDate() + 14);      
//         }             
//     }
//     return startDate;
// };

// // Calculate the first Monday of the year
// function firstMondayOfYear(year: number): Date {
//     let date = new Date(year, 0, 1); // Start from January 1

//     // Check if January 1 is a Monday, if not, find the next Monday
//     while (date.getDay() !== 1) {
//         date.setDate(date.getDate() + 1);
//     }
//     return date;
// }

// // Calculate the end dates for all employees
// const calculateEndDatesAll = (startDates: StartDate[], employeeHalfLife: number, initialEmployees: number, endDatesInitial: EndDate[]): EndDate[] => {
//     // Begin calculation from the next employee after the initial employees
//     for (let i = initialEmployees; i < startDates.length; i++) {
//         let startDate = startDates[i];
//         let yearsEmployed: number;

//         do {
//             yearsEmployed = (employeeHalfLife / 0.693) * Math.log(1 / Math.random());
//         } while(yearsEmployed > 35);
//         const daysEmployed = Math.round(yearsEmployed * 365.25);

//         // Create a new Date object to avoid mutating the original one
//         let endDate = new Date(startDate.startDate);
//         endDate.setDate(endDate.getDate() + daysEmployed);

//         endDatesInitial.push({
//             employeeID: startDate.employeeID,
//             endDate: endDate
//         });
//     }

//     return endDatesInitial;
// };

// interface BirthDate {
//     employeeID: number;
//     birthDate: Date;
// }

// // Calculate the birth dates for all employees
// const calculateBirthDates = (startDates: StartDate[], endDates: EndDate[]): BirthDate[] => {
//     let birthDates: BirthDate[] = [];
//     let average = 26;
//     let standardDeviation = 8;

//     for (let i = 0; i < startDates.length; i++) {
//         let startDate = startDates[i].startDate;
//         let endDate = endDates[i].endDate;
//         let result: number;

//         do {
//             result = getRandom(average, standardDeviation);
//         } while(result < 18 || endDate.getFullYear() - startDate.getFullYear() + result > 65);

//         let birthDate = new Date(startDate);
//         birthDate.setFullYear(birthDate.getFullYear() - result);
        
//         birthDates.push({
//             employeeID: startDates[i].employeeID, //Changed from startDate.employeeID to startDates[i].employeeID
//             birthDate: birthDate
//         });
//     }
    
//     return birthDates;
// };

// interface Gender {
//     employeeID: number;
//     gender: string;
// }

// // Calculate the gender of all employees
// function calculateGenders(birthDates: BirthDate[]): Gender[] {
//     return birthDates.map(birthDate => {
//         let randomNumber = Math.random();
//         let gender = randomNumber <= 0.5 ? 'Male' : 'Female';
//         return { employeeID: birthDate.employeeID, gender: gender };
//     });
// }

// const firstNameMData = require('./data/firstNameM.json');
// const firstNameFData = require('./data/firstNameF.json');
// const lastNamesData = require('./data/lastName.json');

// interface FirstName {
//     employeeID: number;
//     firstName: string;
// }

// function calculateFirstNames(genders: Gender[]): FirstName[] {
//     return genders.map(gender => {
//         let namesData = gender.gender === 'Male' ? firstNameMData : firstNameFData;
        
//         // Flatten the data to a simple array of names
//         let names = namesData.map((item: (string | number)[]) => item[1]);

//         let randomIndex = Math.floor(Math.random() * names.length);
//         let firstName = names[randomIndex];

//         return { employeeID: gender.employeeID, firstName: firstName };
//     });
// }

// interface MiddleName {
//     employeeID: number;
//     middleName: string;
// }

// function calculateMiddleNames(firstNames: FirstName[], genders: Gender[]): MiddleName[] {
//     return firstNames.map((firstNameItem, index) => {
//         let namesData = genders[index].gender === 'Male' ? firstNameMData : firstNameFData;

//         // Flatten the data to a simple array of names
//         let names = namesData.map((item: (string | number)[]) => item[1]);

//         let middleName;
//         do {
//             let randomIndex = Math.floor(Math.random() * names.length);
//             middleName = names[randomIndex];
//         } while(middleName === firstNameItem.firstName);

//         return { employeeID: firstNameItem.employeeID, middleName: middleName };
//     });
// }

// interface LastName {
//     employeeID: number;
//     lastName: string;
// }

// function calculateLastNames(startDates: StartDate[]): LastName[] {
//     // Flatten the data to a simple array of last names
//     let names = lastNamesData.map((item: (string | number)[]) => item[0]);

//     return startDates.map((startDateItem) => {
//         let randomIndex = Math.floor(Math.random() * names.length);
//         let lastName = names[randomIndex];

//         return { employeeID: startDateItem.employeeID, lastName: lastName };
//     });
// }

// interface Email {
//     employeeID: number;
//     email: string;
// }

// function calculateEmails(firstNames: FirstName[], middleNames: MiddleName[], lastNames: LastName[]): Email[] {
    
//     return firstNames.map((firstNameItem, index) => {
//         // Find the corresponding middle and last name for the current employee
//         let middleNameItem = middleNames.find(middleName => middleName.employeeID === firstNameItem.employeeID);
//         let lastNameItem = lastNames.find(lastName => lastName.employeeID === firstNameItem.employeeID);

//         // Create the email address
//         let email = `${firstNameItem.firstName}.${middleNameItem?.middleName}.${lastNameItem?.lastName}@company.com`.toLowerCase();

//         return { employeeID: firstNameItem.employeeID, email: email };
//     });
// }

// // Generate a random number with a normal distribution
// function getRandom(average: number, standardDeviation: number) {
//     let u1 = Math.random();
//     let u2 = Math.random();
//     let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); //random normal distribution
//     let randNormal = average + standardDeviation * randStdNormal; //random normal distribution(mean,stdDeviation)
//     return randNormal;
// }

// // Send the employees to the server in batches
// const sendEmployeeDataToDatabase = async (allEmployees: Employee[], batchSize: number) => {
//     // Send the employees to the server in batches
//     for (let i = 0; i < allEmployees.length; i += batchSize) {
//         const batch = allEmployees.slice(i, i + batchSize);
//         const response = await fetch('http://localhost:3001/api/employees', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(batch)
//         });

//         // Throw an error if the request was not successful
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//     }
// }

// // This function fetches the employee data from the server
// export const getEmployeeDataFromDatabase = async (limit: number): Promise<Employee[]> => {
//     limit = limit || 100; // Default to 100 employees
//     // Fetch data from the server
//     const response = await fetch(`http://localhost:3001/api/employees?limit=${limit}`); // Replace with server URL and endpoint

//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     } else {
//         // Parse the data as JSON and return
//         const employees: Employee[] = await response.json();
//         return employees;
//     }
// };

// //Get the previous Monday from a given date
// function getPreviousMonday(date: Date): Date {
//     const day = date.getDay();
//     if(day !== 1) { // Only adjust if not Monday
//         let diff = date.getDate() - day + (day === 0 ? 1 : 8); // adjust when day is Sunday
//         return new Date(date.setDate(diff));
//     }
//     return date;
// }
