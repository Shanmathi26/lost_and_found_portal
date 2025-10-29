package edu.infosys.lostAndFoundApplication.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.infosys.lostAndFoundApplication.bean.LostItem;
import edu.infosys.lostAndFoundApplication.dao.LostItemDao;

@RestController
@RequestMapping("/lost-found/lost")
@CrossOrigin(origins = "http://localhost:3939")
public class LostController {
	
	@Autowired
	private LostItemDao lostItemDao;
	
	
	@PostMapping()
    public void addLostItem(@RequestBody LostItem item) {
//        String id = lostItemDao.generateId();
//        item.setItemId(id);
        lostItemDao.save(item);
    }
	
    @GetMapping()
    public List<LostItem> getAllLostItems() {
        return lostItemDao.findAll();
    }
    @GetMapping("/{id}")
    public LostItem getLostItemById(@PathVariable("id") String id) {
        return lostItemDao.findById(id);
    }
    
    @DeleteMapping("/{id}")
    public void deleteLostItem(@PathVariable("id") String id) {
        lostItemDao.deleteById(id);
    }
    
    @GetMapping("/user/{username}")
    public List<LostItem> getLostItemsByUser(@PathVariable("username") String username) {
        return lostItemDao.lostItemListByUser(username);
    }
    
    @GetMapping("/id-gen")
    public String generateId() {
    	return lostItemDao.generateId();
    }

    @GetMapping("/status-false")
    public List<LostItem> getLostItemsByStatusFalse() {
        return lostItemDao.findByStatusFalse();
    }

}
