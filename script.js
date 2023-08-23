const employeeListContainer = document.querySelector(".employee-list");
const calendarContainer = document.querySelector(".grid");

const jobSections = ["MGR", "FLT", "HT", "PT", "CT", "CT"];

const employees = [
    { name: "Dylan", payRate: 15, totalHours: 40 },
    { name: "Travis", payRate: 20, totalHours: 30 },
    { name: "Thomas", payRate: 18, totalHours: 25 },
    { name: "Max", payRate: 22, totalHours: 35 },
    { name: "Alex", payRate: 16, totalHours: 28 },
    { name: "Rashad", payRate: 19, totalHours: 32 },
    { name: "Jack", payRate: 21, totalHours: 37 },
    { name: "Rashid", payRate: 17, totalHours: 29 },
    { name: "Daniel", payRate: 24, totalHours: 42 },
    { name: "Fernando", payRate: 23, totalHours: 38 },
    { name: "Tatem", payRate: 26, totalHours: 45 }
];

function generateEmployeeList() {
    for (const employee of employees) {
        const employeeElement = document.createElement("div");
        employeeElement.classList.add("employee");
        employeeElement.innerHTML = `
            <div class="employee-name">${employee.name}</div>
            <div class="employee-pay-rate">
                Pay Rate: $<span class="pay-rate" contenteditable>${employee.payRate}</span> / hr
            </div>
            <div class="employee-total-hours">Total Hours: ${employee.totalHours} hrs</div>
        `;
        employeeListContainer.appendChild(employeeElement);
    }
}

function generateWeeklyCalendar(startDate) {
    calendarContainer.innerHTML = '';

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + dayOffset);

        const cell = document.createElement("div");
        cell.classList.add("cell");
        const employeeSelectsHTML = generateEmployeeSelectsHTML(jobSections);
        cell.innerHTML = `
            <span class="day-number">${currentDate.getDate()}</span>
            <div class="employee-options">
                ${employeeSelectsHTML}
            </div>
        `;
        calendarContainer.appendChild(cell);
    }
}

function getNextSaturday(currentDate) {
    const nextSaturday = new Date(currentDate);
    nextSaturday.setDate(currentDate.getDate() + (6 - currentDate.getDay() + 7) % 7 + 1);
    return nextSaturday;
}

function updateScheduledHours(employee, day, section, hours) {
    const employeeIndex = parseInt(employee.replace("employee", ""));
    const dayIndex = parseInt(day) - 1;
    const sectionIndex = jobSections.indexOf(section);

    if (!isNaN(employeeIndex) && !isNaN(dayIndex) && sectionIndex !== -1) {
        employees[employeeIndex].schedule = employees[employeeIndex].schedule || {};
        employees[employeeIndex].schedule[dayIndex] = employees[employeeIndex].schedule[dayIndex] || {};
        employees[employeeIndex].schedule[dayIndex][sectionIndex] = hours;
    }
}

function showSectionCheckboxes(selectElement, selectedEmployee, dayNumber, jobSection) {
    const employeeIndex = parseInt(selectedEmployee.replace("employee", ""));
    const dayIndex = parseInt(dayNumber) - 1;
    const sectionIndex = jobSections.indexOf(jobSection);

    if (!isNaN(employeeIndex) && !isNaN(dayIndex) && sectionIndex !== -1) {
        const cell = selectElement.closest(".cell");
        const jobSectionElement = cell.querySelector(`.job-section[data-section="${sectionIndex}"]`);

        const checkboxesHTML = `
            <div class="section-checkboxes">
                <label><input type="checkbox" class="section-checkbox" value="FLT"> FLT</label>
                <label><input type="checkbox" class="section-checkbox" value="HT"> HT</label>
                <label><input type="checkbox" class="section-checkbox" value="PT"> PT</label>
                <label><input type="checkbox" class="section-checkbox" value="CT"> CT</label>
            </div>
        `;

        jobSectionElement.querySelector(".section-checkboxes").remove(); // Remove existing checkboxes
        jobSectionElement.insertAdjacentHTML("beforeend", checkboxesHTML);

        const sectionCheckboxes = jobSectionElement.querySelectorAll(".section-checkbox");
        sectionCheckboxes.forEach(checkbox => {
            checkbox.addEventListener("change", (event) => {
                const sectionValue = event.target.value;
                const isChecked = event.target.checked;
                updateScheduledSections(selectedEmployee, dayNumber, jobSection, sectionValue, isChecked);
            });
        });
    }
}

function showTimeInputs(selectElement, selectedEmployee, dayNumber, jobSection) {
    const employeeIndex = parseInt(selectedEmployee.replace("employee", ""));
    const dayIndex = parseInt(dayNumber) - 1;
    const sectionIndex = jobSections.indexOf(jobSection);

    if (!isNaN(employeeIndex) && !isNaN(dayIndex) && sectionIndex !== -1) {
        const cell = selectElement.closest(".cell");
        const jobSectionElement = cell.querySelector(`.job-section[data-section="${sectionIndex}"]`);
        
        const timeInputsHTML = `
            <div class="time-inputs">
                <input type="number" class="scheduled-hours" placeholder="Scheduled Hours">
            </div>
        `;

        // Remove existing time inputs before adding new ones
        jobSectionElement.querySelectorAll(".time-inputs").forEach(element => {
            element.remove();
        });

        jobSectionElement.insertAdjacentHTML("beforeend", timeInputsHTML);

        const scheduledHoursInput = jobSectionElement.querySelector(".scheduled-hours");
        scheduledHoursInput.addEventListener("change", (event) => {
            const hoursValue = event.target.value;
            updateScheduledHours(selectedEmployee, dayNumber, jobSection, hoursValue);
        });
    }
}

function updateScheduledSections(employee, day, section, sectionValue, isChecked) {
    const employeeIndex = parseInt(employee.replace("employee", ""));
    const dayIndex = parseInt(day) - 1;
    const sectionIndex = jobSections.indexOf(section);

    if (!isNaN(employeeIndex) && !isNaN(dayIndex) && sectionIndex !== -1) {
        employees[employeeIndex].schedule = employees[employeeIndex].schedule || {};
        employees[employeeIndex].schedule[dayIndex] = employees[employeeIndex].schedule[dayIndex] || {};
        employees[employeeIndex].schedule[dayIndex][sectionIndex] = employees[employeeIndex].schedule[dayIndex][sectionIndex] || {};
        employees[employeeIndex].schedule[dayIndex][sectionIndex][sectionValue] = isChecked;
    }
}

function generateEmployeeSelectsHTML(jobSections) {
    let selectsHTML = "";

    for (const section of jobSections) {
        const optionsHTML = generateEmployeeOptionsHTML(employees);
        selectsHTML += `
            <div class="job-section" data-section="${jobSections.indexOf(section)}">
                <span class="section-label">${section}</span>
                <select class="employee-list">
                    <option value="">Unassigned</option>
                    ${optionsHTML}
                </select>
            </div>
        `;
    }

    return selectsHTML;
}

function generateEmployeeOptionsHTML(employees) {
    let optionsHTML = "";
    for (let i = 0; i < employees.length; i++) {
        optionsHTML += `<option value="employee${i}">${employees[i].name}</option>`;
    }
    return optionsHTML;
}

generateEmployeeList();
generateWeeklyCalendar(new Date());
