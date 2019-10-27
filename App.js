import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, Linking } from 'react-native';
import moment from 'moment';
import { Card, Button, Icon } from 'react-native-elements';


export default function App() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasErrored, setHasApiError] = useState(false);
  const onPress = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URL: ${url}`);
      }
    });
  };
  const renderArticleItem = ({ item }) => {
    return (
      <Card title={item.title} image={{ uri: item.urlToImage }}>
        <View style={styles.row}>
          <Text style={styles.label}>Source</Text>
          <Text style={styles.info}>{item.source.name}</Text>
        </View>
        <Text style={{ marginBottom: 10 }}>{item.content}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Published</Text>
          <Text style={styles.info}>
            {moment(item.publishedAt).format('LLL')}
          </Text>
        </View>
        <Button onPress={() => onPress(item.url)} icon={<Icon />} title="Read more" backgroundColor="#03A9F4" />
      </Card>
    );
  };

  const filterForUniqueArticles = arr => {
    const cleaned = [];
    arr.forEach(itm => {
      let unique = true;
      cleaned.forEach(itm2 => {
        const isEqual = JSON.stringify(itm) === JSON.stringify(itm2);
        if (isEqual) unique = false;
      });
      if (unique) cleaned.push(itm);
    });
    return cleaned;
  };

  const getNews = async () => {
    try {
      console.log('getNews function firing');
      const response = await fetch(
        'https://newsapi.org/v2/top-headlines?country=us&apiKey=1317d14ea8d247bfbd9f1191df6ae0bb'
      );
      console.log('response', response);
      const jsonData = await response.json();
      const newArticleList = filterForUniqueArticles(
        articles.concat(jsonData.articles)
      );
      setArticles(newArticleList);
      setPageNumber(pageNumber + 1);
    } catch (error) {
      setHasApiError(true);
    }
    setLoading(false);
  };


  useEffect(() => {
    getNews();
  }, []);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" loading={loading} />
      </View>
    );
  }
  if (hasErrored) {
    return (
      <View style={styles.container}>
        <Text>Error =(</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Articles Count:</Text>
        <Text style={styles.info}>{articles.length}</Text>
      </View>
      <FlatList ListFooterComponent={<ActivityIndicator size="large" loading={loading} />}
        onEndReached={getNews}
        onEndReachedThreshold={1}
        data={articles}
        renderItem={renderArticleItem}
        keyExtractor={item => item.title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerFlex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  header: {
    height: 30,
    width: '100%',
    backgroundColor: 'pink'
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold'
  },
  info: {
    fontSize: 16,
    color: 'grey'
  }
});