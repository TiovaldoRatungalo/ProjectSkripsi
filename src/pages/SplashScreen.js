import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {ilogo, iBackgroundchat} from '../assets';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = ({navigation}) => {
  return (
    <ImageBackground source={iBackgroundchat} style={style.container}>
      <View style={style.header}>
        <Image
          animation="bounceIn"
          duraton="1500"
          source={ilogo}
          style={style.logo}
          resizeMode="stretch"
        />
      </View>

      <View
        style={[
          style.footer,
          {
            backgroundColor: '#F0000',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
        animation="fadeInUpBig">
        <Text
          style={{
            fontFamily: 'Poppins-Bold',
            color: '#010300',
            marginTop: -190,
            fontSize: 25,
          }}>
          RSMN BITUNG
        </Text>

        <View style={style.button}>
          <TouchableOpacity onPress={() => navigation.replace('SignInScreen')}>
            <LinearGradient
              colors={['#66CDAA', '#48D1CC']}
              style={[style.signIn, {width: 230}]}>
              <Text style={[style.textSign, {fontFamily: 'Poppins-Regular'}]}>
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Tombol "Get In" untuk navigasi ke SignUpScreen */}
          <TouchableOpacity onPress={() => navigation.replace('SignUpScreen')}>
            <LinearGradient
              colors={['#66CDAA', '#48D1CC']}
              style={[style.signIn, {width: 230, marginTop: 20}]}>
              <Text style={[style.textSign, {fontFamily: 'Poppins-Regular'}]}>
                Sign Up
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const {height} = Dimensions.get('screen');
const height_logo = height * 0.35;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 1,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    color: 'grey',
    marginTop: 5,
  },
  button: {
    alignItems: 'center',
    marginTop: 150,
  },
  signIn: {
    width: 170,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    fontSize: 20,
    color: '#FFFAFA',
    fontWeight: 'bold',
    paddingBottom: 3,
  },
});

export default SplashScreen;
