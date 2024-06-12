import {
    GoogleSignin,
    statusCodes
  } from '@react-native-google-signin/google-signin';
  
  GoogleSignin.configure({
    webClientId: process.env.GOOGLE_SIGNINAPI
  });
  
  export const signOutGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getGoogleToken = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await signOutGoogle();
      }
      await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      return tokens;
    } catch (error) {
      console.log({ error });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  