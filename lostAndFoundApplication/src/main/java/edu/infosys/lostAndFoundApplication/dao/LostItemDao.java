package edu.infosys.lostAndFoundApplication.dao;

import java.util.List;



import edu.infosys.lostAndFoundApplication.bean.LostItem;

public interface LostItemDao {
	public void save (LostItem item);
	public List<LostItem> findAll();
	public String generateId();
	public List<LostItem> lostItemList();
	public LostItem findById(String id);
	public void deleteById(String id);
	public List<LostItem> lostItemListByUser (String username);
	public List<LostItem> findByStatusFalse();
}
