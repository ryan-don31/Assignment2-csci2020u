package com.example.webchatserver;


import com.fasterxml.jackson.annotation.JsonAnyGetter;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
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
    //private static Map<>
    // you may add other attributes as you see fit

    @GET
    @Path('/roomlist')
    @Produces('application/json')
    public void getRooms(){

    }

    @OnOpen
    public void open(@PathParam("roomID") String roomID, Session session) throws IOException, EncodeException {
//        accessing the roomID parameter
        System.out.println(roomID);
        roomlist.put(roomID,new ChatRoom(roomID,session.getId()));
        //roomList.put(session.getId(), roomID); // adding userID to a room
//        // loading the history chat
//        String history = loadChatRoomHistory(roomID);
//        System.out.println("Room joined ");
//        if (history!=null && !(history.isBlank())){
//            System.out.println(history);
//            history = history.replaceAll(System.lineSeparator(), "\\\n");
//            System.out.println(history);
//            session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\""+history+" \\n Chat room history loaded\"}");
//            roomHistoryList.put(roomID, history+" \\n "+roomID + " room resumed.");
//        }
//        if(!roomHistoryList.containsKey(roomID)) { // only if this room has no history yet
//            roomHistoryList.put(roomID, roomID + " room Created."); //initiating the room history
//        }
        session.getBasicRemote().sendText("{\"type\": \"chat\", \"message\":\"(Server "+roomID+"): Welcome to the chat room. Please state your username to begin.\"}");
    }

    @OnClose
    public void close(Session session) throws IOException, EncodeException {
        String userId = session.getId();
        // do things for when the connection closes
    }

    @OnMessage
    public void handleMessage(String comm, Session session, @PathParam("roomID") String roomID) throws IOException, EncodeException {
        //possible cases:
        //first message = set message to their user name
        //

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
        }else{
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