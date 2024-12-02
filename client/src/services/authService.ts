import { getAuth, browserSessionPersistence, Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

/**
 * AuthService class to manage Firebase authentication instances.
 * It provides methods to get and clear authentication instances based on a window ID.
 */
class AuthService {
  private static _instances = new Map<string, Auth>();

  /**
   * Gets the Auth instance for the given Firebase app and window ID.
   * If the instance does not exist, it creates one and sets the session persistence.
   *
   * @param {FirebaseApp} app - The Firebase app instance.
   * @param {string} windowId - The unique identifier for the window session.
   * @returns {Auth} The Auth instance.
   */
  static getAuth(app: FirebaseApp, windowId: string): Auth {
    if (!this._instances.has(windowId)) {
      const auth = getAuth(app);
      // Set persistence synchronously
      auth.setPersistence(browserSessionPersistence).then(() => {});
      this._instances.set(windowId, auth);
    }
    return this._instances.get(windowId)!;
  }

  /**
   * Clears the Auth instance for the given window ID.
   * It signs out the user and removes the instance from the map.
   *
   * @param {string} windowId - The unique identifier for the window session.
   */
  static clearAuth(windowId: string) {
    const auth = this._instances.get(windowId);
    if (auth) {
      auth.signOut().then(() => {});
    }
    this._instances.delete(windowId);
  }
}

export default AuthService;
