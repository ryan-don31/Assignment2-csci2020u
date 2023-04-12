# Clash of Clans Chat Room

This is a group assignment for our Software Systems Development & Integration (CSCI2020U) class at Ontario Tech University. We were tasked to create a text chat application that allows multiple users to create and join chatrooms where they can send messages to each other.

Upon opening the application, users will have the option to create a join a new room. Once rooms are created, users then can join them by clicking the respective room ID, displayed in the UI. 

Once a room is joined, the user is prompted to enter a username, which will broadcast a message of their arrival to all other members in the room. Similarly, users leaving will send a message that they left.
***
## Improvements:

We improved the interface by making it resemble the chat feature in the mobile game, "Clash of Clans" (see below). We also decided to make user and server messages distinguished from one another through highlighting server messages in green.

A custom font was downloaded into the project (included in the style directory) which serves to resemble that of clash of clans. 

We took the liberty of opting out of making the messages placed in a textarea object, and created a separate container for each with custom styling and borders. This, again, was done to resemble the look of the clash of clans chat.

The currently joined room is also now displayed at the top of the screen, which we thought to be much more reminiscent of a real world chat room.
<div style="display: inline-block">
<img src="https://static.wikia.nocookie.net/clashofclans/images/3/3b/Global_Chat.jpeg/revision/latest?cb=20210826204103" style="width:400px">
<img src="https://github.com/ryan-don31/Assignment2-csci2020u/blob/main/readme-pics/demopic1.PNG" style="width:400px">
</div>
<img src="https://github.com/ryan-don31/Assignment2-csci2020u/blob/main/readme-pics/demopic2.PNG" style="width:800px">
  
***
## How to Run:

First, clone the repository (submitted and linked) using the command `git clone https://github.com/ryan-don31/Assignment2-csci2020u` into your directory of choice

Next, open up the cloned repository in any IDE that can be configured with Jakarta EE application server software. For the sake of troubleshooting, this project was primarily tested and developed in Intellij Ultimate IDEA

Once the repository is cloned and opened in an IDE, you will need to set up the server. Glassfish is required to run this project (see glassfish setup instructions below)
<ul>
  <li>Click the Edit Configuration button at the top of your screen, near the run button</li>
<li>Hit the '+' button, and then select Glassfish -> Local</li>
<li>After adding the server, make sure to select the domain (default/domain1 should work just fine)</li>
<li>Then make sure to setup your artifact as 'war:exploded'</li>
<li>Apply and okay the settings.</li>
</ul>
Run Glassfish, and the chatroom will open!

***
## Other resources:

We decided not to use any external libraries or dependencies for this project. All graphics seen were designed to resemble clash of clans as closely as possible, however they were made from scratch.

Clash of Clans font: https://upfonts.com/you-blockhead-font/
