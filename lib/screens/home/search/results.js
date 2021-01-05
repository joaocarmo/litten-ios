/**
 * @format
 * @flow
 */

import { useCallback, useMemo } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { usePaddingBottom } from 'hooks'
import { useFavouriteFn } from 'hooks'
import BottomLoader, {
  ListFooterComponentStyle,
} from 'components/bottom-loader'
import LittenDumbCard from 'components/litten-card/dumb'
import SearchHeaderResults from 'screens/home/search/header-results'
import SearchEmptyResults from 'screens/home/search/empty-results'
import {
  SEARCH_INITIAL_NUM_TO_RENDER,
  STRUCTURE_TAB_NAV_HEIGHT,
  UI_LITTEN_CARD_HEIGHT,
} from 'utils/constants'

const SearchResults: (args: any) => React$Node = ({
  handleOnRefresh,
  handleTooltipRefresh,
  initialNumToRender,
  isLoading,
  isLoadingMore,
  isRefreshing,
  littens,
  onEndReached,
  onEndReachedThreshold,
  onScroll,
}) => {
  const withPaddingBottom = usePaddingBottom()

  const [isFavourite, toggleFavourite] = useFavouriteFn()

  const hasItems = useMemo(() => littens.length > 0, [littens.length])

  const getItemLayout = useCallback(
    (data, index) => ({
      length: UI_LITTEN_CARD_HEIGHT,
      offset: UI_LITTEN_CARD_HEIGHT * index,
      index,
    }),
    [],
  )

  const ListEmptyComponent = useMemo(
    () => <SearchEmptyResults handleTooltipRefresh={handleTooltipRefresh} />,
    [handleTooltipRefresh],
  )

  const ListFooterComponent = useMemo(
    () => <BottomLoader active={isLoadingMore} />,
    [isLoadingMore],
  )

  const renderItem = useCallback(
    ({ item: { distance, user, ...litten } }) => (
      <LittenDumbCard
        onPressAction={toggleFavourite}
        isFavourite={isFavourite(litten)}
        item={{ distance, litten, user }}
      />
    ),
    [isFavourite, toggleFavourite],
  )

  return (
    <View style={styles.resultsContainer}>
      <FlatList
        data={littens}
        renderItem={renderItem}
        ListHeaderComponent={SearchHeaderResults}
        ListEmptyComponent={ListEmptyComponent}
        refreshing={isRefreshing}
        onRefresh={handleOnRefresh}
        contentContainerStyle={[styles.contentContainer, withPaddingBottom]}
        getItemLayout={getItemLayout}
        bounces={hasItems}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        initialNumToRender={SEARCH_INITIAL_NUM_TO_RENDER}
        ListFooterComponent={ListFooterComponent}
        ListFooterComponentStyle={ListFooterComponentStyle}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  resultsContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: STRUCTURE_TAB_NAV_HEIGHT,
  },
})

export default SearchResults