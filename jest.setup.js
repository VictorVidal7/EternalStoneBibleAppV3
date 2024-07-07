import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock for react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    PanGestureHandler: View,
    State: {},
    gestureHandlerRootHOC: jest.fn(),
  };
});

// Mock for react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock for react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// Mock for @react-navigation/native
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Mock for react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MockedMaterialIcons');

// Mock for react-native-push-notification
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  createChannel: jest.fn(),
  onRegister: jest.fn(),
  onNotification: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  requestPermissions: jest.fn(),
  abandonPermissions: jest.fn(),
  checkPermissions: jest.fn(),
  getInitialNotification: jest.fn(),
  getChannels: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  removeAllDeliveredNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  getScheduledLocalNotifications: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  removeNotificationResponseReceivedListener: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');