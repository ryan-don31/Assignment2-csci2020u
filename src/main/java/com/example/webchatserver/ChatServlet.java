package com.example.webchatserver;

import java.io.*;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import jakarta.websocket.server.PathParam;
import org.apache.commons.lang3.RandomStringUtils;

/**
 * This is a class that has services
 * In our case, we are using this to generate unique room IDs**/
@WebServlet(name = "chatServlet", value = {"/chat-servlet","/chat-servlet/rooms"})
public class ChatServlet extends HttpServlet {
    private String message;

    //static so this set is unique
    public static Set<String> rooms = new HashSet<>();

    /**
     * Method generates unique room codes
     * **/
    public String generatingRandomUpperAlphanumericString(int length) {
        String generatedString = RandomStringUtils.randomAlphanumeric(length).toUpperCase();
        // generating unique room code
        while (rooms.contains(generatedString)){
            generatedString = RandomStringUtils.randomAlphanumeric(length).toUpperCase();
        }
        rooms.add(generatedString);

        return generatedString;
    }

    private String getRooms(){
        String resp = "{\"rooms\": [";
        var i = 0;
        for (String room : rooms) {
            resp += ("\"" + room + "\"");
            if (i < rooms.size() - 1) {
                resp += ",";
            }
            i++;
        }
        resp += "]}";
        return resp;
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getServletPath();

        // regular endpoint returns a random code to the user, for the newest room created
        if (pathInfo == null || pathInfo.equals("/") || pathInfo.equals("/chat-servlet")) {
            response.setContentType("text/plain");
            // send the random code as the response's content
            PrintWriter out = response.getWriter();
            out.println(generatingRandomUpperAlphanumericString(5));

        //endpoint containing "/rooms" returns a json object of a list of all existing rooms
        } else if (pathInfo.equals("/chat-servlet/rooms")) {
            response.setContentType("application/json");
            // send the random code as the response's content
            PrintWriter out = response.getWriter();
            out.println(getRooms());
        }
    }

    public void destroy() {
    }
}