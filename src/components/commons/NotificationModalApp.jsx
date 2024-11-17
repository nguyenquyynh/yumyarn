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
    cancel = true,
    children,
    props
}) => {
    return (
        <Modal
            statusBarTranslucent
            animationType="fade"
            transparent={true}
            visible={modalVisible}>
            <View flex absF>{modalVisible &&
                <View flex bg-tr_black >
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
                                    <View centerV row spread>
                                        {cancel && <TouchableOpacity flex-1 marginV-5 center br10 bg-white style={[styles.button_model, { borderColor: Colors.yellow, marginRight: 10}]} onPress={() => modalhiden(false)}>
                                            <Text text70BO color={Colors.yellow}>{t("title_model.cancel")}</Text>
                                        </TouchableOpacity>}
                                        {funt && <TouchableOpacity flex-1 marginV-5 center br10 bg-yellow style={[styles.button_model, { borderColor: Colors.yellow, marginLeft: 10}]} onPress={funt}>
                                            <Text text70BO color='white'>{t("title_model.ok")}</Text>
                                        </TouchableOpacity>}
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                </View>
            }
            </View>
        </Modal>
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
    },
    viewModal: {
        width: '90%'
    }
})