let addbtn=document.querySelector(".add-btn");
let removebtn=document.querySelector(".remove-btn");

let modalCont=document.querySelector(".modal-cont");
let mainCont=document.querySelector(".main-cont");
let textareaCont=document.querySelector(".textarea-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");

let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length-1];

let addFlag=false;
let removeFlag=false;

let lockClass = "fa-lock";
let unlockClass= "fa-lock-open";

let ticketArr=[];

if(localStorage.getItem("jira_tickets")){
    // Retrieve and display
    ticketArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}

for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })
        // Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0; i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }
        // Displaynew filtered tickets
        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
    toolBoxColors[i].addEventListener("dblclick", (e) => {
        // Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0; i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        ticketArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
}

// Listener for modal priority coloring
allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    })
})

addbtn.addEventListener("click",(e)=>{
    //Display Modal
    //Generate Ticket

    //Add flag, true-> Modal Display
    //Add flag, false-> Modal None
    addFlag=!addFlag;
    if(addFlag){
        modalCont.style.display="flex";
    }
    else{
        modalCont.style.display="none";
    }
})

removebtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
    console.log(removeFlag);
})


modalCont.addEventListener("keydown", (e)=>{
    let key=e.key;
    if(key === "Shift"){
        createTicket(modalPriorityColor,textareaCont.value);
        addFlag=false;
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketTask, ticketID){
    let id= ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    ticketCont.innerHTML=`
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div spellcheck="false" class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fas fa-lock"></i>
    </div>
    `;
    mainCont.appendChild(ticketCont);

    // Create object of ticket and add to array
    if(!ticketID) {
    ticketArr.push({ticketColor, ticketTask, ticketID: id});
    localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    }
    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}

function handleRemoval(ticket, id) {
    // removalFlag -> true -> remove
    ticket.addEventListener("click", (e) => {
        if(!removeFlag) return;
        let idx = getTicketIdx(id);
        ticketArr.splice(idx, 1);
        let strTicketsArr = JSON.stringify(ticketArr);
        localStorage.setItem("jira_tickets", strTicketsArr);
        ticket.remove();
    })
    
}

function handleLock(ticket, id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click",(e) => {
        // get idx
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable","true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
        }

        // modify locks
        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    })
}

function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        // Get idx of the current ticket
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
        //Get ticket color idx
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx%colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        // Modify color in local storage
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    })
}

function getTicketIdx(id){
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}

function setModalToDefault() {
    modalCont.style.display="none";
    textareaCont.value="";
    modalPriorityColor = colors[colors.length-1];
    allPriorityColors.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border");
}