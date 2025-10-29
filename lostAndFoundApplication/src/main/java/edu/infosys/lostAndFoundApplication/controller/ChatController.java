package edu.infosys.lostAndFoundApplication.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.infosys.lostAndFoundApplication.bean.ChatMessage;
import edu.infosys.lostAndFoundApplication.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3939")
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @GetMapping("/messages/{user1}/{user2}")
    public ResponseEntity<List<ChatMessage>> getMessages(
            @PathVariable String user1, 
            @PathVariable String user2) {
        List<ChatMessage> messages = chatService.getMessagesBetweenUsers(user1, user2);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage message) {
        ChatMessage savedMessage = chatService.sendMessage(message);
        return ResponseEntity.ok(savedMessage);
    }
    
    @GetMapping("/conversations/{username}")
    public ResponseEntity<List<String>> getUserConversations(@PathVariable String username) {
        List<String> conversations = chatService.getUserConversations(username);
        return ResponseEntity.ok(conversations);
    }
}
