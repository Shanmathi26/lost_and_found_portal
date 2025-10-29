package edu.infosys.lostAndFoundApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.lostAndFoundApplication.bean.FoundItem;

@Service
public class FoundItemDaoImpl implements FoundItemDao {
	
	@Autowired
	private FoundItemRepository repository;

	@Override
	public void save(FoundItem item) {
		// TODO Auto-generated method stub
		repository.save(item);

	}

	@Override
	public List<FoundItem> findAll() {
		// TODO Auto-generated method stub
		return repository.findAll();
	}

	public String generateId() {
	    try {
	        // Simple timestamp-based ID generation
	        return String.valueOf(System.currentTimeMillis());
	    } catch (Exception e) {
	        // Fallback with random number
	        return String.valueOf(System.currentTimeMillis() + (int)(Math.random() * 1000));
	    }
	}


	@Override
	public FoundItem findById(String id) {
		// TODO Auto-generated method stub
		return repository.findById(id).get();
	}

	@Override
	public void deleteById(String id) {
		// TODO Auto-generated method stub
		repository.deleteById(id);

	}

	@Override
	public List<FoundItem> FoundItemListByUser(String username) {
		// TODO Auto-generated method stub
		return repository.foundItemListByUser(username);
	}

	@Override
	public List<FoundItem> findByStatusFalse() {
		
		return repository.findByStatusFalse();
	}

}
