import React, { useState, useEffect, Component } from 'react';
import { Button, View, FlatList, Image, StyleSheet, TouchableHighlight, Text, TouchableOpacity } from 'react-native';
import { ListItem, Avatar, Header } from 'react-native-elements';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

const bs = React.createRef();
const fall = new Animated.Value(1);

class Wish extends Component {

  constructor(props) {
    super(props)
    this.state = {
      Data: [],
      UserId: global.userId,
      bookId: '',
      sellerName: '',
      sellerId: '',
      sellerimg: ''
    }
    this.GetuserWishlist();
  }


  GetuserWishlist() {
    //console.log(this.state.UserId);
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        this.setState({ Data: data })


      }
    };

    request.open('GET', 'http://10.0.2.2:80/Api/wish.php?userId=' + global.userId);
    request.send();

  }

  removeFromWishlist() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        this.GetuserWishlist();
      }
    };

    request.open('GET', 'http://10.0.2.2:80/Api/wish.php?userId=' + global.userId + '&bookid=' + this.state.bookId);
    request.send();
  }

  renderItem({ item }) {
    // console.log(item)
    return (
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => this.props.navigation.navigate('BookShow', { BookIDid: item.B_id, img: item.img, })}
        onLongPress={() => {
          this.setState({ bookId: item.B_id })
          this.setState({ sellerId: item.sellerId })
          this.setState({ sellerName: item.sellerName })
          this.setState({ sellerimg: item.sellerimg })
          bs.current.snapTo(0)
        }}>
        <ListItem bottomDivider containerStyle={{ marginTop: 5, marginBottom: 5 }} >

          <Image
            style={styels.img}
            source={{ uri: item.img }}>
          </Image>
          <ListItem.Content>
            <ListItem.Title>{item.BookName}</ListItem.Title>
            <ListItem.Subtitle>By: {item.Aurthor}. </ListItem.Subtitle>
            <ListItem.Subtitle>Price: {item.Price}$ </ListItem.Subtitle>
          </ListItem.Content>

        </ListItem>
      </TouchableHighlight>
    )
  }


  renderInner() {
    return (
      <View style={styels.panel}>
        <TouchableOpacity style={styels.panelButton}
          onPress={() => {
            this.props.navigation.navigate('Sendmessage', {
              sellerId: this.state.sellerId,
              sellerName: this.state.sellerName,
              sellerimg: this.state.sellerimg
            })
            bs.current.snapTo(1);
          }}
        >
          <Text style={styels.panelButtonTitle}>Send message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styels.panelButton}
          onPress={() => {
            this.removeFromWishlist();
            bs.current.snapTo(1);
          }}
        >
          <Text style={styels.panelButtonTitle}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styels.panelButton}
          onPress={() => bs.current.snapTo(1)}>
          <Text style={styels.panelButtonTitle}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={styels.header}>
        <View style={styels.panelHeader}>
          <View style={styels.panelHandle} />
        </View>
      </View>
    );
  }


  render() {
    if (this.state.Data.length != 0) {
      return (
        <View style={{ flex: 1 }}>
          <Header backgroundColor={'#08d4c4'}
            leftComponent={() => <Icon name={'arrow-back-outline'} color={'#fff'} size={30}
              onPress={() => this.props.navigation.pop()}
            />}
            centerComponent={{ text: 'Wish list', style: { color: '#fff', fontSize: 24, fontWeight: 'bold' } }}

          />
          <FlatList
            data={this.state.Data}
            renderItem={item => this.renderItem(item)}
            keyExtractor={item => item.B_id.toString()} />



          <BottomSheet
            ref={bs}
            snapPoints={[260, 0]}
            renderContent={this.renderInner.bind(this)}
            renderHeader={this.renderHeader.bind(this)}
            initialSnap={1}
            callbackNode={fall}
            enabledGestureInteraction={true}
          />
          <Animated.View style={{
            margin: 20,
            opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
          }}>

          </Animated.View>
        </View>

      )
    }
    else {
      return (
        <View style={{ flex: 1 }}>
            <Header backgroundColor={'#08d4c4'}
              leftComponent={() => <Icon name={'arrow-back-outline'} color={'#fff'} size={30}
                onPress={() => this.props.navigation.pop()}
              />}
              centerComponent={{ text: 'Wish list', style: { color: '#fff', fontSize: 24, fontWeight: 'bold' } }}
            />
           <View style={{justifyContent:'center', alignItems:'center',flex:1}}>
            <Text style={{fontSize:24,fontWeight:'bold'}} >
              The wish list is empty
            </Text>
          </View>
        </View>
      )
    }
  }

}
const styels = StyleSheet.create({
  img: {
    width: 50,
    height: 50,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 15,
  },

  header: {
    backgroundColor: '#FFFFFF',
    shadowRadius: 2,
    height: 50,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomColor: '#fff'
  },
  panelHeader: {
    alignItems: 'center',
    borderBottomColor: '#fff'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#08d4c4',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
})
export default Wish


