import { StyleSheet, FlatList, Text } from 'react-native'
import React from 'react'
import { Image, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'

// Dữ liệu giả lập cho lịch sử giao dịch
const transactionData = [
  {
    id: '1',
    packageName: 'Premium Plan',
    amount: '$10.99',
    purchaseDate: '2024-09-15',
    purchaseTime: '14:35',
  },
  {
    id: '2',
    packageName: 'Basic Plan',
    amount: '$4.99',
    purchaseDate: '2024-08-20',
    purchaseTime: '09:10',
  },
  {
    id: '3',
    packageName: 'Pro Plan',
    amount: '$19.99',
    purchaseDate: '2024-07-01',
    purchaseTime: '18:45',
  }
]

const Payment = () => {
  const navigation = useNavigation()

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionContent}>
        <Text style={styles.packageName}>{item.packageName}</Text>
        <Text style={styles.amount}>- {item.amount}</Text>
        <Text style={styles.dateTime}>{t('purchase.date')}: {item.purchaseDate}</Text>
        <Text style={styles.dateTime}>{t('purchase.time')}: {item.purchaseTime}</Text>
      </View>
      <View style={styles.divider}></View>
    </View>
  )

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.payment")}>
      <View flex bg-white>
        <FlatList
          data={transactionData}  // Dữ liệu giao dịch
          keyExtractor={item => item.id}  // Mỗi giao dịch có một key duy nhất
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
