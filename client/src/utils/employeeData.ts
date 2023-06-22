/* eslint-disable @typescript-eslint/no-unused-vars */

// Import required modules
import { Employee } from '../types';

/*-----------------------------------------------------------------------------*/

// Import required data files for generating employee names
const firstNameMData = require('./firstNameMData.json');
const firstNameFData = require('./firstNameFData.json');
const lastNamesData = require('./lastNamesData.json');

/*-----------------------------------------------------------------------------*/

/**
 * Interface YearPopulationData
 *
 * This interface represents the schema for year-wise population data. It's used to store population statistics for each year.
 * 
 * @param year       - This is the year for which the population is recorded.
 * @param population - The total population recorded in the corresponding year.
 */
interface YearPopulationData {
    year: number;
    population: number;
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateEmployeesPerYear
 *
 * This function is used to calculate the number of employees in each year. The calculation is based on the assumption that the 
 * number of employees in a particular year is proportional to the total population in that year. 
 * It is designed to predict the potential number of employees in the future by taking into account demographic changes. 
 * For example, as the population increases, we could expect the number of employees to increase correspondingly.
 *
 * The function takes two arguments, the total number of employees and an array of population data 
 * (comprising the year and population for that year), and returns an array of objects. Each object in the returned array 
 * represents the year and the calculated number of employees for that year.
 *
 * @param numEmployees     - The total number of employees at present.
 * @param populationData   - An array of objects containing the year and population for each year.
 *
 * @returns A new array of objects where each object contains the year and the corresponding calculated number of employees.
 *
 * @example
 *
 * const populationData = [
 *     { year: 2021, population: 1000000 },
 *     { year: 2022, population: 1050000 },
 *     { year: 2023, population: 1100000 },
 *     { year: 2024, population: 1150000 },
 *     { year: 2025, population: 1200000 },
 * ];
 * 
 * const numEmployees = 50000;
 * 
 * console.log(calculateEmployeesPerYear(numEmployees, populationData));
 */
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

/*-----------------------------------------------------------------------------*/

/**
 * Interface YearEmployeesData
 *
 * This interface is used to represent year-wise data for the total number of employees in a company.
 * It's used to store the number of employees for each year.
 * 
 * @param year       - This is the year for which the number of employees is recorded.
 * @param employees  - The total number of employees in the corresponding year.
 */
interface YearEmployeesData {
    year: number;
    employees: number;
}

/*-----------------------------------------------------------------------------*/

/**
 * Interface YearLeavingEmployeesData
 *
 * This interface represents the schema for year-wise data on the number of employees leaving the company.
 * It is used to store the number of employees who leave the company each year.
 * 
 * @param year               - The year for which the attrition is recorded.
 * @param leavingEmployees   - The number of employees who left the company in the corresponding year.
 */
interface YearLeavingEmployeesData {
    year: number;
    leavingEmployees: number;
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateLeavingEmployeesPerYear
 *
 * This function is used to calculate the number of employees leaving each year. The calculation is based on the assumption 
 * that 15% of employees leave the company every year. This assumption can be modified according to the specific attrition 
 * rate of the company.
 *
 * The function takes an array of year-wise employee data and returns an array of objects. Each object in the returned array 
 * represents the year and the calculated number of leaving employees for that year.
 *
 * @param employeesPerYear   - An array of objects containing the year and total number of employees for each year.
 *
 * @returns A new array of objects where each object contains the year and the corresponding calculated number of employees leaving.
 *
 * @example
 *
 * const employeesPerYear = [
 *     { year: 2021, employees: 500 },
 *     { year: 2022, employees: 550 },
 *     { year: 2023, employees: 600 },
 *     { year: 2024, employees: 650 },
 *     { year: 2025, employees: 700 },
 * ];
 * 
 * console.log(calculateLeavingEmployeesPerYear(employeesPerYear));
 */
const calculateLeavingEmployeesPerYear = (employeesPerYear: YearEmployeesData[]): YearLeavingEmployeesData[] => {
    return employeesPerYear.map((data) => {
        return {
            year: data.year,
            leavingEmployees: Math.round(data.employees * 0.15),
        };
    });
}

/*-----------------------------------------------------------------------------*/

/**
 * Interface YearNewHiresData
 *
 * This interface represents the schema for year-wise data on the number of new hires in the company.
 * It is used to store the number of new hires each year.
 * 
 * @param year      - The year for which the number of new hires is recorded.
 * @param newHires  - The number of new hires in the company in the corresponding year.
 */
interface YearNewHiresData {
    year: number;
    newHires: number;
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateNewHiresPerYear
 *
 * This function is used to calculate the number of new hires for each year, based on the following year's total employee count.
 * It calculates the number of new hires needed to fill in the gaps created by employees leaving and to ensure growth in the 
 * total employee count year over year.
 *
 * The function takes two parameters: an array of year-wise employee data and an array of year-wise leaving employee data.
 * It returns a new array of objects. Each object represents the year and the calculated number of new hires for that year.
 *
 * @param employeesPerYear        - An array of objects containing the year and total number of employees for each year.
 * @param leavingEmployeesPerYear - An array of objects containing the year and the number of employees leaving each year.
 *
 * @returns A new array of objects where each object contains the year and the corresponding calculated number of new hires.
 *
 * @example
 *
 * const employeesPerYear = [
 *     { year: 2021, employees: 500 },
 *     { year: 2022, employees: 550 },
 *     { year: 2023, employees: 600 },
 *     { year: 2024, employees: 650 },
 *     { year: 2025, employees: 700 },
 * ];
 * 
 * const leavingEmployeesPerYear = [
 *     { year: 2021, leavingEmployees: 75 },
 *     { year: 2022, leavingEmployees: 82 },
 *     { year: 2023, leavingEmployees: 90 },
 *     { year: 2024, leavingEmployees: 97 },
 *     { year: 2025, leavingEmployees: 105 },
 * ];
 *
 * console.log(calculateNewHiresPerYear(employeesPerYear, leavingEmployeesPerYear));
 */
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

/*-----------------------------------------------------------------------------*/

/**
 * Function: targetStartYearEmployees
 *
 * This function is used to find the number of employees in a given target start year.
 * It works by iterating through the array of `employeesPerYear` until it finds the year that matches `targetStartYear`.
 * It then returns the number of employees for that year, or zero if no matching year is found.
 *
 * @param employeesPerYear - An array of objects, each containing the total number of employees for a particular year.
 * @param targetStartYear  - The year for which the number of employees is to be found.
 *
 * @returns The number of employees in the given target start year, or 0 if no data is available for that year.
 *
 * @example
 *
 * const employeesPerYear = [
 *     { year: 2020, employees: 500 },
 *     { year: 2021, employees: 550 },
 *     { year: 2022, employees: 600 },
 * ];
 * 
 * console.log(targetStartYearEmployees(employeesPerYear, 2021)); // Outputs: 550
 */
const targetStartYearEmployees = (employeesPerYear: YearEmployeesData[], targetStartYear: number): number => {
    let targetStartYearEmployees = employeesPerYear.find(data => data.year === targetStartYear)?.employees || 0;
    
    return targetStartYearEmployees;
};

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateTotalHires
 *
 * This function is used to calculate the total number of new hires across all years.
 * It does so by iterating through the `newHiresPerYear` array and adding up all the `newHires` values.
 *
 * @param newHiresPerYear - An array of objects, each containing the total number of new hires for a particular year.
 *
 * @returns The total number of new hires across all years.
 *
 * @example
 *
 * const newHiresPerYear = [
 *     { year: 2020, newHires: 100 },
 *     { year: 2021, newHires: 150 },
 *     { year: 2022, newHires: 200 },
 * ];
 * 
 * console.log(calculateTotalHires(newHiresPerYear)); // Outputs: 450
 */
const calculateTotalHires = (newHiresPerYear: YearNewHiresData[]): number => {
    let totalHires = newHiresPerYear.reduce((total, data) => total + data.newHires, 0);

    return totalHires;
}

/*-----------------------------------------------------------------------------*/

/**
 * Interface StartDate
 *
 * This interface represents the schema for an employee's start date. It's used to store the date when an employee started working.
 * 
 * @property employeeID - This is the unique identifier for the employee. 
 * @property startDate  - The start date of the corresponding employee's tenure at the company.
 */
interface StartDate {
    employeeID: number;
    startDate: Date;
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateIndividualStartDate
 *
 * This function calculates the start date of an employee given their hire order position.
 * The number of years the employee has been employed is based on their position in the hiring order,
 * and the start date is set to a Monday the correct number of years ago.
 *
 * @param employeeID - The ID of the employee (also represents the order in which they were hired)
 * @param initialEmployees - The total number of employees at the start year
 * @param targetStartYear - The target start year
 * @param employeeHalfLife - The number of years it takes for half of the employees to leave
 *
 * @returns An object containing the employeeID and their calculated start date.
 */
const calculateInitialStartDate = (employeeID: number, initialEmployees: number, targetStartYear: number, employeeHalfLife: number): StartDate => {
    
    // Calculate the number of years the employee has been employed, based on their position in the hiring order
    var yearsEmployed = (employeeHalfLife/0.693) * Math.log(initialEmployees / employeeID) + .05;
    
    // Cap the number of years at 30
    if (yearsEmployed > 30) {
        yearsEmployed = 30;
    }

    // Convert the number of years employed to the number of days employed
    const daysEmployed = Math.round(yearsEmployed * 365.25);
    
    // Create a new Date object representing the end of the target start year
    let startDate = new Date(targetStartYear - 1, 11, 30);
    
    // Subtract the number of days employed from the start date to get the employee's start date
    startDate.setDate(startDate.getDate() - daysEmployed);
    
    // Adjust the start date to the previous Monday
    startDate = getPreviousMonday(startDate);

    // Return the employee's ID and start date as an object
    return {
        employeeID: employeeID,
        startDate: startDate
    };
};

/*-----------------------------------------------------------------------------*/

/**
 * Interface EndDate
 *
 * This interface represents the schema for an employee's end date. It's used to store the date when an employee ended their tenure at the company.
 * 
 * @property employeeID - This is the unique identifier for the employee.
 * @property endDate    - The end date of the corresponding employee's tenure at the company. This would typically be the date the employee left the company.
 */
interface EndDate {
    employeeID: number;
    endDate: Date;
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateIndividualEndDate
 *
 * This function calculates the end date of an employee given their start date and employment half-life.
 * It uses a random number to simulate variability in employment duration.
 *
 * @param startDateItem - An object containing the employee ID and their start date
 * @param targetStartYear - The target start year
 * @param employeeHalfLife - The number of years it takes for half of the employees to leave
 *
 * @returns An object containing the employee ID and their calculated end date.
 */
const calculateInitialEndDate = (startDateItem: StartDate, targetStartYear: number, employeeHalfLife: number): EndDate => {
    
    // January 1 of targetStartYear
    let targetDate = new Date(targetStartYear, 0, 1);  
    
    // Calculate the difference in time between the target date and the start date, in years
    let diffTime = Math.abs(targetDate.getTime() - startDateItem.startDate.getTime());
    let diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));  

