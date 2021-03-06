/**
 * @format
 * @flow
 */

import storage from '@react-native-firebase/storage'
import firestore from 'db/firestore'
import Auth from 'model/auth'
import Base from 'model/base'
import Litten from 'model/litten'
import Search from 'model/search'
import { deleteAllChatForUser } from 'db/maintenance'
import {
  DB_USER_COLLECTION,
  STORAGE_IGNORED_ERRORS,
  STORAGE_USER_AVATAR,
  USER_PREFERENCES_CONTACT_INAPP,
} from 'utils/constants'
import { debugLog, logError } from 'utils/dev'
import type { BasicUser, UserClass } from 'model/types/user'
import type { DBCoordinateObject, DBLocationObject } from 'db/schemas/location'

export class UserError extends Error {
  constructor(...args: string[]) {
    super(...args)

    // Maintains proper stack trace for where the error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserError)
    }

    this.name = 'UserError'
  }
}

export default class User extends Base implements UserClass {
  #auth
  #contactPreferences
  #currentUser
  #displayName
  #email
  #isOrganization
  #phoneNumber
  #photoURL
  #search
  #deferredSave = false
  #deferredSaveObject = {}

  constructor(basicUser: BasicUser) {
    super()

    const {
      id = '',
      contactPreferences = [USER_PREFERENCES_CONTACT_INAPP],
    } = basicUser
    this.mapDocToProps(basicUser)

    this.#search = new Search({ user: { id } })
    this.#auth = new Auth()
    this.#currentUser = this.#auth.currentUser
    this.#contactPreferences = contactPreferences
  }

  static get firestore(): any {
    return firestore
  }

  static get collection(): any {
    return User.firestore().collection(DB_USER_COLLECTION)
  }

  static get storage(): any {
    return storage
  }

  get firestore(): any {
    return User.firestore
  }

  get collection(): any {
    return User.collection
  }

  get storage(): any {
    return User.storage
  }

  get displayName(): void | string {
    return this.#displayName
  }

  get email(): void | string {
    return this.#email
  }

  get photoURL(): void | string {
    return this.#photoURL
  }

  get location(): void | DBLocationObject {
    return super.location
  }

  get coordinates(): DBCoordinateObject {
    return super.coordinates
  }

  get photoURLRef(): string {
    if (this.id) {
      const fileExt = 'jpg'
      return `${STORAGE_USER_AVATAR}/${this.id}.${fileExt}`
    }
    return ''
  }

  get phoneNumber(): void | string {
    return this.#phoneNumber
  }

  get isOrganization(): void | boolean {
    return this.#isOrganization
  }

  get contactPreferences(): string[] {
    return this.#contactPreferences
  }

  set deferredSave(deferredSave: boolean = false) {
    this.#deferredSave = deferredSave
  }

  set displayName(displayName: string | void = '') {
    if (displayName) {
      this.#displayName = displayName
      this.updateOne('displayName', displayName)

      if (this.#currentUser) {
        this.#auth.displayName = displayName
      }
    }
  }

  set email(email: string | void = '') {
    if (email) {
      this.#email = email
      this.updateOne('email', email)

      if (this.#currentUser) {
        this.#auth.email = email
      }
    }
  }

  set photoURL(photoURL: string | void = '') {
    this.deletePhoto(this.photoURLRef)

    if (photoURL) {
      this.uploadAndSetPhoto(photoURL)
    } else {
      this.#photoURL = photoURL
      this.updateOne('photoURL', photoURL)

      if (this.#currentUser) {
        this.#auth.photoURL = photoURL
      }
    }
  }

  set phoneNumber(phoneNumber: string | void = '') {
    this.#phoneNumber = phoneNumber
    this.updateOne('phoneNumber', phoneNumber)
  }

  set location(location: DBLocationObject = {}) {
    super.location = location

    this.updateOne('location', super.buildLocation())
  }

  set coordinates(coordinates: DBCoordinateObject) {
    super.coordinates = coordinates

    const { latitude, longitude } = coordinates
    this.updateOne(
      'location.coordinates',
      new firestore.GeoPoint(latitude, longitude),
    )
  }

  set isOrganization(isOrganization: boolean = false) {
    this.#isOrganization = isOrganization
    this.updateOne('isOrganization', isOrganization)
  }

  set contactPreferences(value: string | string[] | void) {
    if (Array.isArray(value)) {
      this.#contactPreferences = value
    } else if (value) {
      let newContactPreferences: string[] = [...this.#contactPreferences]
      if (this.#contactPreferences.includes(value)) {
        newContactPreferences = this.#contactPreferences.filter(
          (element) => element !== value,
        )
        this.updateOne(
          'contactPreferences',
          firestore.FieldValue.arrayRemove(value),
        )
      } else {
        newContactPreferences.push(value)
        this.updateOne(
          'contactPreferences',
          firestore.FieldValue.arrayUnion(value),
        )
      }
      this.#contactPreferences = newContactPreferences
    }
  }

