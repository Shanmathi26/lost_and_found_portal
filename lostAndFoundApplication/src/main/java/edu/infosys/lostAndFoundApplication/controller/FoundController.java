package edu.infosys.lostAndFoundApplication.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.infosys.lostAndFoundApplication.bean.FoundItem;
import edu.infosys.lostAndFoundApplication.dao.FoundItemDao;
import edu.infosys.lostAndFoundApplication.service.MatchService;

@RestController
@RequestMapping("/lost-found/found")
@CrossOrigin(origins = "http://localhost:3939")
public class FoundController {
	
	@Autowired
	private FoundItemDao foundItemDao;
	@Autowired
	private MatchService matchService;
	
    @GetMapping()
    public List<FoundItem> getAllLostItems() {
        return foundItemDao.findAll();
    }
    @GetMapping("/{id}")
    public FoundItem getLostItemById(@PathVariable("id") String id) {
        return foundItemDao.findById(id);
    }
    
    @DeleteMapping("/{id}")
    public void deleteLostItem(@PathVariable("id") String id) {
        foundItemDao.deleteById(id);
    }
    
    @GetMapping("/user/{username}")
    public List<FoundItem> getLostItemsByUser(@PathVariable("username") String username) {
        return foundItemDao.FoundItemListByUser(username);
    }
    
    @GetMapping("/id-gen")
    public String generateId() {
    	return foundItemDao.generateId();
    }

    @GetMapping("/status-false")
    public List<FoundItem> getFoundItemsByStatusFalse() {
        return foundItemDao.findByStatusFalse();
    }
    
    @PostMapping
    public ResponseEntity<String> submitFoundItem(@RequestBody FoundItem foundItem) {
        try {
            // Save the found item first
            foundItemDao.save(foundItem);
            
            // Convert to Map for matching service
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("itemId", foundItem.getItemId());
            itemMap.put("itemName", foundItem.getItemName());
            itemMap.put("category", foundItem.getCategory());
            itemMap.put("color", foundItem.getColor());
            itemMap.put("brand", foundItem.getBrand());
            itemMap.put("location", foundItem.getLocation());
            itemMap.put("username", foundItem.getUsername());
            itemMap.put("userEmail", foundItem.getUserEmail());
            
            // Find matches and send notifications
            matchService.findMatches(itemMap);
            
            return ResponseEntity.ok("Found item submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error submitting found item");
        }
    }

}
