export {};

// /**
//  * To use, from the command line, run:
//  * 
//  * .\tsc generateLUTs.ts
//  * node generateLUTs.js
//  *  
//  * This will create the LUT files at your current directory.
//  */

// const fs = require('fs');

// class WeightedRandomSelector {
//     private aliasTable: { alias: number; prob: number }[];
//     private outcomes: string[];
  
//     constructor(data: Array<any[]>, weightIndex: number, outcomeIndex: number) {
//       const weights = data.map((item) => item[weightIndex]);
//       this.outcomes = data.map((item) => item[outcomeIndex]);
//       this.aliasTable = this.buildAliasTable(weights);
//     }
  
//     buildAliasTable(weights: number[]): { alias: number; prob: number }[] {
//       const sum = weights.reduce((acc, val) => acc + val, 0);
//       const normalizedWeights = weights.map((weight) => (weight * weights.length) / sum);
  
//       const lessThanOne: number[] = [];
//       const greaterThanOne: number[] = [];
//       const aliasTable: { alias: number; prob: number }[] = [];
  
//       normalizedWeights.forEach((weight, index) => {
//         if (weight < 1) {
//           lessThanOne.push(index);
//         } else {
//           greaterThanOne.push(index);
//         }
//       });
  
//       while (lessThanOne.length && greaterThanOne.length) {
//         const small = lessThanOne.pop() as number;
//         const large = greaterThanOne.pop() as number;
  
//         aliasTable[small] = { alias: large, prob: normalizedWeights[small] };
//         normalizedWeights[large] = normalizedWeights[large] + normalizedWeights[small] - 1;
//         if (normalizedWeights[large] < 1) {
//           lessThanOne.push(large);
//         } else {
//           greaterThanOne.push(large);
//         }
//       }
  
//       while (greaterThanOne.length) {
//         const large = greaterThanOne.pop() as number;
//         aliasTable[large] = { alias: large, prob: 1 };
//       }
  
//       while (lessThanOne.length) {
//         const small = lessThanOne.pop() as number;
//         aliasTable[small] = { alias: small, prob: 1 };
//       }
  
//       return aliasTable;
//     }

//     getLookupTables() {
//       return {
//         outcomes: this.outcomes,
//         aliasTable: this.aliasTable
//       };
//     }
// }

// // Load and parse JSON data from a file
// const loadJsonData = (filePath: string) => {
//   try {
//       return require(filePath);
//   } catch (error) {
//       console.error(`Failed to load JSON data from file: ${filePath}`);
//       throw error;
//   }
// };

// // Build lookup tables for each unique year in the provided data
// const buildLookupTablesByYear = (data: any[], yearIndex: number, weightIndex: number, outcomeIndex: number) => {
//   const uniqueYears: number[] = Array.from(new Set(data.map((item: any[]) => item[yearIndex])));
//   const dataByYear: { [key: number]: any[] } = {};
//   const lutByYear: { [key: number]: any } = {};

//   uniqueYears.forEach((year: number) => {
//       dataByYear[year] = data.filter((item: any[]) => item[yearIndex] === year);
//   });

//   for (let year in dataByYear) {
//       const weightedRandomSelector = new WeightedRandomSelector(dataByYear[year], weightIndex, outcomeIndex);
//       lutByYear[year] = weightedRandomSelector.getLookupTables();
//   }

//   return lutByYear;
// };

// // Write data to a JSON file
// const writeJsonToFile = (filename: string, data: any) => {
//   fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
// };

// const generateFirstNameLUT = (dataFile: string, yearIndex: number, weightIndex: number, outcomeIndex: number, outputFilename: string) => {
//   const data = loadJsonData(dataFile);
//   const lutByYear = buildLookupTablesByYear(data, yearIndex, weightIndex, outcomeIndex);
//   writeJsonToFile(outputFilename, lutByYear);
// }

// let yearIndex = 0;
// let weightIndex = 2;
// let outcomeIndex = 1;
// var dataFile = './data/firstNameM.json';
// generateFirstNameLUT(dataFile, yearIndex, weightIndex, outcomeIndex, 'firstNameMLUT.json');
// var dataFile = './data/firstNameF.json';
// generateFirstNameLUT(dataFile, yearIndex, weightIndex, outcomeIndex, 'firstNameFLUT.json');