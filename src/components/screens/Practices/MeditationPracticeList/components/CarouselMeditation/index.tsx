import React, {
  FC,
  LegacyRef,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ViewProps,
  ImageBackground,
  Dimensions,
  ViewToken,
  ViewabilityConfig,
} from "react-native";
import Animated from "react-native-reanimated";
import { MeditationType } from "~modules/meditation";
import { FavoriteMeditation } from "~components/dump";
import Tools from "~core";

import useAnimation from "./animated";

const CarouselMeditation: FC<CarouselMeditationProps> = (props) => {
  const {
    data,
    widthComponent = Dimensions.get("screen").width,
    style,
    onChange,
    initialIndex = 0,
  } = props;
  const [SelectedIndex, setSelectedIndex] = useState<number>(0);
  const {
    listAnimatedStyle,
    onEndAnimationScrollData,
    onStartAnimationScrollData,
    onMiddleAnimationScrollData,
  } = useAnimation(data.length, {
    initIndex: initialIndex,
    imageHeigth: styles.image.height,

    translatyX: 25,
  });

  const _viewabilityConfig = useRef<ViewabilityConfig>({
    itemVisiblePercentThreshold: 90,
    waitForInteraction: false,
  }).current;

  const refFlatlist = useRef<FlatList>(null);

  const _onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const mediumIndex = Math.floor(viewableItems.length / 2);
        if (viewableItems[mediumIndex].index !== null) {
          onEndAnimationScrollData(viewableItems[mediumIndex].index ?? 0);
          setSelectedIndex(viewableItems[mediumIndex].index ?? 0);
        }
      } else {
        onMiddleAnimationScrollData();
      }
    }
  ).current;

  useEffect(() => {
    if (onChange) onChange(data[SelectedIndex], false);
  }, [onChange]);

  return (
    <FlatList
      data={data}
      ref={refFlatlist}
      horizontal={true}
      keyExtractor={(item) => item.id}
      initialScrollIndex={
        initialIndex > 0 && data.length > 2 ? initialIndex : 0
      }
      onLayout={() => {
        refFlatlist.current?.scrollToIndex({
          index: initialIndex > 0 && data.length > 2 ? initialIndex : 0,
          viewOffset: (Dimensions.get("window").width - widthComponent) / 2,
        });
      }}
      renderItem={({ item, index }) => (
        <Animated.View
          style={[
            styles.backgroundCard,
            {
              width: widthComponent,
            },
            listAnimatedStyle[index],
          ]}
        >
          <ImageBackground source={{ uri: item.image }} style={[styles.image]}>
            <View style={styles.imageFooter}>
              <Text style={styles.audioLength}>
                {Tools.i18n.t("minute", {
                  count: Math.floor(item.lengthAudio / 60000),
                })}
              </Text>
              <FavoriteMeditation
                idMeditation={item.id}
                displayWhenNotFavorite
              />
            </View>
          </ImageBackground>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      )}
      viewabilityConfig={_viewabilityConfig}
      onViewableItemsChanged={_onViewableItemsChanged}
      disableIntervalMomentum={false}
      snapToInterval={widthComponent}
      style={style}
      onScrollBeginDrag={() => {
        if (onChange) {
          onChange(null, true);
        }
        onStartAnimationScrollData();
      }}
      contentContainerStyle={{
        paddingHorizontal:
          (Dimensions.get("window").width - widthComponent) / 2,
      }}
      onScrollEndDrag={() => {
        if (onChange) {
          onChange(data[SelectedIndex], false);
        }
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
};

interface CarouselMeditationProps extends ViewProps {
  data: MeditationType[];
  widthComponent?: number;
  onChange?: (meditation: MeditationType | null, isSelects: boolean) => void;
  initialIndex?: number;
}

const styles = StyleSheet.create({
  backgroundCard: {
    alignItems: "center",
    marginHorizontal: 0,
  },
  image: {
    width: 254,
    height: 277,
    borderRadius: 28,
    ...Tools.gStyle.shadows(2, 3),
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingBottom: 18,
    justifyContent: "flex-end",
  },
  imageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  audioLength: {
    color: "#FFFFFF",
  },
  name: {
    color: "#3D3D3D",
    fontSize: 24,
    ...Tools.gStyle.font("700"),
    marginTop: 24,
    marginBottom: 11,
    maxWidth: 223,
    textAlign: "center",
  },
  description: {
    color: "rgba(64, 64, 64, 0.71)",
    fontSize: 13,
    ...Tools.gStyle.font("400"),
    maxWidth: 200,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default CarouselMeditation;
{
  /* <View style={styles.informationMeditation}>
              <Text style={styles.name}>{meditationData.name}</Text>
              <Text style={styles.description}>
                {meditationData.description}
              </Text>
            </View>
            <ColorButton
              styleButton={styles.buttonStyle}
              styleText={styles.buttonStyleText}
            >
              {Tools.i18n.t("38554780-274e-4802-9d07-fd4332c7a29d")}
            </ColorButton> */
}
