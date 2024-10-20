import { Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Colors, Modal, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import IconApp from 'components/IconApp'
import { t } from 'lang'
import ButtonApp from 'components/ButtonApp'

const NotificationModalApp = ({
    modalVisible = true,
    modalhiden,
    asseticon,
    title,
    content,
    funt,
    children,
    props
}) => {
    return (
        <View flex absF>{modalVisible &&
            <View flex bg-tr_black >
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}>
                    <Pressable height={'100%'}>
                    </Pressable>
                    <View flex center absF padding-x>
                        <View padding-xx bg-white style={styles.viewModal} br20>
                            {children || (
                                <View centerH>
                                    <IconApp assetName={asseticon} size={70} />
                                    <Text xviText style={styles.title}>{title}</Text>
                                    <View padding-xx centerH>
                                        <Text center styles={{ textAlign: 'center' }}>{content}</Text>
                                    </View>
                                    <View centerH row>
                                        {funt && <TouchableOpacity flex-1 marginV-5 center br10 bg-yellow style={[styles.button_model, {borderColor: Colors.yellow}]} onPress={funt}>
                                            <Text text70BO color='white'>{t("title_model.ok")}</Text>
                                        </TouchableOpacity>}
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        }
        </View>

    )
}
export default NotificationModalApp

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    button_model: {
        padding: 10,
        elevation: 5,
        borderWidth: 1,
    }
})