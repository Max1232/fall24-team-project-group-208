import { getAuth, browserLocalPersistence, Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

class AuthService {
  private static _instances = new Map<string, Auth>();

  static getAuth(app: FirebaseApp, windowId: string): Auth {
    if (!this._instances.has(windowId)) {
      const auth = getAuth(app);
      auth.setPersistence(browserLocalPersistence);
      this._instances.set(windowId, auth);
    }
    return this._instances.get(windowId)!;
  }

  static clearAuth(windowId: string) {
    this._instances.delete(windowId);
  }
}

export default AuthService;
