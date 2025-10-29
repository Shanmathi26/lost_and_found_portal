package edu.infosys.lostAndFoundApplication.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import edu.infosys.lostAndFoundApplication.bean.CampusUser;

public interface CampusUserRepository extends JpaRepository<CampusUser, String> {
	
	@Query("SELECT a from CampusUser a where a.role='Student'")
	public List<CampusUser> getAllStudents();


}
