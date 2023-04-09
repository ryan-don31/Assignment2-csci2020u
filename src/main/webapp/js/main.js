let ws;
let roomcode;

(function(){
    document.getElementById("createbutton").addEventListener('click',newRoom)
    document.getElementById("submit").addEventListener('click',send)
    document.getElementsByClassName("inputbox")[0].addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            send()
        }
    });
})()

function send(){
    var roomid = roomcode
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
        .then(response => enterRoom(response)); // enter the room with the code
}

function enterRoom(code){
    roomcode = code

    addRoomList(code)
    // refresh the list of rooms

    // create the web socket
    ws = new WebSocket("ws://localhost:8080/WSChatServer-1.0-SNAPSHOT/ws/"+code);

    // parse messages received from the server and update the UI accordingly
    ws.onmessage = function (event) {
        console.log("Recieved message: "+event.data);
        // parsing the server's message as json
        let message = JSON.parse(event.data);
        document.getElementById("textbox").value += "[" + timestamp() + "] " + message.message + "\n";
        // handle message
    }
}

function timestamp() {
    var d = new Date(), minutes = d.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    return d.getHours() + ':' + minutes;
}

function refreshRooms(){
    //
}

function addRoomList(code){
    var roomnum = String(code)
    var el = document.createElement('p')
    el.innerHTML = code
    el.className = roomnum
    var roomlist = document.getElementById('roomlist')
    roomlist.appendChild(el)
}