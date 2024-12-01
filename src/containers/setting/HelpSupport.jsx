import { StyleSheet, ScrollView, FlatList, LayoutAnimation, TextInput, ToastAndroid, RefreshControl, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon, Text, TextArea, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import { createHelp, getHelp } from 'src/hooks/api/post'
import HelpItem from 'components/commons/HelpItem'
import { isCleanContent } from 'src/middleware/contentmiddleware'

const HelpSupport = () => {
  const navigation = useNavigation()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [open, setopen] = useState(false)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const resault = await getHelp({ page: page, limit: 10 })
      if (resault.status) {
        setData(resault.data)
      }
    }
    getData()
  }, [])

  const loadMore = async () => {
    if (!page) return;

    const resault = await getHelp({ page: page + 1, limit: 10 })
    if (resault.status) {
      setContent('')
      if (resault.data.length < 10) {
        setPage(null)
      } else {
        setPage(page + 1)
      }
      setData(prev => ([...prev, ...resault.data]))
    }
  }

  const renderItem = ({ item }) => { // Wrap in a component or separate function
    return <HelpItem item={item} />;  // Pass item as a prop
  };

  const onPress = async () => {
    if (!open) {
      setopen(true)
      LayoutAnimation.easeInEaseOut()
      return
    }
    // Send request
    if (!isCleanContent(content) || !content) {
      setopen(!open)
      LayoutAnimation.easeInEaseOut()
      return 
    };

    const resault = await createHelp({ content: content })

    if (resault) {
      ToastAndroid.show(t("pack.send_success"), ToastAndroid.SHORT)
      setData(prev => ([resault.data, ...prev]))
    } else {
      ToastAndroid.show(t("pack.send_faild"), ToastAndroid.SHORT)
    }
    setopen(false)
    LayoutAnimation.easeInEaseOut()
  }

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.help")}>
      <View flex bg-white padding-10>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("pack.create")}</Text>
          {!open && <Text style={styles.sectionDescription}>
            {t("pack.create_desription")}
          </Text>}
          {open && <TextInput
            autoFocus
            style={[styles.input, styles.storyInput]}
            value={content}
            onChangeText={setContent}
            placeholder={t("pack.desrition")}
            placeholderTextColor={'gray'}
            multiline
          />

          }
          <TouchableOpacity style={styles.createButton} onPress={onPress}>
            <Text style={styles.createButtonText}>{open ? 'Send' : '+ Create'}</Text>
          </TouchableOpacity>
        </View>
        <Text text70BO marginT-10>{t("pack.request")}</Text>
        {data &&
          <FlatList
            data={data}
            renderItem={renderItem}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => {
              return (
                <>
                  {loading && (
                    <ActivityIndicator
                      style={{ marginBottom: 50 }}
                      size="large"
                      color="#0000ff"
                    />
                  )}
                  <View height={50} />
                </>
              );
            }}
          />
        }
      </View>
    </Wapper>
  )
}

export default HelpSupport

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: 'black'
  },
  storyInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
})