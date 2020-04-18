/**
 * @format
 * @flow strict-local
 */

import React from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { vw } from 'react-native-expo-viewport-units'
import colors from 'styles/colors'
import { goBackArrow } from 'images'

const RegisterLoginTemplate: () => React$Node = ({
  children,
  footer,
  header,
}) => {
  const navigation = useNavigation()

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Image
            source={goBackArrow}
            style={styles.goBack}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.formOutContainer}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formInContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.headerText}>{header}</Text>
            </View>
            <View style={styles.formBody}>{children}</View>
            <View style={styles.formFooter}>{footer}</View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    backgroundColor: colors.blue,
  },
  formOutContainer: {
    flex: 6,
    backgroundColor: colors.blue,
  },
  formInContainer: {
    height: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formHeader: {
    flex: 1,
    width: vw(90),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  formBody: {
    flex: 3,
    width: vw(90),
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  formFooter: {
    flex: 1,
    width: vw(90),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  goBack: {
    height: 20,
    width: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    color: colors.black,
  },
})

export default RegisterLoginTemplate