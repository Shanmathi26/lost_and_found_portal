package edu.infosys.lostAndFoundApplication.bean;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class CampusUser extends User {

	@Id
	private String username;
	private String password;
	private String personName;
	private String email;
	private String role;
	
	public CampusUser() {
		super("abc","pqr",new ArrayList<>());
	}
	
	public CampusUser(String username, String password, Collection<? extends GrantedAuthority> authorities,
			String username2, String personName2,String email2, String password2, String role2) {
		super(username, password, authorities);
		this.username = username2;
		this.password = password2;
		this.personName=personName2;
		this.email = email2;
		this.role = role2;
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getPersonName() {
		return personName;
	}
	public void setPersonName(String personName) {
		this.personName = personName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	@Override
	public String toString() {
		return "CampusUser [username=" + username + ", password=" + password + ", personName=" + personName + ", email="
				+ email + ", role=" + role + "]";
	}
	
	
}
