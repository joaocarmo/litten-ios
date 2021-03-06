/**
 * @format
 * @flow
 */

import { useEffect } from 'react'
import {
  useNavigation,
  useNavigationState,
  type NavigationProp,
} from '@react-navigation/native'
import { SCREEN_TAB_NAV_HOME } from 'utils/constants'
import linkingConfig from 'config/navigation/linking'

const useSafeNavigation = ({
  fallbackScreen = SCREEN_TAB_NAV_HOME,
}: {
  fallbackScreen: string,
} = {}): NavigationProp<any> => {
  const navIndex = useNavigationState(({ index }) => index)
  const navRoutes = useNavigationState(({ routes }) => routes)

  const navigation = useNavigation()

  const canGoBack = navIndex > 0

  useEffect(() => {
    // Make sure there's a screen to go back to after following a deep link
    const [currentRoute] = navRoutes
    const linkingRoutes = Object.keys(linkingConfig.config.screens)

    if (!canGoBack && linkingRoutes.includes(currentRoute.name)) {
      const routes = [
        { name: fallbackScreen },
        { name: currentRoute.name, params: currentRoute.params },
      ]
      navigation.reset({
        index: 1,
        routes,
      })
    }
  }, [canGoBack, fallbackScreen, navRoutes, navigation])

  return navigation
}

export default useSafeNavigation
