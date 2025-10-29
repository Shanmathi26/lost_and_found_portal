package edu.infosys.lostAndFoundApplication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import edu.infosys.lostAndFoundApplication.bean.Notification;
import edu.infosys.lostAndFoundApplication.dao.NotificationDao;
import java.util.*;

@Service
public class MatchService {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private NotificationDao notificationDao;

    public List<Map<String, Object>> findMatches(Map<String, Object> foundItem) {
        System.out.println("=== MATCHING DEBUG ===");
        System.out.println("Found item: " + foundItem);
        
        List<Map<String, Object>> matches = new ArrayList<>();
        
        try {
            String sql = "SELECT * FROM lost_item WHERE status = false";
            List<Map<String, Object>> lostItems = jdbcTemplate.queryForList(sql);
            
            System.out.println("Lost items count: " + lostItems.size());
            
            for (Map<String, Object> lostItem : lostItems) {
                int confidence = calculateMatchConfidence(foundItem, lostItem);
                System.out.println("Confidence for item " + lostItem.get("item_id") + ": " + confidence);
                
                if (confidence >= 70) { // Only notify for 70%+ matches
                    updateItemsWithMatch(foundItem, lostItem, confidence);
                    
                    // Send notification to lost item owner
                    sendNotificationToOwner(foundItem, lostItem, confidence);
                    
                    Map<String, Object> match = new HashMap<>();
                    match.put("lostItemId", lostItem.get("item_id"));
                    match.put("confidence", confidence);
                    match.put("matchDate", new Date());
                    match.put("ownerUsername", lostItem.get("username"));
                    matches.add(match);
                }
            }
            
            System.out.println("Total matches found: " + matches.size());
        } catch (Exception e) {
            System.out.println("Error in matching: " + e.getMessage());
            e.printStackTrace();
        }
        
        return matches;
    }

    private void sendNotificationToOwner(Map<String, Object> foundItem, Map<String, Object> lostItem, int confidence) {
        try {
            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setUsername(String.valueOf(lostItem.get("username")));
            notification.setTitle("Potential Match Found!");
            notification.setMessage("Your lost " + String.valueOf(lostItem.get("item_name")) + " may have been found (" + confidence + "% match). Please check your lost items for details.");
            notification.setType("MATCH_FOUND");
            notification.setTimestamp(new Date());
            notification.setRead(false);
            notification.setRelatedItemId(String.valueOf(lostItem.get("item_id")));
            notification.setMatchedItemId(String.valueOf(foundItem.get("itemId")));
            
            notificationDao.save(notification);
            System.out.println("Notification sent to: " + lostItem.get("username"));
        } catch (Exception e) {
            System.out.println("Error sending notification: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private int calculateMatchConfidence(Map<String, Object> foundItem, Map<String, Object> lostItem) {
        int score = 0;
        
        if (Objects.equals(foundItem.get("category"), lostItem.get("category"))) {
            score += 40;
        }
        
        String foundName = (String) foundItem.get("itemName");
        String lostName = (String) lostItem.get("item_name");
        if (foundName != null && lostName != null && 
            foundName.toLowerCase().contains(lostName.toLowerCase())) {
            score += 30;
        }
        
        if (Objects.equals(foundItem.get("color"), lostItem.get("color"))) {
            score += 15;
        }
        
        if (Objects.equals(foundItem.get("brand"), lostItem.get("brand"))) {
            score += 10;
        }
        
        return score;
    }

    private void updateItemsWithMatch(Map<String, Object> foundItem, Map<String, Object> lostItem, int confidence) {
        try {
            Object foundIdObj = foundItem.get("itemId");
            String foundId = String.valueOf(foundIdObj);
            
            Object lostIdObj = lostItem.get("item_id");
            String lostId = String.valueOf(lostIdObj);
            
            jdbcTemplate.update(
                "UPDATE lost_item SET matched_item_id = ?, match_status = 'PENDING', match_confidence = ?, match_date = NOW(), finder_username = ?, finder_email = ? WHERE item_id = ?",
                foundId, confidence, foundItem.get("username"), foundItem.get("userEmail"), lostId
            );
            
            System.out.println("Successfully updated match for item: " + lostId);
        } catch (Exception e) {
            System.out.println("Error updating match: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
