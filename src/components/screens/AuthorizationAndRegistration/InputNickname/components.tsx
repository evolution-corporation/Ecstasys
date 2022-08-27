import React, { FC, ElementRef, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

import Tools from "~core";

import NicknameBase, {
  Props as NicknameBaseProps,
  Ref as NicknameBaseRef,
} from "~components/dump/NicknameInput/NicknameBase";

import { useGenerateUniqueNickname } from "~modules/account/hook";

export const NicknameWithVariable: FC<NicknameWithVariableProps> = (props) => {
  const { variableNicknameList } = props;
  const { nicknameVariableList, setNickname } = useGenerateUniqueNickname();
  const _nickname = useRef<{ nickname: string; permission: boolean } | null>(
    null
  );
  const NicknameBaseRef = useRef<ElementRef<typeof NicknameBase>>(null);
  return (
    <>
      <NicknameBase
        ref={NicknameBaseRef}
        onEndChange={(nickname, statusCheck) => {
          setNickname(statusCheck === "USED" ? nickname : null).catch(
            console.error
          );
          _nickname.current = {
            nickname: nickname,
            permission: statusCheck === "FREE",
          };
        }}
      />
      {nicknameVariableList.length > 0 && (
        <View style={[styles.variableNicknameList, variableNicknameList]}>
          {nicknameVariableList.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.variableNicknameRow,
                index < nicknameVariableList.length - 1
                  ? styles.separator
                  : null,
              ]}
              key={index}
              onPress={() => {
                NicknameBaseRef.current?.editNickname(item);
              }}
            >
              <Text style={styles.variableNicknameText}>{item}</Text>
              <Entypo name="check" size={24} color="green" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  variableNicknameList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  variableNicknameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 10,
  },
  variableNicknameText: {
    color: "#555555",
    fontSize: 13,
    lineHeight: 16,
    ...Tools.gStyle.font("400"),
  },
  separator: {
    borderBottomWidth: 1,
    width: "100%",
    borderColor: "#C2A9CE",
  },
});

export interface NicknameWithVariableProps extends NicknameBaseProps {
  variableNicknameList?: ViewProps;
}
