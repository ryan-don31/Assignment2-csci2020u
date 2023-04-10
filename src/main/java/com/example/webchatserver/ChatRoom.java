package com.example.webchatserver;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This class represents the data you may need to store about a Chat room
 * You may add more method or attributes as needed
 * **/
public class ChatRoom {
    private String code; // roomID, tied to this instance of the room

    //each user has an unique ID associate to their ws session and their username
    private Map<String, String> users = new HashMap<String, String>(); // hash map of all users in the room, they each have a code and a username

    // when created the chat room has at least one user
    public ChatRoom(String code, String user){ // constructor, adding the first user to the room
        this.code = code;
        // when created the user has not entered their username yet
        this.users.put(user, "");
    }
    public void setCode(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public Map<String, String> getUsers() {
        return users;
    }

    /**
     * This method will add the new userID to the room if not exists, or it will add a new userID,name pair
     * **/
    public void setUserName(String userID, String name) { // this function could also be called add user
        // update the name
        if(users.containsKey(userID)){
            users.remove(userID);
            users.put(userID, name);
        }else{ // add new user
            users.put(userID, name);
        }
    }

    /**
     * This method will remove a user from this room
     * **/
    public void removeUser(String userID){
        if(users.containsKey(userID)){
            users.remove(userID);
        }
    }

    public boolean inRoom(String userID){
        return users.containsKey(userID);
    }
}
