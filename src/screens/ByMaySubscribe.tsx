import React from 'react'
import { View, Pressable, Text, Image } from "react-native"
import i18n from '~i18n'
import { RootScreenProps } from '~types'
import gStyle from "~styles"
import { ColorButton } from '~components/dump'
import Close from "assets/Menu/Close_MD.svg"

const ByMaySubscribe: RootScreenProps<"ByMaySubscribe"> = ({ navigation }) => {

    return (
            <Pressable style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" , justifyContent: 'center', alignItems: 'center', padding: 20 }} onPress={() => {navigation.goBack()}}>
            <View style={{ backgroundColor: '#FFF', borderRadius: 20, alignItems: 'center', paddingHorizontal: 39, paddingTop: 47, paddingBottom: 30, width: '100%' }}>
                <Pressable style={{ position: 'absolute', top: 10, right: 10 }} onPress={() => {navigation.goBack()}}>
                    <Close />
                </Pressable>
                <Text style={{ color: "#3D3D3D", fontSize: 20, ...gStyle.font("700"), textAlign: 'center', marginBottom: 24, width: '90%' }}>
                    {i18n.t('c6422cd6-c99d-4bbb-a537-238e5e751c01')}
                </Text>
                <Text style={{ color: "rgba(64, 64, 64, 0.71)", fontSize: 14, ...gStyle.font("400"), textAlign: 'center' }}>
                    {i18n.t('e505cf76-d64a-4152-86b0-f81b41c9035f')}
                </Text>
                <Image source={require('assets/sofaMan.png')} style={{ height: 90, width: '100%', marginVertical: 19 }} resizeMode={'center'}/>
                <Text style={{ color: "#9765A8", fontSize: 16, ...gStyle.font('500'), textAlign: 'center', width: 161 }}>
                    <Text style={{ ...gStyle.font('400') }}>{i18n.t('e9abbcbe-6d0b-46b6-a777-dc3e73a3dbac')}</Text>{' '}
                    {i18n.t('3d2b0890-e1e2-4abe-9fa1-a2bc531e38b6')}
                </Text>
                <ColorButton styleButton={{ backgroundColor: "#C2A9CE", paddingHorizontal: 25, marginTop: 48 }} styleText={{ color: '#FFF' }} onPress={() => {navigation.navigate('SelectSubscribe')}}>
                {i18n.t('Arrange')}
                </ColorButton>
            </View>
            </Pressable>
    )
}

export default ByMaySubscribe