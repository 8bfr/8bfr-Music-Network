// Carrie Memory System
// Stores and recalls trained responses from Avatar Trainer

(function() {
  'use strict';
  
  // Memory storage
  window.CARRIE_MEMORY = {
    // Get all trained responses
    getTrainedResponses: function() {
      try {
        const stored = localStorage.getItem('trainedResponses');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error('Error loading trained responses:', e);
        return [];
      }
    },
    
    // Find matching response for user input
    findResponse: function(userInput, mode, avatar) {
      const responses = this.getTrainedResponses();
      const input = userInput.toLowerCase().trim();
      
      // Filter by mode and avatar
      const filtered = responses.filter(r => {
        const modeMatch = r.mode === 'all' || r.mode === mode;
        const avatarMatch = r.avatar === 'all' || r.avatar === avatar;
        return modeMatch && avatarMatch;
      });
      
      // Find matching trigger
      for (const response of filtered) {
        const trigger = response.question.toLowerCase();
        if (input.includes(trigger) || trigger.includes(input)) {
          return response.answer;
        }
      }
      
      return null;
    },
    
    // Save a new trained response
    saveResponse: function(question, answer, mode, avatar) {
      const responses = this.getTrainedResponses();
      responses.push({
        id: Date.now(),
        question,
        answer,
        mode,
        avatar,
        created: new Date().toISOString()
      });
      
      try {
        localStorage.setItem('trainedResponses', JSON.stringify(responses));
        return true;
      } catch (e) {
        console.error('Error saving response:', e);
        return false;
      }
    },
    
    // Delete a trained response
    deleteResponse: function(id) {
      const responses = this.getTrainedResponses();
      const filtered = responses.filter(r => r.id !== id);
      
      try {
        localStorage.setItem('trainedResponses', JSON.stringify(filtered));
        return true;
      } catch (e) {
        console.error('Error deleting response:', e);
        return false;
      }
    },
    
    // Clear all trained responses
    clearAll: function() {
      try {
        localStorage.removeItem('trainedResponses');
        return true;
      } catch (e) {
        console.error('Error clearing responses:', e);
        return false;
      }
    },
    
    // Get response count
    getCount: function() {
      return this.getTrainedResponses().length;
    }
  };
  
  console.log('✅ Carrie Memory System loaded');
  console.log('📚 Trained responses:', window.CARRIE_MEMORY.getCount());
  
})();
