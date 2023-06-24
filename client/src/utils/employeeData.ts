// Import required modules
import { Employee } from '../types';
import * as math from 'mathjs';
import hiresData from './data/hires.json';
import populationData from './data/population.json';

/*-----------------------------------------------------------------------------*/

// Import required data files for generating employee names
const firstNameMData = require('./firstNameMData.json');
const firstNameFData = require('./firstNameFData.json');
var lastNamesData = require('./lastNamesData.json');

/*-----------------------------------------------------------------------------*/

/**
 * Interface YearEmployeesData
 *
 * This interface is used to represent year-wise data for the total number of employees in a company.
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
 * Function: calculateEmployeesPerYear
 *
 * This function is used to calculate the number of people employed at the start of each year. The calculation is based on
 * the assumption that the number of employees in a particular year is proportional to the total population in that year. 
 * It is designed to predict the potential number of employees in the future by taking into account demographic changes. 
 * For example, as the population increases, we could expect the number of employees to increase correspondingly.
 *
 * @param presentEmployees  - The total number of employees at present.
 * @param populationData    - An array of objects containing the year and population for each year.
 *
 * @returns An array of objects containing the year (.year) and the calculated number of employees (.employees) for that year.
 *
 * @example
 *
 * const populationData = [
 *     { year: 2021, population: 900000 },
 *     { year: 2022, population: 950000 },
 *     { year: 2023, population: 1000000 },
 * ];
 * 
 * const numEmployees = 10000;
 * 
 * console.log(calculateEmployeesPerYear(numEmployees, populationData)); // Outputs: [{ year: 2021, employees: 9000 }, { year: 2022, employees: 9500 }, { year: 2023, employees: 10000 }]
 */
export const calculateEmployeesPerYear = (presentEmployees: number, startYear: number, endYear: number): YearEmployeesData[] => {
    const currentYear = new Date().getFullYear();
    const populationThisYear = populationData.find((item) => item.year === currentYear)?.population || 0;
    const employeePercentOfPopulation = presentEmployees / populationThisYear;

    const employeesPerYear = populationData
        .filter((data) => data.year >= startYear && data.year <= endYear)  // Filter out years outside the given range
        .map((data) => {
            return {
                year: data.year,
                employees: Math.round(data.population * employeePercentOfPopulation)
            };
        });

    return employeesPerYear;
};

/*-----------------------------------------------------------------------------*/

export const targetYearEmployees = (employeesPerYear: YearEmployeesData[], targetStartYear: number): number => {
    let targetYearEmployees = employeesPerYear.find(data => data.year === targetStartYear)?.employees || 0;
    
    return targetYearEmployees;
};

/*-----------------------------------------------------------------------------*/

/**
 * Function: getPreviousMonday
 * 
 * Returns the date of the Monday prior to the given date.
 * The JavaScript `getDay` method is used to get the day of the week for the date (0 for Sunday, 1 for Monday, etc.).
 * If the day is not Monday, it adjusts the date to the previous Monday.
 * If the day is already Monday, it returns the date as is.
 * 
 * @param date  - The initial date from which to find the previous Monday.
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
 * Function: calculateInitialStartDate
 *
 * This function calculates the start dates of employees present at the start of the simulation.
 * The number of years the employee has been employed is based on their position in the hiring order,
 * and the start date is set to a Monday the correct number of years ago.
 *
 * @param employeeID        - The ID of the employee (also represents the order in which they were hired)
 * @param initialEmployees  - The total number of employees at the beginning of the simulation
 * @param targetStartYear   - The start year of the simulation
 * @param employeeHalfLife  - The number of years it takes for half of the employees to leave
 *
 * @returns An object containing the employeeID and their calculated start date.
 */
export const calculateInitialStartDate = (employeeID: number, initialEmployees: number, targetStartYear: number, employeeHalfLife: number): Date => {
    
    // Calculate the number of years the employee has been employed, based on their position in the hiring order, or a maximum of 30 years
    var yearsEmployed = Math.min((employeeHalfLife/0.693) * Math.log(initialEmployees / employeeID), 30);
    
    // Convert the number of years employed to the number of days employed
    const daysEmployed = Math.round(yearsEmployed * 365.25);
    
    // Create a new Date object representing the day prior to the target start year
    let startDate = new Date(targetStartYear - 1, 11, 30);
    
    // Subtract the number of days employed from the start date to get the employee's start date
    startDate.setDate(startDate.getDate() - daysEmployed);
    
    // Adjust the start date to the previous Monday
    startDate = getPreviousMonday(startDate);

    // Return the employee's ID and start date as an object
    return startDate;
};
/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateEndDate
 *
 * This function calculates the end date of an employee given their start date and the employee half-life.
 * It uses a random number to simulate variability in employment duration.
 *
 * @param simStartYear      - The start year of the simulation
 * @param employeeStartDate - The start date of the employee
 * @param employeeHalfLife  - The number of years it takes for half of the employees to leave
 *
 * @returns A Date object representing the employee's end date.
 */
