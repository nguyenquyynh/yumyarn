// appStateManager.js
import { AppState } from 'react-native';

let currentAppState = AppState.currentState;
const handleAppStateChange = (nextAppState, socket) => {
    if (currentAppState.match(/inactive|background/) && nextAppState === 'active') {
        // Ứng dụng đã được chuyển về foreground
        if (socket && !socket.connected ) {
            socket.connect();
        }
    } else if (nextAppState === 'background') {
        // Ứng dụng đã được chuyển về background
        if (socket && socket.connected) {
            socket.disconnect();
        }
    }
    currentAppState = nextAppState;
};

const initAppStateManager = (socket) => {
    const onAppStateChange = (nextAppState) => handleAppStateChange(nextAppState, socket);
    const appStateSubscription = AppState.addEventListener('change', onAppStateChange);

    return () => {
        appStateSubscription.remove;
        if (socket) {
          socket.disconnect(); // Ensure socket is disconnected
        }
      };
};

export { initAppStateManager };
