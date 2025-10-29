package edu.infosys.lostAndFoundApplication.bean;

import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class Notification {
    @Id
    private String id;
    private String username;
    private String title;
    private String message;
    private String type;
    
    @Column(name = "is_read")
    private boolean read;
    
    private Date timestamp;
    private String relatedItemId;
    private String matchedItemId;

    public Notification() {
        super();
    }

    public Notification(String id, String username, String title, String message, String type, boolean read, Date timestamp) {
        super();
        this.id = id;
        this.username = username;
        this.title = title;
        this.message = message;
        this.type = type;
        this.read = read;
        this.timestamp = timestamp;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    
    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
    
    public String getRelatedItemId() { return relatedItemId; }
    public void setRelatedItemId(String relatedItemId) { this.relatedItemId = relatedItemId; }
    
    public String getMatchedItemId() { return matchedItemId; }
    public void setMatchedItemId(String matchedItemId) { this.matchedItemId = matchedItemId; }
}
