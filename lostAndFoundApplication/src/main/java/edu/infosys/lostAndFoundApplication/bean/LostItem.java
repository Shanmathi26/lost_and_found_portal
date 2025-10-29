package edu.infosys.lostAndFoundApplication.bean;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class LostItem {
	@Id
    private String itemId;
    private String username;
    private String userEmail;
    private String itemName;
    private String category;
    private String color;
    private String brand;
    private String location;
    private String lostDate;
    private boolean status;
 // In your LostItem entity/model
    private String matchedItemId;
    
	private String matchStatus;
    private Integer matchConfidence;
    private Date matchDate;
    private String finderUsername;
    private String finderEmail;
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;


    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getMatchedItemId() {
		return matchedItemId;
	}


	public void setMatchedItemId(String matchedItemId) {
		this.matchedItemId = matchedItemId;
	}


	public String getMatchStatus() {
		return matchStatus;
	}


	public void setMatchStatus(String matchStatus) {
		this.matchStatus = matchStatus;
	}


	public Integer getMatchConfidence() {
		return matchConfidence;
	}


	public void setMatchConfidence(Integer matchConfidence) {
		this.matchConfidence = matchConfidence;
	}


	public Date getMatchDate() {
		return matchDate;
	}


	public void setMatchDate(Date matchDate) {
		this.matchDate = matchDate;
	}


	public String getFinderUsername() {
		return finderUsername;
	}


	public void setFinderUsername(String finderUsername) {
		this.finderUsername = finderUsername;
	}


	public String getFinderEmail() {
		return finderEmail;
	}


	public void setFinderEmail(String finderEmail) {
		this.finderEmail = finderEmail;
	}
    
	
	public LostItem(String itemId, String username, String userEmail, String itemName, String category, String color,
			String brand, String location, String lostDate, boolean status) {
		super();
		this.itemId = itemId;
		this.username = username;
		this.userEmail = userEmail;
		this.itemName = itemName;
		this.category = category;
		this.color = color;
		this.brand = brand;
		this.location = location;
		this.lostDate = lostDate;
		this.status = status;
	}
	
	
	public boolean isStatus() {
		return status;
	}


	public void setStatus(boolean status) {
		this.status = status;
	}


	public String getItemId() {
		return itemId;
	}
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getUserEmail() {
		return userEmail;
	}
	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getBrand() {
		return brand;
	}
	public void setBrand(String brand) {
		this.brand = brand;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getLostDate() {
		return lostDate;
	}
	public void setLostDate(String lostDate) {
		this.lostDate = lostDate;
	}
	public LostItem() {
		super();
		// TODO Auto-generated constructor stub
	}
	
    
    
}
