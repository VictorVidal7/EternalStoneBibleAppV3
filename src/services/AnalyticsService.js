import analytics from '@react-native-firebase/analytics';

export const AnalyticsService = {
  logEvent: async (eventName, params = {}) => {
    try {
      await analytics().logEvent(eventName, params);
      console.log(`Logged event: ${eventName}`, params);
    } catch (error) {
      console.error('Error logging event:', error);
    }
  },

  setUserProperty: async (name, value) => {
    try {
      await analytics().setUserProperty(name, value);
      console.log(`Set user property: ${name} = ${value}`);
    } catch (error) {
      console.error('Error setting user property:', error);
    }
  },

  // Ejemplos de eventos específicos
  logScreenView: async (screenName) => {
    await AnalyticsService.logEvent('screen_view', { screen_name: screenName });
  },

  logReadingProgress: async (book, chapter, verse) => {
    await AnalyticsService.logEvent('reading_progress', { book, chapter, verse });
  },

  logPlanStarted: async (planId) => {
    await AnalyticsService.logEvent('plan_started', { plan_id: planId });
  },

  logSearch: async (query) => {
    await AnalyticsService.logEvent('search', { query });
  },
};