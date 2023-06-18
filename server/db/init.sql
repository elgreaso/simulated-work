PRAGMA foreign_keys = ON;

-- Contains all possible employee information.
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
    SupervisorID INTEGER,
    Status TEXT
);

-- Contains basic information for each department.
CREATE TABLE Departments (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    Budget INTEGER,
    HeadCount INTEGER,
    ManagerID INTEGER,
    FOREIGN KEY(ManagerID) REFERENCES Employees(ID)
);

-- Contains basic information for each division.
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

-- Contains basic information for each branch.
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

-- Contains all possible pay grades, levels, and steps.
CREATE TABLE Salaries (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    PayGrade TEXT,
    Level INTEGER,
    Step INTEGER,
    HourlyRate INTEGER,
    AnnualSalary INTEGER
);

-- Contains all possible job positions and their specifics, including pay info.
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

-- Contains all possible work categories.
-- i.e. "Clerical", "Management", "Technical", "Labor", etc.
CREATE TABLE ResponsibilityCategories (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT
);

-- Contains all possible responsibilities, for all employees, positions, departments, divisions, and branches.
-- i.e. "Answer phones", "Manage employees", "Manage budget", "Manage inventory", etc.
CREATE TABLE Responsibilities (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    Category INTEGER,
    Difficulty INTEGER,
    FOREIGN KEY(Category) REFERENCES ResponsibilityCategories(ID)
);

-- Junction table for the Employees and Responsibilities tables.
CREATE TABLE EmployeeResponsibilities (
    EmployeeID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(EmployeeID, ResponsibilityID),
    FOREIGN KEY(EmployeeID) REFERENCES Employees(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

-- Junction table for the Positions and Responsibilities tables.
CREATE TABLE PositionResponsibilities (
    PositionID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(PositionID, ResponsibilityID),
    FOREIGN KEY(PositionID) REFERENCES Positions(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

-- Junction table for the Departments and Responsibilities tables.
CREATE TABLE DepartmentResponsibilities (
    DepartmentID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(DepartmentID, ResponsibilityID),
    FOREIGN KEY(DepartmentID) REFERENCES Departments(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

-- Junction table for the Divisions and Responsibilities tables.
CREATE TABLE DivisionResponsibilities (
    DivisionID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(DivisionID, ResponsibilityID),
    FOREIGN KEY(DivisionID) REFERENCES Divisions(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

-- Junction table for the Branches and Responsibilities tables.
CREATE TABLE BranchResponsibilities (
    BranchID INTEGER,
    ResponsibilityID INTEGER,
    PRIMARY KEY(BranchID, ResponsibilityID),
    FOREIGN KEY(BranchID) REFERENCES Branches(ID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

-- Contains the individual tasks that make up each responsibility.
CREATE TABLE Tasks (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    ResponsibilityID INTEGER,
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID)
);

-- Contains all possible work statuses.
CREATE TABLE WorkStatuses (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT
);

-- Contains all work records for all employees.
CREATE TABLE WorkRecords (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    EmployeeID INTEGER,
    TaskID INTEGER,
    ResponsibilityCategoryID INTEGER,
    DatePerformed TEXT,
    Duration INTEGER,
    Status INTEGER,
    FOREIGN KEY(EmployeeID) REFERENCES Employees(ID),
    FOREIGN KEY(TaskID) REFERENCES Tasks(ID),
    FOREIGN KEY(ResponsibilityCategoryID) REFERENCES ResponsibilityCategories(ID),
    FOREIGN KEY(Status) REFERENCES WorkStatuses(ID)
);

-- Contains all possible requirements, for all employees, positions, departments, divisions, and branches.
CREATE TABLE Requirements (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    Type TEXT,
    Frequency INTEGER,
    ValidityPeriod INTEGER
);

-- Junction table for the Responsibilities and Requirements tables.
CREATE TABLE ResponsibilityRequirements (
    ResponsibilityID INTEGER,
    RequirementID INTEGER,
    PRIMARY KEY(ResponsibilityID, RequirementID),
    FOREIGN KEY(ResponsibilityID) REFERENCES Responsibilities(ID),
    FOREIGN KEY(RequirementID) REFERENCES Requirements(ID)
);

-- Contains identifying information for all buildings.
CREATE TABLE Buildings (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    Address TEXT,
    City TEXT,
    State TEXT,
    ZipCode TEXT,
    Country TEXT,    
    Latitude REAL,
    Longitude REAL
);

-- Junction table for the Departments and Buildings tables. Lists the buildings that each department occupies.
CREATE TABLE DepartmentBuildings (
    DepartmentID INTEGER,
    BuildingID INTEGER,
    PRIMARY KEY (DepartmentID, BuildingID),
    FOREIGN KEY(DepartmentID) REFERENCES Departments(ID),
    FOREIGN KEY(BuildingID) REFERENCES Buildings(ID)
);

-- Junction table for the Divisions and Buildings tables. Lists the buildings that each division occupies.
CREATE TABLE DivisionBuildings (
    DivisionID INTEGER,
    BuildingID INTEGER,
    PRIMARY KEY (DivisionID, BuildingID),
    FOREIGN KEY(DivisionID) REFERENCES Divisions(ID),
    FOREIGN KEY(BuildingID) REFERENCES Buildings(ID)
);

-- Junction table for the Branches and Buildings tables. Lists the buildings that each branch occupies.
CREATE TABLE BranchBuildings (
    BranchID INTEGER,
    BuildingID INTEGER,
    PRIMARY KEY (BranchID, BuildingID),
    FOREIGN KEY(BranchID) REFERENCES Branches(ID),
    FOREIGN KEY(BuildingID) REFERENCES Buildings(ID)
);

-- Contains all possible amenities.
CREATE TABLE Amenities (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT
);

-- Junction table for the Buildings and Amenities tables. Lists all amenities for each building.
CREATE TABLE BuildingAmenities (
    BuildingID INTEGER,
    AmenityID INTEGER,
    PRIMARY KEY (BuildingID, AmenityID),
    FOREIGN KEY (BuildingID) REFERENCES Buildings(ID),
    FOREIGN KEY (AmenityID) REFERENCES Amenities(ID)
);

-- Junction table for the Branches and Amenities tables. Lists all required amenities for each branch.
CREATE TABLE BranchAmenities (
    BranchID INTEGER,
    AmenityID INTEGER,
    PRIMARY KEY (BranchID, AmenityID),
    FOREIGN KEY (BranchID) REFERENCES Branches(ID),
    FOREIGN KEY (AmenityID) REFERENCES Amenities(ID)
);

CREATE TABLE Equipment (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT,
    Description TEXT,
    Type TEXT,
    Manufacturer TEXT,
    Model TEXT,
    PurchaseDate INTEGER,
    PurchasePrice REAL
);

-- Rename the old table
ALTER TABLE Employees RENAME TO temp_Employees;

-- Contains all possible employee information.
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
    SupervisorID INTEGER,
    Status TEXT,
    FOREIGN KEY(PositionID) REFERENCES Positions(ID),
    FOREIGN KEY(SalaryID) REFERENCES Salaries(ID),
    FOREIGN KEY(BranchID) REFERENCES Branches(ID),
    FOREIGN KEY(SupervisorID) REFERENCES Employees(ID)
);

-- -- Copy records from the old table to the new one
-- INSERT INTO new_table SELECT * FROM temp_old_table;

-- Drop the old table
DROP TABLE temp_Employees;


