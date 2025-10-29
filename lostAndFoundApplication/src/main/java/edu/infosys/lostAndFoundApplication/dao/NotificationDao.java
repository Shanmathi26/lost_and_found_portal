package edu.infosys.lostAndFoundApplication.dao;

import edu.infosys.lostAndFoundApplication.bean.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationDao extends JpaRepository<Notification, String> {
    @Query("SELECT n FROM Notification n WHERE n.username = ?1 ORDER BY n.timestamp DESC")
    List<Notification> findByUsernameOrderByTimestampDesc(String username);
}
