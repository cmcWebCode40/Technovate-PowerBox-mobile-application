import {ReactNativeFirebase} from '@react-native-firebase/app';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

class Auth {
  private auth: typeof auth;
  private firestore: typeof firestore;

  constructor(
    authModule: ReactNativeFirebase.FirebaseModuleWithStaticsAndApp<
      FirebaseAuthTypes.Module,
      FirebaseAuthTypes.Statics
    >,
    fireStoreModule: ReactNativeFirebase.FirebaseModuleWithStaticsAndApp<
      FirebaseFirestoreTypes.Module,
      FirebaseFirestoreTypes.Statics
    >,
  ) {
    this.auth = authModule;
    this.firestore = fireStoreModule;
  }

  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
  ): Promise<FirebaseAuthTypes.User> {
    const userCredential = await this.auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;

    await user.updateProfile({
      displayName: `${firstName} ${lastName}`,
    });

    await this.saveUserData(user.uid, firstName, lastName, email, phoneNumber);

    console.log('User signed up successfully!', user);
    return user;
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<FirebaseAuthTypes.User> {
    const userCredential = await this.auth().signInWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    console.log('User signed in successfully!', user);
    return user;
  }

  async saveUserData(
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
  ): Promise<void> {
    await this.firestore().collection('users').doc(userId).set({
      firstName,
      lastName,
      email,
      phoneNumber,
      planBalance: null,
      planType: null,
      isDeviceLinked:false,
      boxId:null,
    });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const userDoc = await this.firestore()
      .collection('users')
      .doc(userId)
      .get();
    if (userDoc.exists) {
      const userData = userDoc.data() as UserProfile;
      console.log('User profile:', userData);
      return userData;
    } else {
      throw new Error('User not found');
    }
  }

  async getUserSession(): Promise<FirebaseAuthTypes.User | null> {
    const user = auth().currentUser;
    console.log('User Session retrieved:', user);
    return user;
  }

  async logout(): Promise<void> {
    await this.auth().signOut();
  }

  handleError(error: Error | unknown) {
    if (error instanceof Error) {
      if ('code' in error && 'message' in error) {
        const firebaseError = error as {code: string; message: string};
        console.error('Firebase error code:', firebaseError.code);
        console.error('Firebase error message:', firebaseError.message);
        return firebaseError.message;
      } else {
        return 'An unknown error occurred during sign-in.';
      }
    }
    return 'An unknown error occurred during sign-in.';
  }
}

const authInstance = new Auth(auth, firestore);
export default authInstance;
