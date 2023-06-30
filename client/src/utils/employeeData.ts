// Import required modules
import * as math from 'mathjs';
import hiresData from './data/hires.json';
import populationData from './data/population.json';
import { addDays, differenceInDays } from 'date-fns';
import { WeightedRandomSelector } from './generateLUTs';

/*-----------------------------------------------------------------------------*/

// Import required data files for generating employee names
import firstNameMData from './lut/firstNameMLUT.json';
import firstNameFData from './lut/firstNameFLUT.json';
import lastNameData from './data/lastName.json';

/*-----------------------------------------------------------------------------*/

/**
 * An interface representing the number of employees for a given year.
 * @param year The year for which the employee data is recorded.
 * @param employees The number of employees for the given year.
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
 * @param presentEmployees  The total number of employees at present.
 * @param startYear         The first year for which to calculate the number of employees.
 * @param endYear           The last year for which to calculate the number of employees.
 *
 * @returns An array of objects containing the year (.year) and the calculated number of employees (.employees) for that year.
 *
 * @throws An error if the current year is not found in the population data.
 *
 * @example
 *
 * const presentEmployees = 100;
 * const startYear = 2020;
 * const endYear = 2022;
 * const employeesPerYear = calculateEmployeesPerYear(presentEmployees, startYear, endYear);
 * console.log(employeesPerYear);
 * // Output: [{ year: 2020, employees: 100 }, { year: 2021, employees: 110 }, { year: 2022, employees: 120 }]
 */
