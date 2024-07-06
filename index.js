import {AppRegistry, Text, View} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

const ErrorBoundary = ({ error }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>An error occurred: {error.toString()}</Text>
  </View>
);

const AppWithErrorHandling = () => {
  try {
    return <App />;
  } catch (error) {
    console.error(error);
    return <ErrorBoundary error={error} />;
  }
};

AppRegistry.registerComponent(appName, () => AppWithErrorHandling);