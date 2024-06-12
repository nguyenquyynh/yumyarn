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
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}>
                    <Pressable height={'100%'}>
                    </Pressable>
                    <View flex center absF padding-x>
                        <View padding-xx bg-white style={styles.viewModal} br20>
                            {children || (
                                <View style={props}>
                                    <View row centerV style={styles.title}>
                                        <IconApp props={{ marginRight: 20 }} assetName={asseticon} size={30} />
                                        <Text xviText style={styles.title}>{title}</Text>
                                    </View>
                                    <View padding-xx>
                                        <Text>{content}</Text>
                                    </View>
                                    <View row>
                                        {funt && <ButtonApp props={styles.button_model} title={t("title_model.ok")} onclick={funt}/>}
                                        <ButtonApp onclick={() => {modalhiden(false)}} props={styles.button_model} outline={1} color={Colors.black} background={Colors.white} title={funt ? t("title_model.cancel") : t("title_model.ok")}/>
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
    },
    button_model:{
        flex: 1,
        margin: 5
    }
})