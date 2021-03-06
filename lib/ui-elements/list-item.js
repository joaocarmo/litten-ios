/**
 * @format
 * @flow
 */

import { useState } from 'react'
import { Pressable } from 'react-native'
import UIListItemContent from 'ui-elements/inner-components/list-item-content'

const UIListItem: (args: any) => React$Node = ({
  children,
  onLongPress,
  onPress,
  ...otherProps
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const isClickable =
    typeof onPress !== 'undefined' || typeof onLongPress !== 'undefined'

  const content = (
    <UIListItemContent isPressed={isPressed} {...otherProps}>
      {children}
    </UIListItemContent>
  )

  if (isClickable) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}>
        {content}
      </Pressable>
    )
  }

  return content
}

export default UIListItem
