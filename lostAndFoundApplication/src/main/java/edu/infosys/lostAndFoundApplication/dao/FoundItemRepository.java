package edu.infosys.lostAndFoundApplication.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.infosys.lostAndFoundApplication.bean.FoundItem;

@Repository
public interface FoundItemRepository extends JpaRepository<FoundItem, String> {
	@Query("SELECT max(itemId) from FoundItem")
	public String findMaxId();

	@Query("SELECT a FROM FoundItem a WHERE a.username = :username")
	public List<FoundItem> foundItemListByUser(String username);

	@Query("SELECT a FROM FoundItem a WHERE a.status = false")
    public List<FoundItem> findByStatusFalse();
}
