package edu.infosys.lostAndFoundApplication.dao;

import java.util.List;


import edu.infosys.lostAndFoundApplication.bean.FoundItem;


public interface FoundItemDao {
	public void save (FoundItem item);
	public List<FoundItem> findAll();
	public String generateId();
	public FoundItem findById(String id);
	public void deleteById(String id);
	public List<FoundItem> FoundItemListByUser (String username);
	public List<FoundItem> findByStatusFalse();
}
