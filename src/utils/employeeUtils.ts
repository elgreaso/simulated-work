//Generate a specified number of employees with random names and positions
export function generateEmployees(count: number) {
    const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Emily'];
    const positions = ['Software Engineer', 'Project Manager', 'Product Manager', 'Designer', 'Data Analyst', 'Tester'];
  
    let employees = [];
    for (let i = 0; i < count; i++) {
        employees.push({
            id: i + 1,
            name: names[Math.floor(Math.random() * names.length)],
            position: positions[Math.floor(Math.random() * positions.length)],
        });
    }
  
    return employees;
}