    let yearsEmployed: number;

    // Generate a random number of years employed that is within the valid range
    do {
        yearsEmployed = (employeeHalfLife / 0.693) * Math.log(1 / Math.random());
    } while(yearsEmployed < diffYears || yearsEmployed > 40);

    // Convert the number of years employed to the number of days employed
    const daysEmployed = Math.round(yearsEmployed * 365.25);

    // Create a new Date object to avoid mutating the original one
    let endDate = new Date(startDateItem.startDate);
    
    // Add the number of days employed to the start date to get the end date
    endDate.setDate(endDate.getDate() + daysEmployed);

    // Return the employee's ID and end date as an object
    return {
        employeeID: startDateItem.employeeID,
        endDate: endDate
    };
};

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateStartDatesForYear
 *
 * This function calculates start dates for new employees hired in a specific year. The hiring pattern is 
 * based on two-week intervals with a fixed number of hires each time. The start dates are then added to an 
 * existing array of start dates.
 *
 * @param targetYear - The year in which the new hires start
 * @param newHiresPerYear - Array of objects containing the number of new hires for each year
 * @param startDates - Array of start dates for employees already hired
 *
 * @returns The updated array of start dates with the newly hired employees' start dates for the target year added
 */
const calculateStartDatesForYear = (targetYear: number, newHiresPerYear: YearNewHiresData[], startDates: StartDate[]): StartDate[] => {

    // Find the first Monday of the target year
    let firstMonday = firstMondayOfYear(targetYear);
    
    // Get the number of new hires for the target year or default to 0 if no data available
    let newHiresThisYear = newHiresPerYear.find(data => data.year === targetYear)?.newHires || 0;
    
    // If there are no new hires this year, there's no need to continue, return the unchanged start dates array
    if (newHiresThisYear === 0) {
        return startDates;
    }

    // Calculate the number of new hires per two-week period (assuming 26 periods in a year)
    let newHiresThisWeek = Math.round(newHiresThisYear / 26);
    
    // Use a new Date object to avoid mutating the original date
    let hiringDate = new Date(firstMonday); 

    // For each two-week period in the year...
    for (let j = 0; j < 26; j++) {
        
        // ...hire a fixed number of new employees and add them to the startDates array
        for (let k = 0; k < newHiresThisWeek; k++)  {
            startDates.push({
                employeeID: startDates.length + 1,
                startDate: new Date(hiringDate)  // Create a new date object to prevent mutations
            });
        }
        
        // Move the hiring date forward by two weeks
        hiringDate.setDate(hiringDate.getDate() + 14);      
    }             

    // Return the updated start dates array
    return startDates;
};

/*-----------------------------------------------------------------------------*/

/**
 * Function: firstMondayOfYear
 *
 * This function determines the date of the first Monday of a specified year.
 *
 * @param year - The year for which the first Monday's date is required
 *
 * @returns A Date object representing the first Monday of the specified year
 */
function firstMondayOfYear(year: number): Date {
    // Initialize the date as January 1 of the target year
    let date = new Date(year, 0, 1);

    // If January 1 is not a Monday, increment the date until we find a Monday
    while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1);
    }

