const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


//let manager;
let teamName;
const teamMembers = [];

const managerQuestions = [
  {
    type: 'input',
    name: 'teamName',
    message: 'Welcome to Team Generator\n------------------------------------------------\n' + 'Please enter the name of the project/team:'
  },
  {
    type: 'input',
    name: 'managerName',
    message: "Please enter the project/team manager's name: "
  },
  {
    type: 'input',
    name: 'managerId',
    message: "Please enter manager's ID: "
  },
  {
    type: 'input',
    name: 'managerEmail',
    message: "Please enter manager's email: ",
    validate: function(email) {
      // Regex email check, returns true if valid email structure
      if (!(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/).test(email)) {
        return (`Not a valid email address.`);
      } else return true;
    }
  },
  {
    type: 'input',
    name: 'officeNum',
    message: "Please enter manager's office number: "
  }
];

const employeeQuestions = [
  {
    type: 'list',
    name: 'employeeRole',
    message: "Select employee's role: ",
    choices: ['Engineer', 'Intern']
  },
  {
    type: 'input',
    name: 'employeeName',
    message: "Please enter employee's name: "
  },
  {
    type: 'input',
    name: 'employeeId',
    message: "Please enter employee's ID: "
  },
  {
    type: 'input',
    name: 'employeeEmail',
    message: "Please enter employee's email: ",
    validate: function(email) {
      // Regex email check, returns true if valid email structure
      if (!(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/).test(email)) {
        return (`Not a valid email address.`);
      } else return true;
    }
  },
  {
    type: 'input',
    name: 'github',
    message: "Please enter employee's Github: ",
    validate: function(username) {
      // Regex username check, returns true if valid username
      if (!(/^[a-zA-Z0-9\-]+$/).test(username)) {
        return (`Not a valid username.`);
      } else return true;
    },
    when: (employeeAnswers) => employeeAnswers.employeeRole === 'Engineer'
  },
  {
    type: 'input',
    name: 'school',
    message: "Please enter intern's school: ",
    when: (employeeAnswers) => employeeAnswers.employeeRole === 'Intern'
  },
  {
    type: 'confirm',
    name: 'addEmployee',
    message: 'Need to add another team member? '
  }
];

const managerQuery = () => {
  inquirer
    .prompt(managerQuestions)
    .then(managerAnswers => {
      const manager = new Manager(managerAnswers.managerName, managerAnswers.managerId, managerAnswers.managerEmail, managerAnswers.officeNum);
      teamName = managerAnswers.teamName;
      teamMembers.push(manager);
      console.log('-----------------------------------------------');
      employeeQuery();
  });
}

const employeeQuery = () => {
  inquirer
    .prompt(employeeQuestions)
    .then(employeeAnswers => {
      if (employeeAnswers.employeeRole === 'Engineer') {
        const engineer = new Engineer(employeeAnswers.employeeName, employeeAnswers.employeeId, employeeAnswers.employeeEmail, employeeAnswers.github);
        teamMembers.push(engineer);
      } else {
        const intern = new Intern(employeeAnswers.employeeName, employeeAnswers.employeeId, employeeAnswers.employeeEmail, employeeAnswers.school);
        teamMembers.push(intern);
      }
      if (employeeAnswers.addEmployee === true) {
        console.log('-----------------------------------------------');
        employeeQuery();
      } else {
        console.log(teamMembers);
        generateHtml();
      }
  });
}

//const renderHTML = ()

const startQuestions = () => {
  managerQuery();
  console.log(teamMembers);
  console.log(teamMembers.length);
}

const generateHtml = () => {
  const outputPath = path.join(OUTPUT_DIR, 'team.html');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.writeFileSync(outputPath, render(teamMembers), (err) => {
    if (err) console.log(err);
    console.log('A team page has been created!');
  });
}

startQuestions();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
