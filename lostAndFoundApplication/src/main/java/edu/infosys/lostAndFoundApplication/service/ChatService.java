package edu.infosys.lostAndFoundApplication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.lostAndFoundApplication.bean.ChatMessage;
import edu.infosys.lostAndFoundApplication.dao.ChatMessageRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    public List<ChatMessage> getMessagesBetweenUsers(String user1, String user2) {
        return chatMessageRepository.findMessagesBetweenUsers(user1, user2);
    }
    
    public ChatMessage sendMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        return chatMessageRepository.save(message);
    }
    
    public List<String> getUserConversations(String username) {
        return chatMessageRepository.findDistinctConversationPartners(username);
    }
}
