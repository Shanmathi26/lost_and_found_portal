import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const findMatches = (foundItem) => {
  return axios.post(`${BASE_URL}/matches/find`, foundItem)
    .catch(error => {
      console.error('Error finding matches:', error);
      return { data: [] }; // Return empty matches on error
    });
};

export const confirmMatch = (matchId, confirmed) => {
  return axios.put(`${BASE_URL}/matches/${matchId}/confirm`, { confirmed });
};

export const markAsReturned = (itemId, type) => {
  return axios.put(`${BASE_URL}/matches/${itemId}/returned`, { type });
};

// Enhanced matching with automatic notification (70% confidence threshold)
export const findMatchesWithAutoNotify = (foundItem) => {
  const MIN_CONFIDENCE = 70;
  
  return findMatches(foundItem)
    .then(async response => {
      // Filter matches by confidence threshold and send notifications
      if (response.data && response.data.length > 0) {
        const highConfidenceMatches = response.data.filter(match => 
          (match.confidence || match.matchConfidence || 0) >= MIN_CONFIDENCE
        );
        
        // Send notifications for each high-confidence match
        const notificationPromises = highConfidenceMatches.map(match => 
          axios.post(`${BASE_URL}/notifications`, {
            username: match.ownerUsername,
            title: 'Potential Match Found!',
            message: `Your lost ${foundItem.itemName} may have been found (${match.confidence || match.matchConfidence}% match). Please check your lost items for details.`,
            type: 'MATCH_FOUND',
            relatedItemId: match.lostItemId,
            matchedItemId: foundItem.itemId
          }).catch(err => console.error('Failed to send notification:', err))
        );
        
        await Promise.all(notificationPromises);
        console.log(`Sent ${highConfidenceMatches.length} notifications for matches above ${MIN_CONFIDENCE}% confidence`);
      }
      return response;
    });
};