import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  BackHandler,
  Image,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import soundGif from '../assets/go.gif';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation, route }) => {
  const { jsonData } = route.params;
  const [newsIndex, setNewsIndex] = useState(0);
  const [showFraction, setShowFraction] = useState(true);
  const newsData = [
    {
      image: require('../assets/icons/berita1.jpg'),
    },
    {
      image: require('../assets/icons/berita2.jpg'),
    },
    {
      image: require('../assets/icons/berita3.jpg'),
    },
    {
      image: require('../assets/icons/berita4.jpg'),
    },
    {
      image: require('../assets/icons/berita5.jpg'),
    },
    {
      image: require('../assets/icons/berita6.jpg'),
    },
    {
      image: require('../assets/icons/berita3.jpg'),
    },
    {
      image: require('../assets/icons/berita7.jpg'),
    },
    {
      image: require('../assets/icons/berita8.jpg'),
    },
    {
      image: require('../assets/icons/berita9.jpg'),
    },
    {
      image: require('../assets/icons/berita10.jpg'),
    },
    {
      image: require('../assets/icons/berita11.jpg'),
    },
  ];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      // Deteksi gerakan swipe di sini
      if (gestureState.dx !== 0 || gestureState.dy !== 0) {
        setShowFraction(true); 
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      // Jika pengguna selesai mengusap, set showFraction ke false setelah beberapa detik
      setShowFraction(true);

      // Tambahkan pengecekan arah usapan dan ganti gambar berdasarkan arah tersebut
      if (gestureState.dx > 50) {
        // Jika usapan ke kanan
        setNewsIndex((prevIndex) => (prevIndex - 1 + newsData.length) % newsData.length);
      } else if (gestureState.dx < -50) {
        // Jika usapan ke kiri
        setNewsIndex((prevIndex) => (prevIndex + 1) % newsData.length);
      }

      setTimeout(() => {
        setShowFraction(false);
      }, 15000); 
    },
  });


  useEffect(() => {
    const backAction = () => {
      const currentPos = navigation.getState().routes;
      const currentRouteName = currentPos[currentPos.length - 1].name;
      console.log('Nama screen sekarang: ' + currentRouteName);

      if (currentRouteName === 'HomeScreen') {
        handleButtonPress();
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    const photoInterval = setInterval(() => {
      setNewsIndex(prevIndex => (prevIndex + 1) % newsData.length);
    }, 5000);

    return () => {
      backHandler.remove();
      clearInterval(photoInterval);
    };
  }, [navigation]);

  const handleButtonPress = () => {
    Alert.alert(
      'Confirm Dialog',
      'Apakah Anda yakin ingin keluar?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes',
          onPress: () => {
            console.log('Keluar Dilanjutkan dari HomeScreen.');
            navigation.navigate('SignInScreen');
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let iconColor;

          if (route.name === 'Home') {
            iconName = 'home';
            iconColor = focused ? 'deepskyblue' : 'deepskyblue';
            size = 33; 
          } else if (route.name === 'Profile') {
            iconName = 'user';
            iconColor = focused ? 'deepskyblue' : 'deepskyblue';
            size = 33; 
          } else if (route.name === 'Logout') {
            iconName = 'sign-out';
            iconColor = focused ? 'deepskyblue' : 'deepskyblue';
            size = 33; 
          }

          return <Icon name={iconName} size={size} color={iconColor} />;
        },  
        tabBarLabelStyle: {
          color: 'gray', 
        },
        tabBarStyle: {
          backgroundColor: '#F0F8FF', 
        },
        headerTitle: () => (
          <LinearGradient
            colors={['gray', 'deepskyblue']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerContainer} 
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Image
                source={require('../assets/icons/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.headerText}>RSMN BITUNG</Text>
            </View>
          </LinearGradient>
        ),
        
      })}>
     <Tab.Screen
        name="Home"
        component={HomeContent}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: { color: 'gray' }, 
         }}
      />
       <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={{
          tabPress: e => {
            // Mencegah navigasi default
            e.preventDefault();

            // Lakukan navigasi secara manual
            navigation.navigate('ProfileScreen', {jsonData: jsonData});
          },
        }}
      />
   <Tab.Screen
  name="Logout"
  component={LogoutScreen}
  listeners={{
    tabPress: e => {
      // Prevent the default navigation
      e.preventDefault();

      // Show the confirmation dialog
      Alert.alert(
        'Confirm Exit',
        'Apakah Anda yakin ingin keluar?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => {
              // Perform manual navigation to SignInScreen
              navigation.navigate('SignInScreen');
            },
          },
        ],
        { cancelable: false }
      );
    },
  }}
/>
    </Tab.Navigator>
  );
  
  function HomeContent() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={handleButtonPress}></TouchableOpacity>
        </View>

        <View
          {...panResponder.panHandlers}
          style={styles.newsContainer}>
          <Image
            source={newsData[newsIndex].image}
            style={styles.newsImage}
            resizeMode="cover"
          />

          {showFraction && (
            <View style={styles.fractionContainer}>
              <Text style={styles.fractionText}>
                {newsIndex + 1}/{newsData.length}
              </Text>
            </View>
          )}

          <Text style={styles.newsTitle}>{newsData[newsIndex].title}</Text>
          <Text style={styles.newsContent}>{newsData[newsIndex].content}</Text>
        </View>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatScreen', {jsonData})}>
          <Text style={styles.chatButtonText}>Get Started</Text>
        </TouchableOpacity>
        <View style={styles.soundGifContainer}>
          <Image source={soundGif} style={styles.soundGif} />
        </View>
      </View>
    );
  }

  function ProfileScreen() {
    return (
      <View style={styles.container}>
        <Text style={styles.footerButtonText}>Profile Screen</Text>
      </View>
    );
  }

  function LogoutScreen() {
    return (
      <View style={styles.container}>
        <Text style={styles.footerButtonText}>Logout Screen</Text>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingTop: 20,
    paddingBottom: -30,
    marginBottom: -5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerContainer: {
    flex: 1, 
    justifyContent: 'center',
    width: '100%',
    borderRadius: 15,
    
  },
  headerText: {
    color: 'white',
    fontSize: windowWidth > 400 ? 20 : 16, 
    marginRight: 200, 
    fontFamily: 'Poppins-black',
  },
  notificationIcon: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  chatButton: {
    backgroundColor: 'deepskyblue',
    paddingVertical: windowHeight * 0.02, 
    paddingHorizontal: windowWidth * 0.2, 
    borderRadius: windowWidth * 0.5, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight * 0.01, 
    shadowColor: '#00FF7F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 9,
    elevation: 10,
    position: 'absolute', 
    right: windowWidth * 0.15, 
    bottom: windowHeight * 0.08, 
  },

  
  chatButtonText: {
    color: 'white',
    fontSize: windowWidth * 0.04, 
    fontWeight: 'bold',
  },
  soundGifContainer: {
    position: 'absolute',
    left: windowWidth * 0.08, 
    bottom: windowHeight * 0.07, 
    },
  soundGif: {
    width: windowWidth * 0.130, 
    height: windowWidth * 0.145,
  },
  newsContainer: {
    alignItems: 'center',
    marginVertical: 75,
  },
  newsImage: {
    width: '100%',
    height: 500,
    marginVertical: 0,
    objectFit: 'cover',
    marginTop: -30,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  chatbotContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fractionContainer: {
    position: 'absolute',
    top: -30,
    right: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 13,
    padding: 4,
    backgroundColor: 'gray',  
  },
  fractionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
