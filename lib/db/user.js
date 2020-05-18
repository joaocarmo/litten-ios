/**
 * @format
 * @flow strict-local
 */

import firestore from '@react-native-firebase/firestore'
import { DB_USER_COLLECTION } from 'utils/constants'
import { store } from 'store'
import { setExtra } from 'store/actions/authenticated-user'
import { logError } from 'utils/functions'
import { userSchema } from './schemas/user'

/**
 * Creates a new user in Firestore
 * @async
 * @param {Object.<string, string>} userInfo - A user object
 * @returns {Promise.<void>}
 */
export async function createNewUser(userInfo) {
  try {
    const userObject = { ...userSchema, ...userInfo }
    await firestore().collection(DB_USER_COLLECTION).add(userObject)
    store.dispatch(setExtra(userObject))
  } catch (err) {
    logError(err)
  }
}

/**
 * Finds a user in Firestore by auth uid and stores it
 * @async
 * @param {string} authUuid - A user's auth uid
 * @returns {Promise.<void>}
 */
export async function getUser(authUuid) {
  try {
    const querySnapshot = await firestore()
      .collection(DB_USER_COLLECTION)
      .where('authUuid', '==', authUuid)
      .get()
    const [queryDocumentSnapshot] = querySnapshot.docs
    const userInfo = querySnapshot.empty ? {} : queryDocumentSnapshot.data()
    const userObject = { ...userSchema, ...userInfo }
    store.dispatch(setExtra(userObject))
  } catch (err) {
    logError(err)
  }
}