  async uploadAndSetPhoto(photoURL: string) {
    if (this.#currentUser) {
      try {
        this.#photoURL = await this.#auth.uploadAndSetPhoto(photoURL)
        this.updateOne('photoURL', this.#photoURL)
      } catch (err) {
        if (STORAGE_IGNORED_ERRORS.includes(err.code)) {
          debugLog(err)
        } else {
          logError(err)
        }
      }
    }
  }

  buildObject(): BasicUser {
    const userObject = {
      contactPreferences: this.#contactPreferences,
      displayName: this.#displayName,
      email: this.#email,
      isOrganization: this.#isOrganization,
      location: this.buildLocation(),
      phoneNumber: this.#phoneNumber,
      photoURL: this.#photoURL,
      metadata: this.buildMetadata(),
    }
    return userObject
  }

  mapDocToProps({
    contactPreferences = [],
    displayName = '',
    email = '',
    isOrganization = false,
    phoneNumber = '',
    photoURL = '',
    ...otherProps
  }: BasicUser) {
    super.mapCommonProps(otherProps)

    this.#contactPreferences = contactPreferences
    this.#displayName = displayName
    this.#email = email
    this.#isOrganization = isOrganization
    this.#phoneNumber = phoneNumber
    this.#photoURL = typeof photoURL === 'string' ? photoURL : photoURL?.uri
  }

  async reauthenticate(password: string) {
    const provider = this.#auth.EmailAuthProvider
    const email = this.#email
    const authCredential = provider.credential(email, password)
    await this.#currentUser.reauthenticateWithCredential(authCredential)
  }

  async get() {
    let user

    if (this.id) {
      user = await this.collection.doc(this.id).get()
    }

    if (user) {
      this.mapDocToProps({ ...user.data(), id: user?.id })
    }
  }

  async create(): Promise<BasicUser | null> {
    if (this.id) {
      const userObject = this.buildObject()

      await this.collection.doc(this.id).set(userObject)

      const newUserObject = {
        ...userObject,
        id: this.id,
      }

      return newUserObject
    }

    return null
  }

  async update(
    updateObject: { ... },
    updateTimestamp: boolean = true,
  ): Promise<void> {
    if (this.id) {
      let newUpdateObject: { ... } = updateObject

      if (updateTimestamp) {
        newUpdateObject = {
          ...updateObject,
          'metadata.updatedAt': firestore.FieldValue.serverTimestamp(),
        }
      }

      if (this.#deferredSave) {
        this.#deferredSaveObject = {
          ...this.#deferredSaveObject,
          ...newUpdateObject,
        }
      } else {
        return this.collection.doc(this.id).update(newUpdateObject)
      }
    }
  }

  async updateOne(
    field: string,
    value: any,
    updateTimestamp: boolean = true,
  ): Promise<void> {
    const updateObject = {
      [field]: value,
    }

    return this.update(updateObject, updateTimestamp)
  }

  async save(): Promise<any> {
    if (this.#deferredSave) {
      return this.collection.doc(this.id).update(this.#deferredSaveObject)
    }
  }

  async deleteLittens() {
    const ids = []
    const activePosts = await this.#search?.userPostsQuery(true).get()
    const inactivePosts = await this.#search?.userPostsQuery(false).get()
    activePosts?.docs.forEach((documentSnapshot) => {
      ids.push(documentSnapshot.id)
    })
    inactivePosts?.docs.forEach((documentSnapshot) => {
      ids.push(documentSnapshot.id)
    })
    for (const id of ids) {
      const litten = new Litten({ id })
      await litten.delete()
    }

    debugLog('[USER] DELETED LITTENS', ids.length)
  }

  async deleteChats(): Promise<void> {
    if (this.id) {
      return deleteAllChatForUser(this.id)
    }
  }

  async deletePhoto(photoURLRef: string = '') {
    const fileRef = this.storage().ref(photoURLRef || this.photoURLRef)
    try {
      await fileRef.delete()
    } catch (err) {
      if (STORAGE_IGNORED_ERRORS.includes(err.code)) {
        debugLog(err)
      } else {
        throw new UserError(err)
      }
    }
  }

  async deleteUser() {
    if (this.id) {
      await this.collection.doc(this.id).delete()
    }
  }

  async deleteAuth() {
    if (this.#currentUser) {
      await this.#currentUser.delete()
    }
  }

  async delete() {
    await this.deleteLittens()
    await this.deleteChats()
    await this.deletePhoto()
    await this.deleteUser()
    await this.deleteAuth()
  }
}
