import { getAuth, browserSessionPersistence, Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

class AuthService {
  private static _instances = new Map<string, Auth>();

  static getAuth(app: FirebaseApp, windowId: string): Auth {
    if (!this._instances.has(windowId)) {
      console.log('Creating new auth instance for window:', windowId);
      const auth = getAuth(app);
      // Set persistence synchronously
      auth.setPersistence(browserSessionPersistence);
      this._instances.set(windowId, auth);
    } else {
      console.log('Reusing existing auth instance for window:', windowId);
    }
    return this._instances.get(windowId)!;
  }

  static clearAuth(windowId: string) {
    const auth = this._instances.get(windowId);
    if (auth) {
      auth.signOut();
    }
    this._instances.delete(windowId);
  }
}

export default AuthService;
