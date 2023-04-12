package com.example.webchatserver;


import com.fasterxml.jackson.annotation.JsonAnyGetter;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

/**
 * This class represents a web socket server, a new connection is created and it receives a roomID as a parameter
 * **/
@ServerEndpoint(value="/ws/{roomID}")
public class ChatServer {
    // contains a static List of ChatRoom used to control the existing rooms and their users

    private static Map<String,ChatRoom> roomlist = new HashMap<>();
    // you may add other attributes as you see fit

    @OnOpen
    public void open(@PathParam("roomID") String roomID, Session session) throws IOException, EncodeException {

        String userId = session.getId();
        ChatRoom currentRoom = roomlist.get(roomID);

        if(roomlist.containsKey(roomID)){
            roomlist.get(roomID).setUserName(session.getId(), "");
        }else{
            roomlist.put(roomID,new ChatRoom(roomID,session.getId()));
        }

        session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server "+roomID+"): Welcome to the chat room. Please state your username to begin.\"}");
    }

    @OnClose
    public void close(Session session, @PathParam("roomID") String roomID) throws IOException, EncodeException { //this gets called when the tab is closed, i.e the session ends
        String userId = session.getId();
        ChatRoom room = roomlist.get(roomID);
        ChatRoom currentRoom = roomlist.get(roomID);
        String username = currentRoom.getUsers().get(userId);

        room.removeUser(userId);
        if(room.getUsers().isEmpty()){
            roomlist.remove(roomID);
        }

        for (Session peer : session.getOpenSessions()){ //broadcast this person left the server
            if(currentRoom.inRoom(peer.getId())) { // broadcast only to those in the same room
                peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): " + username + " left the chat room.\"}");
            }
        }
        // do things for when the connection closes
    }

    @OnMessage
    public void handleMessage(String comm, Session session, @PathParam("roomID") String roomID) throws IOException, EncodeException {
        //possible cases:
        //first message = set their user name to the message
        //messages after = normal message

        String userId = session.getId(); // userid of current user
        JSONObject commjson = new JSONObject(comm); // json from message sent from javascript
        String message = (String) commjson.get("msg"); // message being sent
        ChatRoom currentRoom = roomlist.get(roomID); // current room as object

        Map<String,String> userList = currentRoom.getUsers(); // hashmap of all users in current room

        if(userList.get(userId) != ""){// not their first message, the userid exists within the chatroom object with the userid
            String username = userList.get(userId);

            for(Session peer : session.getOpenSessions()){
                if(currentRoom.inRoom(peer.getId())){
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(" + username + "): " + message + "\"}");
                }
            }
        }else{//is their first message
            currentRoom.setUserName(session.getId(),message);
            session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server "+roomID+"): Welcome, " + message + "!\"}");

            for(Session peer: session.getOpenSessions()){
                // only announce to those in the same room as me, excluding myself
                if((!peer.getId().equals(userId))&&(currentRoom.inRoom(peer.getId()))){
                    peer.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server): " + message + " joined the chat room.\"}");
                }
            }
        }
    }
}