export const calculateEmployeesPerYear = (presentEmployees: number, startYear: number, endYear: number): YearEmployeesData[] => {
    const currentYear = new Date().getFullYear();
    const populationThisYear = populationData.find((item) => item.year === currentYear)?.population || 0;

    if (populationThisYear === 0) {
        throw new Error(`Population data not found for current year (${currentYear})`);
    }

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

/**
 * Function: targetYearEmployees
 *
 * This function is used to get the number of employees for a specific year from an array of objects containing the year and the calculated number of employees for that year.
 *
 * @param employeesPerYear  An array of objects containing the year (.year) and the calculated number of employees (.employees) for that year.
 * @param targetStartYear   The year for which to get the number of employees.
 *
 * @returns The number of employees for the specified year.
 *
 * @example
 *
 * const employeesPerYear = [
 *   { year: 2020, employees: 100 },
 *   { year: 2021, employees: 110 },
 *   { year: 2022, employees: 120 },
 * ];
 * const targetStartYear = 2021;
 * const targetEmployees = targetYearEmployees(employeesPerYear, targetStartYear);
 * console.log(targetEmployees);
 * // Output: 110
 */
export const targetYearEmployees = (employeesPerYear: YearEmployeesData[], targetStartYear: number): number => {
    let targetYearEmployees = employeesPerYear.find(data => data.year === targetStartYear)?.employees || 0;
    
    return targetYearEmployees;
};

/*-----------------------------------------------------------------------------*/

/**
 * Function: getPreviousMonday
 *
 * This function is used to get the previous Monday from a given date.
 *
 * @param date  A Date object representing the date for which to get the previous Monday.
 *
 * @returns A Date object representing the previous Monday.
 *
 * @example
 *
 * const date = new Date('2022-01-05T00:00:00.000Z');
 * const previousMonday = getPreviousMonday(date);
 * console.log(previousMonday);
 * // Output: Mon Jan 03 2022 00:00:00 GMT-0800 (Pacific Standard Time)
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
 * Function: calculateEndDate
 *
 * This function is used to calculate the end date of an employee's contract based on their start date and half-life.
 *
 * @param employeeStartDate  A Date object representing the start date of the employee's contract.
 * @param employeeHalfLife   A number representing the half-life of the employee's contract in years.
 *
 * @returns A Date object representing the end date of the employee's contract.
 *
 * @example
 *
 * const employeeStartDate = new Date('2022-01-01T00:00:00.000Z');
 * const employeeHalfLife = 5;
 * const employeeEndDate = calculateEndDate(employeeStartDate, employeeHalfLife);
 * console.log(employeeEndDate);
 * // Output: Sat Jan 01 2028 00:00:00 GMT-0800 (Pacific Standard Time)
 */
export const calculateEndDate = (employeeStartDate: Date, employeeHalfLife: number): Date => {
    
    let yearsEmployed: number;

    // Generate a random number of years employed that is within the valid range
    yearsEmployed = Math.min((-employeeHalfLife / Math.log(2)) * Math.log(Math.random()), 30);

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

/**
 * Interface: EmploymentDates
 *
 * This interface represents the start and end dates of an employee's employment.
 *
 * @param startDate A Date object representing the start date of the employee's employment.
 * @param endDate A Date object representing the end date of the employee's employment.
 */
export interface EmploymentDates {
    startDate: Date;
    endDate: Date;
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateInitialDates
 *
 * This function is used to calculate the start and end dates of the initial employees based on the number of employees per year, the simulation start year, and the employee half-life.
 *
 * @param employeesPerYear  An array of objects representing the number of employees for each year.
 * @param simStartYear      A number representing the year in which the simulation starts.
 * @param employeeHalfLife  A number representing the half-life of the employee's contract in years.
 *
 * @returns A tuple containing an array of objects representing the start and end dates of the initial employees and an object containing the count of end dates for each year.
 *
 * @example
 *
 * const employeesPerYear = [
 *   { year: 2022, employees: 10 },
 *   { year: 2023, employees: 20 },
 *   { year: 2024, employees: 30 },
 *   { year: 2025, employees: 40 },
 *   { year: 2026, employees: 50 },
 * ];
 * const simStartYear = 2022;
 * const employeeHalfLife = 5;
 * const [initialDates, endDatesCount] = calculateInitialDates(employeesPerYear, simStartYear, employeeHalfLife);
 * console.log(initialDates);
 * // Output: [
 * //   { startDate: Mon Jan 03 2022 00:00:00 GMT-0800 (Pacific Standard Time), endDate: Mon Jan 10 2022 00:00:00 GMT-0800 (Pacific Standard Time) },
 * //   { startDate: Mon Jan 10 2022 00:00:00 GMT-0800 (Pacific Standard Time), endDate: Mon Jan 17 2022 00:00:00 GMT-0800 (Pacific Standard Time) },
 * //   { startDate: Mon Jan 17 2022 00:00:00 GMT-0800 (Pacific Standard Time), endDate: Mon Jan 24 2022 00:00:00 GMT-0800 (Pacific Standard Time) },
 * //   { startDate: Mon Jan 24 2022 00:00:00 GMT-0800 (Pacific Standard Time), endDate: Mon Jan 31 2022 00:00:00 GMT-0800 (Pacific Standard Time) },
 * //   { startDate: Mon Jan 31 2022 00:00:00 GMT-0800 (Pacific Standard Time), endDate: Mon Feb 07 2022 00:00:00 GMT-0800 (Pacific Standard Time) }
 * // ]
 * console.log(endDatesCount);
 * // Output: { '2022': 10 }
 */
export const calculateInitialDates = (employeesPerYear: YearEmployeesData[], simStartYear: number, employeeHalfLife: number): [EmploymentDates[], Record<number, number>] => {
    let numStartYearEmployees: number = targetYearEmployees(employeesPerYear, simStartYear);
    let simStartDate: Date = new Date(simStartYear, 0, 1);

    // Initialize an empty object to store end date counts
    const endDatesCount: Record<number, number> = {};

    // We will store our dates in an array of objects, where each object contains a start and end date
    let initialDates: Array<EmploymentDates> = [];

    for(let i = 0; i < numStartYearEmployees; i++) {
        let currentDaysEmployed: number;
        let totalDaysEmployed: number;
        let endDate: Date;

        // The number of days employed must be within the valid range
        do {
            endDate = calculateEndDate(simStartDate, employeeHalfLife);
            totalDaysEmployed = Math.abs(differenceInDays(simStartDate, endDate));
        } while(totalDaysEmployed < 1 || totalDaysEmployed > 30 * 365.25);

        //Calculate where the sim start date is in relation to the employee's total employment
        let randomFactor = Math.random();
        randomFactor = (randomFactor === 0) ? 0.00001 : randomFactor; // Avoid division by zero
        currentDaysEmployed = totalDaysEmployed * Math.min((-employeeHalfLife / Math.log(2)) * Math.log(Math.random()), 30) / 30;

        // Subtract the number of days employed from the start date to get the initial start date
        let initialStartDate = addDays(simStartDate, -currentDaysEmployed);

        // Set the initial start date to the previous Monday
        initialStartDate = getPreviousMonday(initialStartDate);
        
        // Set the initial end date based on the start date and days employed
        endDate = addDays(initialStartDate, totalDaysEmployed + 7);
        // Store these in our array of objects
        initialDates.push({
            startDate: initialStartDate,
            endDate: endDate
        });

        // Increase the count for the end date's year
        const endYear = endDate.getFullYear();
        if (endDatesCount[endYear]) {
            endDatesCount[endYear]++;
        } else {
            endDatesCount[endYear] = 1;
        }
    }

    // Sort the dates by the start date
    initialDates.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    return [initialDates, endDatesCount];
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: yearNewHires
 *
 * This function is used to calculate the number of new hires for a given year based on the number of employees for each year, the number of employees in the current year, the depth of the moving average, the current year, and the count of end dates for each year.
 *
 * @param employeesPerYear  An array of objects representing the number of employees for each year.
 * @param thisYearEmployees A number representing the number of employees in the current year.
 * @param depthOfMA         A number representing the depth of the moving average.
 * @param currentYear       A number representing the current year.
 * @param endDatesCount     An object containing the count of end dates for each year.
 *
 * @returns A number representing the number of new hires for the given year.
 *
 * @example
 *
 * const employeesPerYear = [
 *   { year: 2022, employees: 10 },
 *   { year: 2023, employees: 20 },
 *   { year: 2024, employees: 30 },
 *   { year: 2025, employees: 40 },
 *   { year: 2026, employees: 50 },
 * ];
 * const thisYearEmployees = 30;
 * const depthOfMA = 3;
 * const currentYear = 2024;
 * const endDatesCount = { '2022': 10, '2023': 20, '2024': 30 };
 * const yearNewHires = yearNewHires(employeesPerYear, thisYearEmployees, depthOfMA, currentYear, endDatesCount);
 * console.log(yearNewHires);
 * // Output: 10
 */
export function yearNewHires(employeesPerYear: YearEmployeesData[], thisYearEmployees: number, depthOfMA: number, currentYear: number, endDatesCount: Record<number, number>): number {

    // Find the number of employees for the next year
    let nextYearEmployees = targetYearEmployees(employeesPerYear, currentYear + 1);

    // Project the number of employees leaving in the target year, based on the moving average of the previous years
    let endDatesSum: number = 0;
    for(let i = 0; i < depthOfMA; i++) {
        endDatesSum += endDatesCount[currentYear - i - 1] || 0;
    }
    let projectedEndDates = Math.round(endDatesSum / depthOfMA);

    // Calculate the number of new hires in the target year, or 0 if the number is negative
    let yearNewHires = Math.max(nextYearEmployees - thisYearEmployees + projectedEndDates, 0);

    return yearNewHires;
}

/*-----------------------------------------------------------------------------*/

/**
 * Interface: HireData
 *
 * This interface represents the statistical data for employee hiring.
 *
 * @param avg A number representing the average number of employees hired.
 * @param stdev A number representing the standard deviation of the number of employees hired.
 * @param zavg A number representing the average number of employees hired in terms of standard deviations from the mean.
 * @param zstdev A number representing the standard deviation of the number of employees hired in terms of standard deviations from the mean.
 */
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
 * @param thisYear - The year in which the new hires start
 * @param numHires - The number of new hires for the target year
 *
 * @returns The updated array of start dates with the newly hired employees' start dates for the target year added
 */
export const calculateStartDatesForYear = (thisYear: number, numHires: number): Date[] => {

    // Find the first Monday of the target year
    let firstMonday = firstMondayOfYear(thisYear);
    
    let startDates: Date[] = [];
    let newHiresThisYear = numHires;
    
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
        let hiringDate = new Date(firstMonday);
        hiringDate = addDays(hiringDate, i * 14);
        let hiringMonth = hiringDate.getMonth();

        // Calculate the average number of new hires for this two-week period, based on the month
        let randomAvg = avgMultipliers[hiringMonth] * avgNumHiredPerRound;

        // Calculate the average standard deviation for this two-week period, based on the month
        let randomStdev = stdevMultipliers[hiringMonth] * avgNumHiredPerRound;

        // Calculate the number of new hires for this two-week period
        let newHiresThisRound = Math.round(getRandom(randomAvg, randomStdev));

        let j = 0;
        while (j < newHiresThisRound) {
            // Add the hiring date to the array of start dates
            startDates.push(new Date(hiringDate));
            j++;
        }

        if (startDates.length >= newHiresThisYear) {
            break;
        }
        
    }        
    // Calculate the total hires so far
    let totalHiresSoFar = startDates.length;

    // If total hires so far is less than the target hires, add hires on the last day
    if (totalHiresSoFar < numHires) {
        let hiringDate = new Date(firstMonday.getTime() + ((numHiringRounds - 1) * 14 * 24 * 60 * 60 * 1000));
        for (let i = totalHiresSoFar; i < numHires; i++) {
            startDates.push(hiringDate);
        }
    } 
    // If total hires so far is more than the target hires, remove excess hires from the last day
    else if (totalHiresSoFar > numHires) {
        startDates.length = numHires;
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
 * @param avgStartAge - The average age of employees when they start working
 * @param stdevStartAge - The standard deviation of the age of employees when they start working
 *
 * @returns A Date object representing the employee's birth date
 */
export const calculateBirthDate = (startDate: Date, avgStartAge: number, stdevStartAge: number): Date => {
    let employeeAge: number;
    do {
        employeeAge = getRandom(avgStartAge, stdevStartAge);
    } while(employeeAge < 18 || employeeAge > 65);

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

/**
 * Function: calculateFirstName
 *
 * This function calculates the first name for an individual employee, based on their gender and birth date.
 * The function selects a lookup table based on the gender and birth year of the employee, and uses a weighted
 * random selector to draw a random name from the lookup table.
 *
 * @param sex - The gender of the employee
 * @param birthDate - The birth date of the employee
 *
 * @returns A string containing the employee's first name
 */
export function calculateFirstName(sex: string, birthDate: Date): string {
    // Select the lookup table based on the gender
    let lutByYear: { [key: number]: any } = sex === 'Male' ? firstNameMData : firstNameFData;

    // Get the birth year
    let birthYear = birthDate.getFullYear();

    // Retrieve the lookup table for the birth year
    let lut = lutByYear[birthYear];

    // If there's no lookup table for the birth year, return a default name
    if (!lut) {
        birthYear = Math.floor(Math.random() * 110) + 1910;
        lut = lutByYear[birthYear];        
    }

    // Create a weighted random selector with the lookup table for the birth year
    let selector = new WeightedRandomSelector([], 0, 0);
    selector.aliasTable = lut.aliasTable;
    selector.outcomes = lut.outcomes;

    // Use the weighted random selector to draw a random name
    return selector.drawRandomOutcome();
}

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateMiddleName
 *
 * This function calculates the middle name for an individual employee, based on their gender, birth date, and first name.
 * The function selects a lookup table based on the gender and birth year of the employee, and uses a weighted
 * random selector to draw a random name from the lookup table. It ensures that the generated middle name is different
 * from the employee's first name.
 *
 * @param sex - The gender of the employee
 * @param birthDate - The birth date of the employee
 * @param firstName - The first name of the employee
 *
 * @returns A string containing the employee's middle name
 */
export function calculateMiddleName(sex: string, birthDate: Date, firstName: string): string {
    // Select the lookup table based on the gender
    let lutByYear: { [key: number]: any } = sex === 'Male' ? firstNameMData : firstNameFData;

    // Get the birth year
    let birthYear = birthDate.getFullYear();

    // Retrieve the lookup table for the birth year
    let lut = lutByYear[birthYear];

    // If there's no lookup table for the birth year, return a default name
    if (!lut) {
        birthYear = Math.floor(Math.random() * 110) + 1910;
        lut = lutByYear[birthYear];        
    }

    // Create a weighted random selector with the lookup table for the birth year
    let selector = new WeightedRandomSelector([], 0, 0);
    selector.aliasTable = lut.aliasTable;
    selector.outcomes = lut.outcomes;

    // Use the weighted random selector to draw a random name
    let middleName = selector.drawRandomOutcome();

    // Keep drawing a name until it is different from the first name
    while (middleName === firstName) {
        middleName = selector.drawRandomOutcome();
    }

    return middleName;
}

/*-----------------------------------------------------------------------------*/

// interface LastNameData {
//     name: string;
//     rank: number;
//     pctwhite: number;
//     pctblack: number;
//     pctapi: number;
//     pctaian: number;
//     pct2prace: number;
//     pcthispanic: number;
// }

/*-----------------------------------------------------------------------------*/

    // Convert the lastNamesData array to include numeric values
    // lastNamesData = lastNamesData.map((item: any) => {
    //     return {
    //         ...item,
    //         pctwhite: parseFloat(item.pctwhite),
    //         pctblack: parseFloat(item.pctblack),
    //         pctapi: parseFloat(item.pctapi),
    //         pctaian: parseFloat(item.pctaian),
    //         pct2prace: parseFloat(item.pct2prace),
    //         pcthispanic: parseFloat(item.pcthispanic),
    //     };
    // });
/**
 * Function: calculateLastName
 *
 * This function calculates the last name for an individual employee.
 * The function selects a random last name from a lookup table and converts it to title case.
 *
 * @param None
 *
 * @returns A string containing the employee's last name
 */
export const calculateLastName = (): string => {
    // Pick a random index
    const randomIndex = Math.floor(Math.random() * lastNameData.length);
    
    // Get the last name at the random index
    let name = String(lastNameData[randomIndex][0]);
    
    // Convert the name to title case
    let titleCaseName = name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');

    // Return the title case name
    return titleCaseName;
};

/*-----------------------------------------------------------------------------*/

/**
 * Function: calculateEmail
 *
 * This function generates a standard company email address for a given employee based on their names.
 * The email address is created by concatenating the employee's first name, middle initial, last name, and domain name.
 * All letters in the email address are converted to lower case as is standard for email addresses.
 *
 * @param firstName - The employee's first name.
 * @param middleName - The employee's middle name.
 * @param lastName - The employee's last name.
 *
 * @returns A string containing the employee's email address.
 */
export const calculateEmail = (firstName: string, middleName: string, lastName: string): string => {
    // Get the middle initial from the middle name
    let middleInitial = middleName.charAt(0);

    // Set the domain name
    let domain = 'company.com';

    // Create the email address by concatenating the first name, middle initial, last name, and domain name
    let email = `${firstName}.${middleInitial}.${lastName}@${domain}`.toLowerCase();

    // Return the email address
    return email;
};

/*-----------------------------------------------------------------------------*/

/**
 * Type: EducationLevel
 *
 * This type represents the different levels of education that an employee can have.
 */
type EducationLevel = 'No High School Diploma' | 'High School Diploma' | 'Some College, No Degree' | 'Associate Degree' | 'Bachelor\'s Degree' | 'Master\'s Degree' | 'Doctoral or Professional Degree';

/**
 * Constant: educationData
 *
 * This constant contains a lookup table of the number of employees with each level of education.
 * The lookup table is loaded from a JSON file.
 */
export const educationData: Record<EducationLevel, number> = require('./data/education.json');

export const calculateEducation = (year: number): EducationLevel => {
    const currentYear = new Date().getFullYear();
    const baseYearDiff = Math.abs(currentYear - year);
  
    let weights = Object.entries(educationData).reduce((acc, [level, weight], index) => {
      const yearDiff = baseYearDiff * (index + 1) * 0.1; // Adding 1 to the index to avoid division by zero
      const adjustedWeight = weight / Math.pow(yearDiff, 2);
      return { ...acc, [level]: adjustedWeight };
    }, {} as Record<EducationLevel, number>);
  
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  
    const random = Math.random() * totalWeight;
  
    let count = 0;
    for (const [level, weight] of Object.entries(weights)) {
      count += weight;
      if (random < count) {
        return level as EducationLevel;
      }
    }
  
    throw new Error('Invalid data');
};



/*-----------------------------------------------------------------------------*/

export const trackEducationStatistics = (startYear: number, endYear: number): void => {
    let counts = {
      "No High School Diploma": 0,
      "High School Diploma": 0,
      "Some College, No Degree": 0,
      "Associate Degree": 0,
      "Bachelor's Degree": 0,
      "Master's Degree": 0,
      "Doctoral or Professional Degree": 0,
    };
  
    let total = 0;
  
    for (let year = startYear; year <= endYear; year++) {
      for (let i = 0; i < 1000; i++) {
        const educationLevel = calculateEducation(year);
  
        if (counts.hasOwnProperty(educationLevel)) {
          counts[educationLevel]++;
          total++;
        } else {
          throw new Error(`Invalid education level: ${educationLevel}`);
        }
      }
  
      // Calculate and print statistics every 5 years
      if (year % 5 === 0) {
        console.log(`Year ${year}:`);
        
        for (const [level, count] of Object.entries(counts)) {
          const percent = ((count / total) * 100).toFixed(2);
          console.log(`    ${level}: ${percent}%`);
        }
  
        // Reset counts for next 5-year period
        counts = {
          "No High School Diploma": 0,
          "High School Diploma": 0,
          "Some College, No Degree": 0,
          "Associate Degree": 0,
          "Bachelor's Degree": 0,
          "Master's Degree": 0,
          "Doctoral or Professional Degree": 0,
        };
        total = 0;
      }
    }
  };
  
  

/*-----------------------------------------------------------------------------*/

/**
 * Function: getRandom
 *
 * This function generates a random number with a normal distribution, also known as Gaussian distribution.
 * The Box-Muller transform, a method commonly used in this type of application, is used here.
 * It involves generating two uniformly distributed random numbers and then transforming them into 
 * two standard normally distributed random variables.
 *
 * @param average - The mean of the normal distribution.
 * @param standardDeviation - The standard deviation of the normal distribution.
 *
 * @returns A random number drawn from the distribution described by the provided mean and standard deviation.
 */
function getRandom(average: number, standardDeviation: number): number {
    // Generate two uniformly distributed random numbers
    let u1 = Math.random();
    let u2 = Math.random();

    // Use the Box-Muller transform to generate two standard normally distributed random variables
    let randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    // Adjust the standard normally distributed random variable to the desired mean and standard deviation
    let randNormal = average + standardDeviation * randStdNormal;

    // Return the random number drawn from the distribution described by the provided mean and standard deviation
    return randNormal;
}

/*-----------------------------------------------------------------------------*/
