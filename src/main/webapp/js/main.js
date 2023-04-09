let ws;

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
        },
    })
        .then(response => response.text())
        .then(response => {
            refreshRooms()
            // refresh the list of rooms

            // create the web socket
            ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/"+response);

            // parse messages received from the server and update the UI accordingly
            ws.onmessage = function (event) {
                console.log("Recieved message: "+event.data);
                // parsing the server's message as json
                let message = JSON.parse(event.data);
                document.getElementById("textbox").value += "[" + timestamp() + "] " + message.message + "\n";
                // handle message
            }
        })
        .then(response => enterRoom(response)); // enter the room with the code
}

function enterRoom(code){
    console.log("ENTER ROOM CALLED")
}

function timestamp() {
    var d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getHours() + ':' + minutes;
}

//THIS WILL CALL FROM ROOMSERVLET
function refreshRooms(){
    // get roomlist from api
    // repopulate list on screen
    var listcontainer = document.getElementById('roomlist')
    listcontainer.innerHTML = ""

    let callURL= "http://localhost:8080/WSChatServer-1.0-SNAPSHOT/chat-servlet/rooms";
    fetch(callURL, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(response => response.json())
    .then(response => {
        rooms = response.rooms
        for(let room of rooms){
            var li = document.createElement('li')
            li.innerHTML = room
            li.addEventListener('click',function() {
                enterRoom(room)
            })
            listcontainer.appendChild(li)
        }

    })
    .catch(err => console.log(err))
}