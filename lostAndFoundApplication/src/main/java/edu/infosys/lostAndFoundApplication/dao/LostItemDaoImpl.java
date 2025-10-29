package edu.infosys.lostAndFoundApplication.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.infosys.lostAndFoundApplication.bean.LostItem;

@Service
public class LostItemDaoImpl implements LostItemDao {
	
	@Autowired
	private LostItemRepository repository;

	@Override
	public void save(LostItem item) {
		repository.save(item);
		
	}

	@Override
	public List<LostItem> findAll() {
		// TODO Auto-generated method stub
		return repository.findAll();
	}

	@Override
	public String generateId() {
		String id=repository.findMaxId();
		if(id==null) {
			id="L10001";
		}
		else {
			String sub=id.substring(1);
			int x=Integer.parseInt(sub);
			x++;
			id="L"+x;
		}
		return id;
	}

	@Override
	public List<LostItem> lostItemList() {
		// TODO Auto-generated method stub
		return repository.findAll();
	}

	@Override
	public LostItem findById(String id) {
		// TODO Auto-generated method stub
		return repository.findById(id).get();
	}

	@Override
	public void deleteById(String id) {
		// TODO Auto-generated method stub
		repository.deleteById(id);
		
	}

	@Override
	public List<LostItem> lostItemListByUser(String username) {
		// TODO Auto-generated method stub
		return repository.lostItemListByUser(username);
	}

	@Override
	public List<LostItem> findByStatusFalse() {
		// TODO Auto-generated method stub
		return repository.findByStatusFalse();	
	}
	
}
