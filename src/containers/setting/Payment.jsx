import { StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon, Image, Text, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import { getHistoryPayment } from 'src/hooks/api/post'
import { HistoryPack } from 'configs/ui/money'
import { millisecondsToDate } from 'configs/ui/time'
import LinearGradient from 'react-native-linear-gradient'

const Payment = () => {
  const navigation = useNavigation()
  const [data, setData] = useState([])

  const loadHistory = async () => {
    await getHistoryPayment()
      .then(resault => setData(resault.data)
      )
      .catch(err => console.log(err)
      )
  }
  useEffect(() => {
    loadHistory()
  }, [])

  const renderTransactionItem = ({ item }) => {
    const layout = HistoryPack(parseFloat(item?.cost))
    return (
      <LinearGradient
        colors={[layout.color + '99', '#ffffff']} // Replace with your desired colors
        start={{ x: 0, y: 0 }} // Start from the left
        end={{ x: 1, y: 0 }} // End at the right
        style={styles.transactionItem}>
        <View style={styles.transactionContent}>
          <Text style={styles.packageName}>{t(layout.title)}</Text>
          <Text style={styles.amount} text65BO>- {item.cost}</Text>
          <Text style={styles.dateTime}>{t('pack.date')}: {millisecondsToDate(item?.create_at)}</Text>
          <Text style={styles.dateTime}>{t('pack.code')}: {item.code}</Text>
        </View>
        <Icon
          assetName='logoapp' // Thay đổi tên icon theo ý muốn
          size={30}
          style={styles.icon} // Sử dụng style riêng cho icon
        />
      </LinearGradient>
    )
  }

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.payment")}>
      <View flex bg-white>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}  // Dữ liệu giao dịch
          keyExtractor={(item) => item._di}  // Mỗi giao dịch có một key duy nhất
          renderItem={renderTransactionItem}  // Hàm render từng mục
          contentContainerStyle={styles.transactionList}  // Phong cách chung cho danh sách
        />
      </View>
    </Wapper>
  )
}

export default Payment

const styles = StyleSheet.create({
  transactionList: {
    paddingVertical: 10,
  },
  transactionItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 1,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    bottom: 0, // Cách từ dưới lên
    right: 0,  // Cách từ bên phải vào
  },
  transactionContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  amount: {
    fontSize: 16,
    color: '#d9534f',  // Màu đỏ để làm nổi bật số tiền bị trừ
    marginVertical: 5,
  },
  dateTime: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,  // Khoảng cách phía trên và dưới logo
  },
  logo: {
    width: 100,  // Chiều rộng của logo
    height: 100,  // Chiều cao của logo
    resizeMode: 'contain',  // Đảm bảo logo không bị méo
  },
})
