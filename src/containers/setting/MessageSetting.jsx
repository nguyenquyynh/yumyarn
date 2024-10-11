import { StyleSheet } from 'react-native'
import React,{ useState } from 'react'
import { Switch, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'

const MessageSetting = () => {
    const navigation = useNavigation()

    const [receiveMessages, setReceiveMessages] = useState(true); // Default "Mọi người" option enabled
    const [activeStatus, setActiveStatus] = useState(false); // Trạng thái hoạt động
    const [readStatus, setReadStatus] = useState(true); // Trạng thái đọc
    return (
        <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.setting_message")}>
            <View flex bg-white>
                <View style={styles.container}>
                    {/* Cho phép nhận tin nhắn */}
                    <View style={styles.optionContainer}>
                        <Text style={styles.optionTitle}>Cho phép nhận tin nhắn</Text>
                        <TouchableOpacity style={styles.selectBox}>
                            <Text style={styles.selectText}>Mọi người</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Trạng thái hoạt động */}
                    <View style={styles.optionContainer}>
                        <Text style={styles.optionTitle}>Trạng thái hoạt động</Text>
                        <Switch
                            value={activeStatus}
                            onValueChange={(value) => setActiveStatus(value)}
                        />
                    </View>

                    {/* Trạng thái đọc */}
                    <View style={styles.optionContainer}>
                        <Text style={styles.optionTitle}>Trạng thái đọc</Text>
                        <Switch
                            value={readStatus}
                            onValueChange={(value) => setReadStatus(value)}
                        />
                    </View>
                    <Text style={styles.infoText}>
                        Mọi người có thể biết khi nào bạn đọc tin nhắn của họ, nhưng chỉ biết khi cả bạn và họ đều bật tính năng này.
                    </Text>
                </View>

            </View>
        </Wapper>
    )
}
export default MessageSetting

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
      },
      optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
      },
      optionTitle: {
        fontSize: 16,
        fontWeight: '500',
      },
      selectBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        backgroundColor: '#f0f0f0',
      },
      selectText: {
        fontSize: 16,
      },
      infoText: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
      },
})