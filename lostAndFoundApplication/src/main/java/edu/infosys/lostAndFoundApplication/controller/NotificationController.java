package edu.infosys.lostAndFoundApplication.controller;

import edu.infosys.lostAndFoundApplication.bean.Notification;
import edu.infosys.lostAndFoundApplication.dao.NotificationDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3939")
public class NotificationController {

    @Autowired
    private NotificationDao notificationDao;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Notification notification) {
        notification.setId(UUID.randomUUID().toString());
        notification.setTimestamp(new Date());
        notification.setRead(false);
        notificationDao.save(notification);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", notification.getId());
        response.put("status", "sent");
        response.put("timestamp", notification.getTimestamp());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String username) {
        List<Notification> notifications = notificationDao.findByUsernameOrderByTimestampDesc(username);
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable String id) {
        Optional<Notification> notification = notificationDao.findById(id);
        if (notification.isPresent()) {
            Notification n = notification.get();
            n.setRead(true);
            notificationDao.save(n);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("read", true);
        return ResponseEntity.ok(response);
    }
}
