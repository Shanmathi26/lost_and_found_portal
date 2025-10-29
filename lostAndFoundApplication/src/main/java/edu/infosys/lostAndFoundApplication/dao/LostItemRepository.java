package edu.infosys.lostAndFoundApplication.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.infosys.lostAndFoundApplication.bean.LostItem;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, String> {
	

	@Query("SELECT max(itemId) from LostItem")
	public String findMaxId();

	
	@Query("SELECT a from LostItem a WHERE a.username = :username")
	public List<LostItem> lostItemListByUser(String username);
	
	@Query("SELECT a FROM LostItem a WHERE a.status = false")
    public List<LostItem> findByStatusFalse();
	

}
