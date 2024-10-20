import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '254299987381-28gqrb6m1luci16l176tfpmkbtoue0eq.apps.googleusercontent.com'
});

export const signOutGoogle = async () => {
  try {
    console.log("logout........")
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.log(error);
  }
};

export const loginGoogle = async () => {
  try {
    const isSignedIn = await GoogleSignin.hasPreviousSignIn();
    if (isSignedIn) {
      await signOutGoogle();
    }
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true
    })
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      // const token = await GoogleSignin.getTokens()
      // console.log("userInfo: ", userInfo);
      // console.log("token: ", token);

      return userInfo.data
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log({ error });
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log({ error });
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log({ error });
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log({ error });
    } else {
      console.log({ error });
    }
  }
};