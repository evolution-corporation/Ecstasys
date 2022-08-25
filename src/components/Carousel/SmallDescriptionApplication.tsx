import { FC, useRef, useState } from "react";
import {
  StyleSheet,
  ViewProps,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import gStyles, { colors } from "~styles";
import i18n from "~i18n";

const SmallDescriptionApplication: FC<Props> = (props) => {
  const { fullScreen = true } = props;
  const maxHeightText = useRef<number>(0);
  const [heightComponent, setHeightComponent] = useState<number | null>(null);
  const windowSize = useWindowDimensions();

  return (
    <View
      style={[
        styles.background,
        props.style,
        heightComponent ? { height: heightComponent } : null,
        fullScreen ? { width: windowSize.width } : { width: 250 },
      ]}
    >
      <Swiper
        horizontal={true}
        loop={true}
        autoplay={true}
        width={fullScreen ? windowSize.width : 250}
        dotColor={"#816EBD"}
        activeDotColor={"#FFFFFF"}
        showsPagination={true}
        paginationStyle={styles.pagination}
        autoplayTimeout={10}
      >
        {[
          i18n.t("2c4c4afe-0269-4eea-980b-8d73963b8d35"),
          "text 2",
          "text, 3",
          "text 4",
        ].map((item, index) => (
          <View key={index.toString()} style={styles.textWrapper}>
            <Text
              style={styles.textCarousel}
              onLayout={({ nativeEvent: { layout } }) => {
                if (layout.height > maxHeightText.current) {
                  maxHeightText.current = layout.height;
                  setHeightComponent(layout.height + 30);
                }
              }}
            >
              {item}
            </Text>
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textWrapper: {
    width: 250,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  pagination: {
    justifyContent: "flex-start",
  },
  textCarousel: {
    color: "#FFFFFF",
    textAlign: "left",
    textAlignVertical: "center",
    fontSize: 16,
    ...gStyles.getFontOption("400"),
    paddingBottom: 12,
  },
});

interface Props extends ViewProps {
  fullScreen?: boolean;
}

export default SmallDescriptionApplication;