    // Return the date of the first Monday
    return date;
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateIndividualEndDate
 *
 * This function calculates the end date for a given employee, based on their start date, 
 * using the "half-life" concept in the calculation. The end date is not allowed to exceed 35 years of employment.
 *
 * @param startDate - The start date of the employee
 * @param employeeHalfLife - The half-life of an employee (average number of years they are employed)
 *
 * @returns An object representing the employee's ID and their calculated end date
 */
const calculateIndividualEndDate = (startDate: StartDate, employeeHalfLife: number): EndDate => {
    let yearsEmployed: number;
    do {
        // Randomly generate a number of years the employee was employed, using a negative exponential distribution
        yearsEmployed = (employeeHalfLife / 0.693) * Math.log(1 / Math.random());
    } while(yearsEmployed > 35);  // Ensure that the number of years does not exceed 35

    // Convert the years to days for precise date calculation
    const daysEmployed = Math.round(yearsEmployed * 365.25);

    // Create a new Date object to avoid mutating the original start date
    let endDate = new Date(startDate.startDate);
    endDate.setDate(endDate.getDate() + daysEmployed);

    // Return an object with the employee's ID and their calculated end date
    return {
        employeeID: startDate.employeeID,
        endDate: endDate
    };
};

/*-----------------------------------------------------------------------------*/

/**
 * Interface BirthDate
 *
 * This interface represents the schema for an employee's birth date. It's used to store the date when an employee was born.
 * 
 * @property employeeID - This is the unique identifier for the employee.
 * @property birthDate  - The birth date of the corresponding employee. This information could be used for things like age verification or birthday notifications.
 */
interface BirthDate {
    employeeID: number;
    birthDate: Date;
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateIndividualBirthDate
 *
 * This function calculates the birth date for an individual employee, based on their start and end dates.
 * The calculation uses a normal distribution with a mean of 26 and standard deviation of 8 to simulate 
 * a realistic range of ages for the employees. It ensures the generated age is not less than 18 and 
 * that the employee does not exceed 65 years old during their employment period.
 *
 * @param startDate - The start date of the employee's employment
 * @param endDate - The end date of the employee's employment
 * @param employeeID - The ID of the employee for which the birth date is being calculated
 *
 * @returns A BirthDate object representing the employee's ID and their calculated birth date
 */
const calculateIndividualBirthDate = (startDate: StartDate, endDate: EndDate, employeeID: number): BirthDate => {
    // Mean and standard deviation for the normal distribution
    const average = 26;
    const standardDeviation = 8;

    let result: number;
    do {
        // Generate a random age using a normal distribution, ensuring the age is between 18 and 65
        result = getRandom(average, standardDeviation);
    } while(result < 18 || endDate.endDate.getFullYear() - startDate.startDate.getFullYear() + result > 65);

    // Calculate the birth date by subtracting the generated age from the start date
    let birthDate = new Date(startDate.startDate);
    birthDate.setFullYear(birthDate.getFullYear() - result);

    // Return the birth date object
    return {
        employeeID: employeeID,
        birthDate: birthDate
    };
};

/*-----------------------------------------------------------------------------*/

/**
 * Interface Gender
 *
 * This interface represents the schema for an employee's gender. It's used to store the gender identity of an employee.
 * 
 * @property employeeID - This is the unique identifier for the employee.
 * @property gender     - The gender of the corresponding employee. This could be 'Male', 'Female', 'Other', or 'Prefer not to say' etc. depending on the options provided to the employee when this data was collected.
 */
interface Gender {
    employeeID: number;
    gender: string;
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateIndividualGender
 *
 * This function calculates the gender for an individual employee.
 * A simple random decision is used for the gender assignment, with a 50% chance for each gender.
 * 
 * @param employeeID - The ID of the employee for whom the gender is being calculated
 * 
 * @returns A Gender object representing the employee's ID and their randomly assigned gender
 */
const calculateIndividualGender = (employeeID: number): Gender => {
    // Use a random number to determine gender
    const gender = Math.random() <= 0.5 ? 'Male' : 'Female';

    // Return the gender object
    return { employeeID: employeeID, gender: gender };
};

/*-----------------------------------------------------------------------------*/

/**
 * Interface Name
 *
 * This interface represents the schema for storing the name data of employees. It is used to store the name of an employee.
 * 
 * @property employeeID - This is the unique identifier for the employee. 
 * @property name       - The name of the corresponding employee. It could be the first, middle, or last name based on the usage context.
 */
interface Name {
    employeeID: number;
    name: string;
}

/*-----------------------------------------------------------------------------*/

/**
 * Interface FirstName
 *
 * This interface represents the schema for storing the first name of employees. It is used to store the first name of an employee.
 * 
 * @property employeeID - This is the unique identifier for the employee. 
 * @property firstName  - The first name of the corresponding employee. It's the personal name that appears first in a person's full name.
 */
interface FirstName {
    employeeID: number;
    firstName: string;
}

/*-----------------------------------------------------------------------------*/

/**
 * General function to calculate names, based on specific criteria.
 * @param genders - Array of gender data for each employee.
 * @param firstNames - Array of first names data for each employee. This parameter is used when calculating middle names.
 * @param nameCriterion - Function to decide the name, based on specific criteria.
 * @return Array of name data for each employee.
 */
function calculateNames(genders: Gender[], firstNames: FirstName[], nameCriterion: (names: string[], firstName: string) => string): Name[] {
    return genders.map((gender, index) => {
        // Select the names data based on the gender
        let namesData = gender.gender === 'Male' ? firstNameMData : firstNameFData;

        // Flatten the data to a simple array of names
        let names = namesData.map((item: (string | number)[]) => item[1]);

        // Use the provided criterion function to decide the name
        let name = nameCriterion(names, firstNames[index]?.firstName);
        
        // Return a Name object
        return { employeeID: gender.employeeID, name: name };
    });
}

/*-----------------------------------------------------------------------------*/

/**
 * General function to calculate a name, based on specific criteria.
 * @param employeeID - The ID of the employee for whom the name is being calculated.
 * @param namesData - The data set from which to choose a name.
 * @param nameCriterion - Function to decide the name, based on specific criteria.
 * @return A Name object for the given employee.
 */
function calculateName(employeeID: number, namesData: any[], nameCriterion: (names: string[]) => string): Name {
    // Flatten the data to a simple array of names
    let names = namesData.map((item: (string)[]) => item[0]);

    // Use the provided criterion function to decide the name
    let name = nameCriterion(names);

    // Return a Name object
    return { employeeID: employeeID, name: name };
}

// Usage
// Calculate last name for a single employee
// let lastName = calculateName(employeeID, lastNamesData, getRandomName);

/*-----------------------------------------------------------------------------*/

/**
 * Function to get a random name from an array of names.
 * @param names - Array of names.
 * @return A randomly selected name.
 */
const getRandomName = (names: string[]) => {
    let randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

/*-----------------------------------------------------------------------------*/

/**
 * Function to get a unique name from an array of names. The unique name should be different from the provided first name.
 * @param names - Array of names.
 * @param firstName - The first name that should be different from the unique name.
 * @return A unique name.
 */
const getUniqueName = (names: string[], firstName: string) => {
    let uniqueName;
    // Keep generating random names until a unique one is found
    do {
        let randomIndex = Math.floor(Math.random() * names.length);
        uniqueName = names[randomIndex];
    } while(uniqueName === firstName);
    return uniqueName;
}

/*-----------------------------------------------------------------------------*/

/**
 * Interface Email
 *
 * This interface represents the schema for storing the email address of employees. It is used to store the email address of an employee.
 * 
 * @property employeeID - This is the unique identifier for the employee. 
 * @property email      - The email address of the corresponding employee. It's the official email address provided by the company or the one provided by the employee during their registration.
 */
interface Email {
    employeeID: number;
    email: string;
}

/*-----------------------------------------------------------------------------*/

/**
 * Generates a standard company email address for a given employee based on their names.
 * 
 * @param employeeID - The ID of the employee for whom the email is being generated.
 * @param firstName - The employee's first name.
 * @param middleName - The employee's middle name.
 * @param lastName - The employee's last name.
 * 
 * @return An Email object containing the employee's ID and their generated email address.
 */
const calculateIndividualEmail = (employeeID: number, firstName: string, middleName: string, lastName: string): Email => {

    // Create the email address, converting all letters to lower case as is standard for email addresses.
    let email = `${firstName}.${middleName}.${lastName}@company.com`.toLowerCase();

    // Return an Email object for this employee.
    return { employeeID: employeeID, email: email };
};

/*-----------------------------------------------------------------------------*/

/**
 * Generates a random number with a normal distribution, also known as Gaussian distribution.
 * 
 * The Box-Muller transform, a method commonly used in this type of application, is used here.
 * It involves generating two uniformly distributed random numbers and then transforming them into 
 * two standard normally distributed random variables.
 * 
 * @param average - The mean of the normal distribution.
 * @param standardDeviation - The standard deviation of the normal distribution.
 * 
 * @return A random number drawn from the distribution described by the provided mean and standard deviation.
 */
function getRandom(average: number, standardDeviation: number) {
    let u1 = Math.random();
    let u2 = Math.random();
    // Random standard normal distribution using Box-Muller transform
    let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    // Adjust to desired mean and standard deviation
    let randNormal = average + standardDeviation * randStdNormal;

    return randNormal;
}

/*-----------------------------------------------------------------------------*/

/**
 * Returns the date of the previous Monday for a given date.
 * 
 * The JavaScript `getDay` method is used to get the day of the week for the date (0 for Sunday, 1 for Monday, etc.).
 * If the day is not Monday, it adjusts the date to the previous Monday.
 * If the day is Sunday (day === 0), it adjusts the date to 6 days back to get to the previous Monday.
 * If the day is any other day of the week, it subtracts the day number from the current date to get back to the previous Monday.
 * If the day is already Monday, it returns the date as is.
 * 
 * @param date - The initial date from which to find the previous Monday.
 * 
 * @return A Date object set to the previous Monday.
 */
function getPreviousMonday(date: Date): Date {
    const day = date.getDay();
    // If the day is not Monday, adjust the date to the previous Monday
    if(day !== 1) {
        // Adjust when day is Sunday
        let diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    }
    // If the day is already Monday, return the date as is
    return date;
}

/*-----------------------------------------------------------------------------*/

/**
 * Asynchronously send employee data to a database server in smaller batches.
 * 
 * The purpose of sending in batches is to avoid overwhelming the server with too much data at once. 
 * This function loops through the entire list of employees and sends a batch to the server at each iteration.
 * The size of the batch is determined by the batchSize parameter.
 *
 * If the server's response indicates an error (response.ok is false), the function throws an error with the response status.
 *
 * @param allEmployees - An array containing all employee data.
 * @param batchSize - The number of employees to be sent to the server in each batch.
 * 
 * @throws Will throw an error if the server response indicates an unsuccessful request.
 */
const sendEmployeeDataToDatabase = async (allEmployees: Employee[], batchSize: number) => {
    for (let i = 0; i < allEmployees.length; i += batchSize) {
        const batch = allEmployees.slice(i, i + batchSize);

        const response = await fetch('http://localhost:3001/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(batch)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
};

/*-----------------------------------------------------------------------------*/

/**
 * Asynchronously fetch employee data from a database server.
 * 
 * This function sends a GET request to the server to retrieve employee data.
 * The number of employee records retrieved is determined by the limit parameter.
 * If the server's response indicates an error (response.ok is false), the function throws an error with the response status.
 * If the server's response indicates success, the function returns the parsed employee data.
 *
 * @param limit - The maximum number of employee records to retrieve from the server. Defaults to 100 if not specified.
 * 
 * @return A promise that resolves to an array of Employee objects.
 * 
 * @throws Will throw an error if the server response indicates an unsuccessful request.
 */
export const getEmployeeDataFromDatabase = async (limit: number = 100): Promise<Employee[]> => {
    const response = await fetch(`http://localhost:3001/api/employees?limit=${limit}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const employees: Employee[] = await response.json();
        return employees;
    }
};
