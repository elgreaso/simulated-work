PRAGMA foreign_keys = ON;

CREATE TABLE Employees (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    DOB INTEGER,
    FirstName TEXT,
    MiddleName TEXT,
    LastName TEXT,
    Email TEXT,
    StartDate INTEGER,
    EndDate INTEGER,
    EducationLevel TEXT,
    YearsExperience INTEGER,
    StreetAddress TEXT,
    City TEXT,
    State TEXT,
    ZipCode INTEGER,
    Country TEXT,
    CellNumber INTEGER,
    HomeNumber INTEGER,
    WorkNumber INTEGER,
    Sex TEXT,
    PositionID INTEGER,
    EmploymentType TEXT,
    SalaryID INTEGER,
    BranchID INTEGER,
    SupervisorID INTEGER
);

CREATE TABLE Departments (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    Budget INTEGER,
    HeadCount INTEGER,
    ManagerID INTEGER,
    FOREIGN KEY(ManagerID) REFERENCES Employees(ID)
);

CREATE TABLE Divisions (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    Budget INTEGER,
    HeadCount INTEGER,
    DepartmentID INTEGER,
    ManagerID INTEGER,
    FOREIGN KEY(DepartmentID) REFERENCES Departments(ID),
    FOREIGN KEY(ManagerID) REFERENCES Employees(ID)
);

CREATE TABLE Branches (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    Budget INTEGER,
    HeadCount INTEGER,
    Location TEXT,
    DivisionID INTEGER,
    ManagerID INTEGER,
    FOREIGN KEY(DivisionID) REFERENCES Divisions(ID),
    FOREIGN KEY(ManagerID) REFERENCES Employees(ID)
);

-- Create the Positions table, which contains all possible job positions and their specifics.
CREATE TABLE Positions (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    PreferredEducation TEXT,
    MinExperience INTEGER,
    DepartmentID INTEGER,
    SalaryStart INTEGER,
    SalaryEnd INTEGER,
    OTMultiplier INTEGER,
    FOREIGN KEY(DepartmentID) REFERENCES Departments(ID),
    FOREIGN KEY(SalaryStart) REFERENCES Salaries(ID),
    FOREIGN KEY(SalaryEnd) REFERENCES Salaries(ID)
);

-- Create the Responsibilities table, which contains all possible responsibilities.
CREATE TABLE Responsibilities (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    TimeRequired INTEGER,
    RequiredExperience INTEGER,
    Difficulty INTEGER
);

-- Create the many-to-many junction table for the Employees and Responsibilities tables.
CREATE TABLE EmployeeResponsibilities (
    EmployeeID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(EmployeeID, ResponsibilityID),
    FOREIGN KEY(EmployeeID) REFERENCES Employees(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

-- Create the many-to-many junction tables for the Positions, Branches, Divisions, and Departments tables.
CREATE TABLE PositionResponsibilities (
    PositionID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(PositionID, ResponsibilityID),
    FOREIGN KEY(PositionID) REFERENCES Positions(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

CREATE TABLE BranchResponsibilities (
    BranchID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(BranchID, ResponsibilityID),
    FOREIGN KEY(BranchID) REFERENCES Branches(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

CREATE TABLE DivisionResponsibilities (
    DivisionID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(DivisionID, ResponsibilityID),
    FOREIGN KEY(DivisionID) REFERENCES Divisions(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

CREATE TABLE DepartmentResponsibilities (
    DepartmentID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(DepartmentID, ResponsibilityID),
    FOREIGN KEY(DepartmentID) REFERENCES Departments(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

-- Create the Salaries table, which contains all possible pay grades, levels, and steps.
CREATE TABLE Salaries (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    PayGrade TEXT,
    Level INTEGER,
    Step INTEGER
    HourlyRate INTEGER,
    AnnualSalary INTEGER
);

CREATE TABLE Schedules (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER,
    StartDateTime TEXT,
    EndDateTime TEXT,
    ScheduleDescription TEXT,
    FOREIGN KEY(EmployeeID) REFERENCES Employees(ID)
);

CREATE TABLE GroupSchedules (
    GroupScheduleID INTEGER PRIMARY KEY AUTOINCREMENT,
    DepartmentID INTEGER,
    StartDateTime TEXT,
    EndDateTime TEXT,
    ScheduleDescription TEXT,
    FOREIGN KEY(DepartmentID) REFERENCES Departments(ID)
);

CREATE TABLE Procedures (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    ProcedureName TEXT,
    ProcedureDescription TEXT
);

CREATE TABLE EmployeeProcedures (
    EmployeeProcedureID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER,
    ProcedureID INTEGER,
    FOREIGN KEY(EmployeeID) REFERENCES Employees(ID),
    FOREIGN KEY(ProcedureID) REFERENCES Procedures(ID)
);

-- Add the foreign keys for the Employees table after all other tables are created.
ALTER TABLE Employees
    ADD FOREIGN KEY(PositionID) REFERENCES Positions(ID),
    ADD FOREIGN KEY(SalaryID) REFERENCES Salaries(ID),
    ADD FOREIGN KEY(BranchID) REFERENCES Branches(ID),
    ADD FOREIGN KEY(SupervisorID) REFERENCES Employees(ID);
