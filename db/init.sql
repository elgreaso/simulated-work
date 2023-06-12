PRAGMA foreign_keys = ON;

CREATE TABLE Employees (
    EmployeeID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName TEXT,
    LastName TEXT,
    Email TEXT,
    HireDate TEXT,
    PositionID INTEGER,
    DepartmentID INTEGER,
    SupervisorID INTEGER
);

CREATE TABLE Departments (
    DepartmentID INTEGER PRIMARY KEY AUTOINCREMENT,
    DepartmentName TEXT,
    DepartmentHead INTEGER,
    FOREIGN KEY(DepartmentHead) REFERENCES Employees(EmployeeID)
);

CREATE TABLE Positions (
    PositionID INTEGER PRIMARY KEY AUTOINCREMENT,
    PositionName TEXT,
    PositionDescription TEXT
);

CREATE TABLE Schedules (
    ScheduleID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER,
    StartDateTime TEXT,
    EndDateTime TEXT,
    ScheduleDescription TEXT,
    FOREIGN KEY(EmployeeID) REFERENCES Employees(EmployeeID)
);

CREATE TABLE GroupSchedules (
    GroupScheduleID INTEGER PRIMARY KEY AUTOINCREMENT,
    DepartmentID INTEGER,
    StartDateTime TEXT,
    EndDateTime TEXT,
    ScheduleDescription TEXT,
    FOREIGN KEY(DepartmentID) REFERENCES Departments(DepartmentID)
);

CREATE TABLE Procedures (
    ProcedureID INTEGER PRIMARY KEY AUTOINCREMENT,
    ProcedureName TEXT,
    ProcedureDescription TEXT
);

CREATE TABLE EmployeeProcedures (
    EmployeeProcedureID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER,
    ProcedureID INTEGER,
    FOREIGN KEY(EmployeeID) REFERENCES Employees(EmployeeID),
    FOREIGN KEY(ProcedureID) REFERENCES Procedures(ProcedureID)
);

-- Add the foreign keys for the Employees table after all other tables are created.
ALTER TABLE Employees
    ADD FOREIGN KEY(PositionID) REFERENCES Positions(PositionID),
    ADD FOREIGN KEY(DepartmentID) REFERENCES Departments(DepartmentID),
    ADD FOREIGN KEY(SupervisorID) REFERENCES Employees(EmployeeID);
