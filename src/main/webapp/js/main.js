let ws;//global web socket currently connected to
let roomCode;//global variable for current room the user is in

(function(){//set event listeners at inception
    document.getElementById("createbutton").addEventListener('click',newRoom)
    document.getElementById("submit").addEventListener('click',send)
    document.getElementById("refresh").addEventListener('click',refreshRooms)
    document.getElementsByClassName("inputbox")[0].addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            send()
        }
    });
    refreshRooms()
})()

//for sending a message
function send(){
    //package typed message in a json variable and send
    var text = document.getElementsByClassName("inputbox")[0].value
    let request = {"type":"chat", "msg":text}
    console.log("sending message: "+request)
    ws.send(JSON.stringify(request));

    //clear input box
    document.getElementsByClassName("inputbox")[0].value = "";
}

//creating a new room
function newRoom(){
    // calling the ChatServlet to retrieve a new room ID
    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/chat-servlet";
    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain',
        }
    })
    .then(response => response.text())
    .then(response => {
        refreshRooms()// refresh the list of rooms
        enterRoom(response)//enter the new room
    })
}

//joining an existing room
function roomClick(event){
    /*this function seems very small, however we realized it would be easier to just call the enterRoom function
     based on what the user clicked, since they will be clicking on a room ID*/
    enterRoom(event.target.innerHTML)
}

//entering a room, called both when joining and creating a room
function enterRoom(code){
    roomCode = code //set global variable for current room
    console.log("Room code is: " + code)
    if(ws != null){
        console.log("Closed socket")
        ws.close()
    }

    ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/"+code); //join web socket with roomID as the endpoint

    // parse messages received from the server and update the UI accordingly
    ws.onmessage = function (event) {
        console.log("Recieved message: " + event.data);
        // parsing the server's message as json
        let message = JSON.parse(event.data);

        if(message.message.includes("Server")){//server message (welcome to room; x has joined, x has left)
            let servermessage = document.createElement('div')
            servermessage.innerHTML = "<h3>" + "[" + timestamp() + "] " + message.message + "</h3>"
            servermessage.classList.add("serverbox")
            document.getElementById("textarea").prepend(servermessage)
        }else{//normal user message
            let usermessage = document.createElement('div')
            usermessage.innerHTML = "<h3>" + "[" + timestamp() + "] " + message.message + "</h3>"
            usermessage.classList.add("textbox")
            document.getElementById("textarea").prepend(usermessage)
        }
        refreshRooms()
    }
}

//get current time to be displayed on messages
function timestamp() {
    var d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getHours() + ':' + minutes;
}

//refresh list of existing rooms, and update indicator for current joined room
function refreshRooms(){
    // get roomlist from api
    // repopulate list on screen
    var listcontainer = document.getElementById('roomlist')
    listcontainer.innerHTML = ""

    // call from endpoint we added to servlet to get list of all existing rooms
    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/chat-servlet/rooms";
    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(response => {
        // populate table with rooms
        rooms = response.rooms
        for(let room of rooms){
            var li = document.createElement('li')
            var a = document.createElement('a')
            a.innerHTML = room
            a.href = "#" // added an href to give the rooms that link appearance that can be seen in the assignment preview
            a.addEventListener('click',roomClick)
            li.appendChild(a)
            listcontainer.appendChild(li)
        }

    })
    .catch(err => console.log(err))
    if(roomCode){
        document.getElementById("currentroom").innerHTML = roomCode
    }
}