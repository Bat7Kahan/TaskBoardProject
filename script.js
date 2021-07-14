//localStorage.clear();
let tasks = [];
showTasksOnPage();//will show tasks that are in local storage - if there are any


//adds task to local storage and checks validation
function addTask() {
    let text = document.getElementById("inptTxt").value;
    let date = document.getElementById("inptDate").value;
    let time = document.getElementById("inptTime").value;

    //validation checks 
    // I didn't put in a submit button to check required feilds because in that case if there was a date missing the text in the text area would have been earased,
    //and I wanted the text to stay even in a case that there was not date - to give user chance to put in a date without loosing text
    
    //date and text are required
    if (!text) {
        alert('Task text should not be empty - Please enter text');
    }
    else if (!date) {
        alert('Date must be supplied - please enter date');
    }
    //checks date and time have not passed
    else if (!checkDate(date, time)) {
        alert('Date and/or time supplied has past - Please enter a new date or time');
        document.getElementById("inptDate").value = null;
        document.getElementById("inptTime").value = null;
    }
    else {
        let tempTask = new Task(text, date, time);
        //if the array is empty the first id will be one if it is not then it will put one larger then the last id
        if (tasks.length > 0) {
            tempTask.id = Number(tasks[tasks.length - 1].id + 1);
        }
        else {
            tempTask.id = Number(1);
        }
        //adds new task to local storage
        tasks.push(tempTask);
        localStorage.tasks = JSON.stringify(tasks);
        showTasksOnPage();
    }

}

//deletes task from local storage and from html page
function deleteTask(id) {
    let Note = document.getElementById(id); 
    //removes note from page
    document.getElementById("shoeNotesFromLS").removeChild(Note); 
    let indexOfTaskToRemove = tasks.findIndex(task => task.id === id);
    //removes from array of tasks
    tasks.splice(indexOfTaskToRemove, 1);
    //removes from array in local storage
    if (tasks.length != 0) {
        localStorage.tasks = JSON.stringify(tasks);
    }
    else {
        localStorage.removeItem("tasks");
    }
    
}


//adds html to page to show notes with tasks
function showTasksOnPage() {
    //clears notes that exist- if there are any
    document.getElementById("shoeNotesFromLS").innerHTML = "";
    if (localStorage.tasks) {
        tasks = JSON.parse(localStorage.tasks);
        for (let task of tasks){
            //the following DOM commands create all the HTML elements taht appear on each note
            let divOfTask = document.createElement("div");
            //(I put the button in a div so that I will be able to do float:right and the X will apear on the top right corner of the note)
            let divOfButton = document.createElement("div");
            let button = document.createElement("input");
            let POfText = document.createElement("p");
            let DivOfDate = document.createElement("div");
            let DivOfTime = document.createElement("div");

            //the following DOM commands create attributes, set there values and add them to the elements created above
            //creates id attribute for each note - the id of each note is the same id of the task (set when adding a new task to array of tasks)
            let attrIDOfNote = document.createAttribute("id");
            attrIDOfNote.value = task.id;
            divOfTask.setAttributeNode(attrIDOfNote);
            
            let classAttribute = document.createAttribute("class");
            classAttribute.value = "col-sm-12 col-lg-3 card myNote";
            divOfTask.setAttributeNode(classAttribute);

            let attr = document.createAttribute("class");
            attr.value = "card-body text-center myText";
            POfText.setAttributeNode(attr);


            let ClassType = document.createAttribute("type");
            ClassType.value = "button";
            let ClassValue = document.createAttribute("class");
            ClassValue.value = "myButton";
            let attrValue = document.createAttribute("value");
            attrValue.value = "X";
            button.setAttributeNode(ClassType);
            button.setAttributeNode(ClassValue);
            button.setAttributeNode(attrValue);
            button.addEventListener("click",function(){
                deleteTask(task.id)
            });
            POfText.innerText = task.text;
            DivOfDate.innerText = task.date;
            DivOfTime.innerText = task.time;
            divOfButton.append(button);
            divOfTask.append(divOfButton, POfText, DivOfDate, DivOfTime);
            document.getElementById("shoeNotesFromLS").appendChild(divOfTask);
        }
    }
}

//checks that date and time supplied had not past
//returns true if the date is valid- the date and time are in the future
//and false if the date and time are in the past
////in order to allow to put in todays date as well - added the time of the end of the day to the date supplied (if time was not supplied)
function checkDate(date, time) {
    let inputDate = new Date(date);
    if (time) {
        let hours = time.slice(0, 2);
        let minutes = time.slice(3, 5);
        inputDate.setHours(hours);
        inputDate.setMinutes(minutes);
        inputDate.setSeconds(99);
    }
    else {
        inputDate.setHours(23);
        inputDate.setMinutes(59);
        inputDate.setSeconds(99);
    }
    //gets current date and time to compare against
    let today = new Date();

    if (inputDate < today) {
        return false;
    }
    return true;
}