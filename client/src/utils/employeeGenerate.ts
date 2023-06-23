// This is the file that will replace the code in client/src/utils/employeeUtils.ts


import { calculateEmployeesPerYear, calculateLeavingEmployeesPerYear, calculateNewHiresPerYear, calculateTotalHires, targetStartYearEmployees, calculateStartDateInitial, calculateEndDatesInitial, calculateStartDatesAll, calculateEndDatesAll, calculateBirthDates } from './calculationUtils';
import { calculateGenders, calculateFirstNames, calculateMiddleNames, calculateLastNames, calculateEmails } from './nameGenderUtils';
import { generateEmployeeData } from './employeeDataUtils';
import { sendEmployeeDataToDatabase } from './databaseUtils';

export const generateEmployees = async (numEmployees: number, startYear: number, endYear: number, empHalfLife: number): Promise<void> => {
    // ...calculation code...

    const allEmployees: Employee[] = [];
    for (let i = 0; i < totalHires; i++) {
        const employee = generateEmployeeData(i, birthDates, firstNames, middleNames, lastNames, emails, startDatesAll, endDatesAll, genders);
        allEmployees.push(employee);
    }

    await sendEmployeeDataToDatabase(allEmployees, batchSize);
};


/*-----------------------------------------------------------------------------*/

// This code will let me increment a value. I can use this to increment the number of employees in a given year.



let yearEmployeesData: YearEmployeesData[] = [ /* your array of YearEmployeesData objects */ ];

let targetYear = 2016;  // The year you're interested in

// Find the object for the target year
let targetYearObject = yearEmployeesData.find(data => data.year === targetYear);

if (targetYearObject) {
    // If the object exists, increment the employees count
    targetYearObject.employees += 1;
} else {
    // If the object doesn't exist, create a new one and set the employees count to 1
    yearEmployeesData.push({ year: targetYear, employees: 1 });
}

/*-----------------------------------------------------------------------------*/