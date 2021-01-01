import React, {Component} from 'react';
import { View, Text, StyleSheet, StatusBar,ScrollView ,SafeAreaView, TouchableOpacity,Alert} from 'react-native';
import {CheckBox } from 'react-native-elements';
import RadioButtonRN from 'radio-buttons-react-native';
import LinearGradient from 'react-native-linear-gradient';
//global.userId   is used to get user Id


export default class filter extends Component {
  
  constructor(props){
    super(props);
   this.state={
    uniqueValue: 1,
    selectedRadio:null,
    categories: [],
    CheckedBox:[],
   }
   this.getCategories();
  }


  getCategories() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        var obj=[];
        for(let i=0;i<data.length;i++){
        obj.push({
         key:i,
         cheak:false,
         value: data[i].Category,
       });
        }

       this.setState({categories:obj})

      }

    };

    request.open('GET', 'http://10.0.2.2:80/Api/getCategories.php');
    request.send();

  }

  render() {
    const sort_by = [
      {
        label: 'Price- Low to high'
       },
       {
        label: 'Price- High to low'
       },
       {
        label: 'Alphabetical'
       },
       {
        label: 'Newest first'
       },
       {
        label: 'Oldest first'
       },
      ];


   const myloop  = this.state.categories.map((item) =>
    <View style={{width: 160, height: 50}} key={item.key}>
   <CheckBox
    title={item.value}
    checkedColor='#08d4c4'
    checked={item.cheak}
    onPress={()=>{
      let arr=item;
      arr.cheak=!item.cheak;
      this.setState({item:arr}, () => {
        console.log(item);
      }); 
      if(item.cheak==true){
        let checked=this.state.CheckedBox      
        checked.push(item['value']);
        this.setState({CheckedBox:checked}, () => {
          console.log(this.state.CheckedBox);
        }); 
      }
      else{
        var toRemove = item.value;
        var index = this.state.CheckedBox.indexOf(toRemove);
         if (index > -1) {
          this.state.CheckedBox.splice(index, 1);
      }
      
    }}}
    containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
  />
    </View>
  );

const setSelectedOption =  (selectedOption) => {
  this.setState({
    selectedRadio:selectedOption.label
  });
}
const clear =  () => {
  this.setState(({ uniqueValue }) => ({
    uniqueValue: uniqueValue + 1
  }));
 this.setState({selectedRadio:null}, () => {
  console.log(this.state.selectedRadio);
}); 
 this.state.categories.map((item) =>{
  let arr=item;
  arr.cheak=false;
  this.setState({item:arr})
 });
 this.setState({CheckedBox:[]},() => {
  console.log(this.state.CheckedBox);
}); 
}
const apply=()=>{
  if(((this.state.selectedRadio!=null)&&( this.state.CheckedBox.length!=0))||((this.state.selectedRadio!=null)||( this.state.CheckedBox.length!=0)))
  this.props.navigation.navigate('FilterResultScreen',{selectedRadio:this.state.selectedRadio,CheckedBox:this.state.CheckedBox})
}
  return (
      <View >
  <ScrollView>
  <SafeAreaView style={styles.safe}>
  <Text  style={{fontSize:20,color:'black',fontWeight:'bold'}}>
    Sort By:
  </Text>
  <View style={styles.sort} key={this.state.uniqueValue}> 
  <RadioButtonRN
    data={sort_by}
    box={false}
    deactiveColor='gray'
    circleSize={12}
    selectedBtn={(e)=>setSelectedOption(e)}
    activeColor={'#08d4c4'}
  />
  
    </View>
    <Text  style={{fontSize:20,color:'black',fontWeight:'bold'}}>
    Catigories:
  </Text>
  <View style={styles.category} >
  {myloop}
 
  </View>
  
   </SafeAreaView>
  
  </ScrollView>
  <View style={styles.footer}>
    <View style={{flexDirection: 'row-reverse'}}>
 <TouchableOpacity onPress={()=> apply()} >
    <LinearGradient colors={['#08d4c4', '#01ab9d']} style={styles.linearGradient} >
       <Text style={styles.buttonText}>
            Apply
       </Text>
      </LinearGradient>
  </TouchableOpacity>
  <TouchableOpacity 
  onPress={()=>clear() 
   }>
    <LinearGradient colors={['#08d4c4', '#01ab9d']} style={styles.linearGradient} >
       <Text style={styles.buttonText}>
            Clear
       </Text>
      </LinearGradient>
  </TouchableOpacity>
  </View>
    </View>
  </View> 
  
  
    );

  }
}


  const styles = StyleSheet.create({
    sort:
{
  backgroundColor:'#E3E5E7',
  padding: 20,
  marginVertical: 8
},
safe:{
  flex: 1,
  marginTop: 5,
  marginHorizontal: 16
},
category:{
  backgroundColor:'#E3E5E7',
  padding: 20,
  marginVertical: 8,
  marginBottom:50,
  flex:1,
  flexDirection: 'row',
  flexWrap:'wrap',
},

linearGradient: {
  marginTop:10,
marginRight:15,

  width: 100,
  height: 30,
  alignItems: 'center',
 

},
buttonText: {
  fontSize: 20,
  fontFamily: 'Gill Sans',
  textAlign: 'center',
  color: '#ffffff',
  paddingLeft: 5,
  backgroundColor: 'transparent',

},
footer:{
  position: 'absolute',
   left: 0, 
   right: 0,
    bottom: 0 ,
    height: 50, 
    backgroundColor:'#fff',
    shadowOffset: {	width: 0,	height: 15,},
  shadowOpacity: 0.32,
},



})
