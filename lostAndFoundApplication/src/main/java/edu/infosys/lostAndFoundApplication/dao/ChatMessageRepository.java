package edu.infosys.lostAndFoundApplication.dao;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.infosys.lostAndFoundApplication.bean.ChatMessage;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT c FROM ChatMessage c WHERE " +
           "(c.senderUsername = :user1 AND c.receiverUsername = :user2) OR " +
           "(c.senderUsername = :user2 AND c.receiverUsername = :user1) " +
           "ORDER BY c.timestamp ASC")
    List<ChatMessage> findMessagesBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);
    
    @Query("SELECT DISTINCT CASE " +
           "WHEN c.senderUsername = :username THEN c.receiverUsername " +
           "ELSE c.senderUsername END " +
           "FROM ChatMessage c WHERE c.senderUsername = :username OR c.receiverUsername = :username")
    List<String> findDistinctConversationPartners(@Param("username") String username);
}
