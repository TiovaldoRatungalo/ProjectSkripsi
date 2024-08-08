import React, {Component} from 'react';
import {View, Text, StatusBar, Image, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    const {jsonData} = this.props.route.params;

    this.state = {
      jsonData: jsonData,
    };
  }

  renderHeader() {
    return (
      <ImageBackground
      source={require('../assets/icons/bgprofile.jpg')} 
      style={{flex: 0.5}}
      resizeMode={'cover'}>
        <View style={{flex: 0.5}}></View>
        <TouchableOpacity style={styles.backButton} onPress={()=>this.props.navigation.navigate('HomeScreen', { jsonData: this.state.jsonData })}>
          <Image
            source={require('../assets/icons/arrowleft.png')}
            style={{...styles.backImage, width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  renderContent() {
    return (
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
             source={require('../assets/icons/avatar.jpg')}
            
            style={{
              width: 150,
              height: 150,
              borderRadius: 150 / 2,
              borderWidth: 3,
              borderColor: '#FFFFFF',
              position: 'absolute',
              zIndex: 2,
           
            }}
          />
        </View>
        <View style={{marginTop: 60}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              textAlign: 'center',
              color: '#212121',
              marginTop: 25,
            }}>
            {this.state.jsonData[0].user_name}
          </Text>
          <View style={styles.emailContainer}>
            <Icon name="envelope" size={25} color="#212121" />
            <Text style={styles.textdata}>: {this.state.jsonData[0].email}</Text>
          </View>
          {/* "Change Password" button with lock icon on the right */}
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              this.props.navigation.navigate('ChangePassScreen', {
                jsonData: this.state.jsonData,
              })
            }>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <View
    style={{flexDirection: 'row', marginTop: -20, marginHorizontal: 30,  bottom: 0}}>
    <TouchableOpacity
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Icon name="facebook" size={25} color="#bdbdbd" />
    </TouchableOpacity>
    <TouchableOpacity
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Icon name="instagram" size={25} color="#bdbdbd" />
    </TouchableOpacity>
    <TouchableOpacity
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Icon name="twitter" size={25} color="#bdbdbd" />
    </TouchableOpacity>
    <TouchableOpacity
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Icon name="whatsapp" size={25} color="#bdbdbd" />
    </TouchableOpacity>
  </View>
        </View>
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>RSMN BITUNG</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: -90,
  },
  footer: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: -10,
    backgroundColor: '#00bfff',
  },
  footerText: {
    color: '#666',
    color: 'white',
  },
  containerprofile: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 20,
    marginTop: 20,

  },
  profilImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  text: {
    fontSize: 18,
    color: '#05375a',
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  textdata: {
    fontSize: 16,
    color: '#05375a',
    marginBottom: 5,
    marginLeft: 5,
  },

  button: {
    backgroundColor: '#00bfff',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 50,
    width: '50%',
    marginLeft: 100,
    marginTop: 150,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  lockIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
},
emailContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
  },
});

export default ProfileScreen;
