import { StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { Icon, Image, Text, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'

const Policy = () => {
    const navigation = useNavigation()
    return (
        <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.privacy_policy")}>
            <ScrollView>
                <View flex bg-white>
                    <View style={styles.vienlon}>
                        <Text style={styles.textt}>Chú thích</Text>
                        <View flex style={styles.rim}>
                            <Icon assetName='dot' style={styles.ciercle} />
                            <Text>Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, chia sẻ dữ liệu cá nhân của bạn khi bạn sử dụng các dịch vụ được cung cấp trên các trang web và ứng dụng của chúng tôi hoặc tương tác với chúng tôi. Dữ liệu cá nhân là bất kỳ thông tin nào về bạn mà bạn có thể được nhận dạng hoặc có thể nhận dạng được. Điều này có thể bao gồm các thông tin như:
                                Tên, ngày sinh, địa chỉ email, địa chỉ bưu điện, số điện thoại, số điện thoại di động, chi tiết tài chính, chẳng hạn như thẻ thanh toán mà bạn sử dụng để mua sản phẩm…
                            </Text>
                        </View>
                        <View flex style={styles.rim}>
                            <Icon assetName='dot' style={styles.ciercle} />
                            <Text>
                                Thông tin về thiết bị của bạn (chẳng hạn như địa chỉ IP, là mã số để xác định thiết bị của bạn có thể cung cấp thông tin về quốc gia, khu vực hoặc thành phố nơi bạn ở)
                                Thông tin liên quan đến cách bạn sử dụng và tương tác với các trang web, ứng dụng và dịch vụ của chúng tôi. Đôi khi các trang web và ứng dụng của chúng tôi có thể chứa các liên kết đến các trang web và dịch vụ không thuộc nhóm dịch vụ của báo Thanh Niên. Các trang web và dịch vụ này có chính sách bảo mật của riêng họ. Nếu bạn nhấp vào liên kết đến các trang web và ứng dụng không phải của báo Thanh Niên, bạn nên đọc chính sách bảo mật được hiển thị trên trang web của họ. </Text>
                        </View>
                    </View>
                    <View style={styles.vienlon}>
                        <Text style={styles.textt}>Khi bạn đăng ký tài khoản báo Thanh Niên trên YumYarn, chúng tôi thu thập:</Text>
                        <View flex style={styles.rim}>
                            <Icon assetName='dot' style={styles.ciercle} />
                            <Text>Tên của bạn</Text>
                        </View>
                        <View flex style={styles.rim}>
                            <Icon assetName='dot' style={styles.ciercle} />
                            <Text>Địa chỉ email của bạn</Text>
                        </View>
                        <View flex style={styles.rim}>
                            <Icon assetName='dot' style={styles.ciercle} />
                            <Text>Các chi tiết khác như địa chỉ cư trú hoặc địa chỉ thanh toán của bạn khi bạn đăng ký thành viên hoặc đăng ký</Text>
                        </View>
                        <View flex style={styles.rim}>
                            <Icon assetName='dot' style={styles.ciercle} />
                            <Text>Ảnh của bạn, nếu bạn thêm một bức ảnh vào trang hồ sơ của mình</Text>
                        </View>
                        <View flex style={styles.rim}>
                            <Icon assetName='dot' style={styles.ciercle} />
                            <Text>Địa chỉ IP của bạn - một mã số để xác định thiết bị của bạn, cùng với quốc gia, khu vực hoặc thành phố nơi bạn ở</Text>
                        </View>
                        <View flex style={styles.rim}>
                            <Icon assetName='dot' style={styles.ciercle} />
                            <Text>Thông tin về cách bạn tương tác với các dịch vụ của chúng tôi</Text>
                        </View>
                    </View>
                    <View style={styles.vienlon}>
                        <Text style={styles.textt}>Các loại dữ liệu cá nhân chúng tôi thu thập về bạn:</Text>
                        <View flex style={styles.rim}>
                            <Icon assetName='dot' style={styles.ciercle} />
                            <Text>Chúng tôi thu thập dữ liệu cá nhân của bạn khi bạn truy cập các trang web và ứng dụng của chúng tôi, đăng ký sản phẩm hoặc dịch vụ, đóng góp cho báo Thanh Niên hoặc khi bạn tương tác với chúng tôi. Chúng tôi sẽ chỉ thu thập dữ liệu cá nhân của bạn theo luật hiện hành. Chúng tôi thu thập dữ liệu cá nhân của bạn theo nhiều cách khác nhau:
                                Trực tiếp từ bạn, khi bạn đăng ký dịch vụ của chúng tôi và khi bạn duyệt các trang web của chúng tôi hoặc sử dụng các ứng dụng của chúng tôi
                                Dữ liệu cá nhân chúng tôi tạo ra về bạn, ví dụ: dữ liệu cá nhân mà chúng tôi sử dụng để xác thực bạn hoặc dữ liệu cá nhân ở dạng địa chỉ IP của bạn hoặc tùy chọn của bạn
                                Dữ liệu cá nhân mà chúng tôi thu thập từ các bên thứ ba, ví dụ: dữ liệu cá nhân giúp chúng tôi chống gian lận hoặc chúng tôi thu thập, với sự cho phép của bạn, khi bạn tương tác với các tài khoản mạng xã hội của mình
                            </Text>
                        </View>
                    </View>
                    
                </View>
            </ScrollView>

        </Wapper>
    )
}

export default Policy

const styles = StyleSheet.create({
    vienlon: {
        paddingHorizontal: 20,
        marginRight: 20
    },
    textt: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold'
    },
    rim: {
        marginTop: 10,
        flexDirection: 'row',
    },
    ciercle: {
        marginTop: 5,
        width: 10,
        height: 10,
        marginRight: 10
    }
})