export const calculateEndDate = (simStartYear: number, employeeStartDate: Date, employeeHalfLife: number): Date => {
    
    let yearsEmployed: number;

    // Generate a random number of years employed that is within the valid range
    do {
        yearsEmployed = (employeeHalfLife / 0.693) * Math.log(1 / Math.random());
    } while(employeeStartDate.getFullYear() + yearsEmployed < simStartYear || yearsEmployed > 35);

    // Convert the number of years employed to the number of days employed
    const daysEmployed = Math.round(yearsEmployed * 365.25);

    // Create a new Date object to avoid mutating the original one
    let endDate = new Date(employeeStartDate);
    
    // Add the number of days employed to the start date to get the end date
    endDate.setDate(endDate.getDate() + daysEmployed);

    // Return the employee's end date as a Date object
    return endDate;
}

/*-----------------------------------------------------------------------------*/

function yearNewHires(employeesPerYear: YearEmployeesData[], depthOfMA: number, targetYear: number, endDatesPerYear: YearEmployeesData[]): number {
    // Find the number of employees for the target year
    let thisYearEmployees = targetYearEmployees(employeesPerYear, targetYear);

    // Find the number of employees for the next year
    let nextYearEmployees = targetYearEmployees(employeesPerYear, targetYear + 1);

    // Project the number of employees leaving in the target year, based on the moving average of the previous years
    let endDatesSum: number = 0;
    for(let i = 0; i < depthOfMA; i++) {
        let targetData = endDatesPerYear.find(data => data.year === targetYear + i);
        if (targetData) {
            endDatesSum += targetData.employees;
        }
    }
    let projectedEndDates = endDatesSum / depthOfMA;

    // Calculate the number of new hires in the target year, or 0 if the number is negative
    let yearNewHires = Math.max(nextYearEmployees - thisYearEmployees + projectedEndDates, 0);

    return yearNewHires;
}

/*-----------------------------------------------------------------------------*/

interface HireData {
    avg: number;
    stdev: number;
    zavg: number;
    zstdev: number;
}

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
const calculateStartDatesForYear = (targetYear: number, numNewHires: number): Date[] => {

    // Find the first Monday of the target year
    let firstMonday = firstMondayOfYear(targetYear);
    
    let startDates: Date[] = [];
    let newHiresThisYear = numNewHires;
    
    // If there are no new hires this year, there's no need to continue, return the unchanged start dates array
    if (newHiresThisYear === 0) {
        return startDates;
    }

    // Explicitly tell TypeScript that hiresData is an array of HireData objects
    const hiresMonthlyData: HireData[] = hiresData;

    // Create arrays of the average and standard deviation values from the hires data
    const avgValues = hiresMonthlyData.map((obj: HireData) => obj.avg);
    const stdevValues = hiresMonthlyData.map((obj: HireData) => obj.stdev);

    // Calculate the average of the averages and convert the averages to a multiplier of the average
    const avgMean = math.mean(avgValues);
    const avgMultipliers = avgValues.map((avg: number) => avg / avgMean);

    // Calculate the average of the standard deviations and convert the standard deviations to a multiplier of the average
    const stdevMean = math.mean(stdevValues);
    const stdevMultipliers = stdevValues.map((stdev: number) => stdev / stdevMean);

    // Calculate the number of new hires per hiring period (assuming 26 hiring periods in a year)
    let numHiringRounds = 26;
    let avgNumHiredPerRound = newHiresThisYear / numHiringRounds;
    for (let i = 0; i < numHiringRounds; i++) {
        // Use a new Date object to avoid mutating the original date
        let hiringDate = new Date(firstMonday.getDate() + (i * 14));
        let hiringMonth = hiringDate.getMonth();

        // Calculate the average number of new hires for this two-week period, based on the month
        let randomAvg = avgMultipliers[hiringMonth] * avgNumHiredPerRound;

        // Calculate the average standard deviation for this two-week period, based on the month
        let randomStdev = stdevMultipliers[hiringMonth] * stdevMean;

        // Calculate the number of new hires for this two-week period
        let newHiresThisRound = getRandom(randomAvg, randomStdev);

        for (let j = 0; j < newHiresThisRound; j++) {
            startDates.push(hiringDate);
        }
    }

    // Return the array of start dates for the target year
    return startDates;  

}             

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
 * Function: calculateBirthDate
 *
 * This function calculates the birth date for an individual employee, based on their start and end dates.
 * The calculation uses a normal distribution with a mean of 26 and standard deviation of 8 to simulate 
 * a realistic range of ages for the employees. It ensures the generated age is not less than 18 and 
 * that the employee does not exceed 65 years old during their employment period.
 *
 * @param startDate - The start date of the employee's employment
 * @param endDate - The end date of the employee's employment
 * @param avgStartAge - The average age of employees when they start working
 * @param stdevStartAge - The standard deviation of the age of employees when they start working
 *
 * @returns A BirthDate object representing the employee's ID and their calculated birth date
 */
