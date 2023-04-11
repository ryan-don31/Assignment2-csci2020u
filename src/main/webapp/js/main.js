let ws;
let roomCode;

(function(){
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

function send(){
    var text = document.getElementsByClassName("inputbox")[0].value
    let request = {"type":"chat", "msg":text}
    console.log("sending message: "+request)
    ws.send(JSON.stringify(request));
    document.getElementsByClassName("inputbox")[0].value = "";
}

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
        refreshRooms()
        // refresh the list of rooms
        enterRoom(response)
    })
}

function roomClick(event){
    enterRoom(event.target.innerHTML)
}

function enterRoom(code){
    roomCode = code
    console.log("Room code is: " + code)
    if(ws != null){
        console.log("Closed socket")
        ws.close()
    }

    ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/"+code);

    // parse messages received from the server and update the UI accordingly
    ws.onmessage = function (event) {
        console.log("Recieved message: " + event.data);
        // parsing the server's message as json
        let message = JSON.parse(event.data);

        if(message.message.includes("Server")){//server message (welcome to room, x has joined, x has left)
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
        //div element, width 100%, static height, border on top and bottom
            //each div has the following format:
            // Name [time] \n
            // message
        // document.getElementById("textbox").value += "[" + timestamp() + "] " + message.message + "\n";
    }
}

function timestamp() {
    var d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getHours() + ':' + minutes;
}

//THIS WILL CALL FROM ROOMSERVLET
function refreshRooms(){
    console.log(roomCode)
    // get roomlist from api
    // repopulate list on screen
    var listcontainer = document.getElementById('roomlist')
    listcontainer.innerHTML = ""

    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/chat-servlet/rooms";
    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(response => {
        rooms = response.rooms
        for(let room of rooms){
            var li = document.createElement('li')
            var a = document.createElement('a')
            a.innerHTML = room
            a.href = "#"
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