export const calculateBirthDate = (startDate: Date, avgStartAge: number, stdevStartAge: number): Date => {
    let employeeAge: number;
    do {
        employeeAge = getRandom(avgStartAge, stdevStartAge);
    } while(employeeAge < 18 || startDate.getFullYear() - employeeAge > 65);

    // Calculate the birth date by subtracting the generated age from the start date
    let birthDate = new Date(startDate);
    birthDate.setFullYear(birthDate.getFullYear() - employeeAge);
    
    // Add or subtract a random number of days (between -180 and 180) from the birth date
    let randomDay = Math.floor(Math.random() * 361) - 180; // generates random number between -180 and 180
    birthDate.setDate(birthDate.getDate() + randomDay);

    return birthDate;
};

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateSex
 *
 * This function calculates the gender for an individual employee.
 * A simple random decision is used for the gender assignment, with a 50% chance for each gender.
 * 
 * @param None
 * 
 * @returns A string containing the employee's gender
 */
export const calculateSex = (): string => {
    // Use a random number to determine gender
    const sex = Math.random() <= 0.5 ? 'Male' : 'Female';

    // Return the gender
    return sex;
};

/*-----------------------------------------------------------------------------*/

interface NameData {
    year: number;
    name: string;
    popularity: number;
}

export function calculateFirstName(sex: string, birthDate: Date): string {
    // Select the names data based on the gender
    let namesData: NameData[] = sex === 'Male' ? firstNameMData : firstNameFData;

    // Get the birth year
    let birthYear = birthDate.getFullYear();

    // Filter the names data to include only names from the birth year
    let namesFromBirthYear = namesData.filter((item: NameData) => item.year === birthYear);

    // If there's no data for the birth year, return a default name
    if (namesFromBirthYear.length === 0) {
        return 'Default Name';
    }

    // Use a random index to select a name from the filtered list
    let randomIndex = Math.floor(Math.random() * namesFromBirthYear.length);

    // Return the randomly selected name
    return namesFromBirthYear[randomIndex].name;
}

/*-----------------------------------------------------------------------------*/

export function calculateMiddleName(gender: string, birthDate: Date): string {
    // Select the names data based on the gender
    let namesData: NameData[] = gender === 'Male' ? firstNameMData : firstNameFData;

    // Get the birth year
    let birthYear = birthDate.getFullYear();

    // Filter the names data to include only names from the birth year
    let namesFromBirthYear = namesData.filter((item: NameData) => item.year === birthYear);

    // If there's no data for the birth year, return a default name
    if (namesFromBirthYear.length === 0) {
        return 'Default Name';
    }

    // Use a random index to select a name from the filtered list
    let randomIndex = Math.floor(Math.random() * namesFromBirthYear.length);

    // Return the randomly selected name
    return namesFromBirthYear[randomIndex].name;
}

/*-----------------------------------------------------------------------------*/

interface LastNameData {
    name: string;
    rank: number;
    pctwhite: number;
    pctblack: number;
    pctapi: number;
    pctaian: number;
    pct2prace: number;
    pcthispanic: number;
}

/*-----------------------------------------------------------------------------*/

export function calculateLastName(): string {
    // Convert the lastNamesData array to include numeric values
    lastNamesData = lastNamesData.map((item: any) => {
        return {
            ...item,
            pctwhite: parseFloat(item.pctwhite),
            pctblack: parseFloat(item.pctblack),
            pctapi: parseFloat(item.pctapi),
            pctaian: parseFloat(item.pctaian),
            pct2prace: parseFloat(item.pct2prace),
            pcthispanic: parseFloat(item.pcthispanic),
        };
    });
  
    // Use a random index to select a name from the lastNamesData array
    let randomIndex = Math.floor(Math.random() * lastNamesData.length);

    // Get the selected name
    let selectedName = lastNamesData[randomIndex].name;

    // Convert the selected name to title case
    let lastName = selectedName.charAt(0).toUpperCase() + selectedName.slice(1).toLowerCase();

    // Return the selected last name
    return lastName;
}

/*-----------------------------------------------------------------------------*/

// function weightedRand(spec) {
//     var i, j, table = [];
    
//     // Find the smallest weight
//     var smallestWeight = Math.min(...Object.values(spec));
    
//     // Invert the smallest weight to use as a scaling factor
//     var scale = 1 / smallestWeight;
  
//     for (i in spec) {
//       // Multiply the weight by the scale to get the count
//       var count = spec[i] * scale;
      
//       // Push the outcome into the table the calculated number of times
//       for (j = 0; j < count; j++) {
//         table.push(i);
//       }
//     }
  
//     return function() {
//       return table[Math.floor(Math.random() * table.length)];
//     }
//   }

/*-----------------------------------------------------------------------------*/

/**
 * Generates a standard company email address for a given employee based on their names.
 * 
 * @param firstName - The employee's first name.
 * @param middleName - The employee's middle name.
 * @param lastName - The employee's last name.
 * 
 * @return An Email object containing the employee's ID and their generated email address.
 */
export const calculateEmail = (firstName: string, middleName: string, lastName: string): string => {

    let middleInitial = middleName.charAt(0);
    let domain = 'company.com';

    // Create the email address, converting all letters to lower case as is standard for email addresses.
    let email = `${firstName}.${middleInitial}.${lastName}@${domain}`.toLowerCase();

    // Return an Email object for this employee.
    return email;
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
