import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,

} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import soundGif from '../assets/hirobot.gif'; 
import LinearGradient from 'react-native-linear-gradient';

const ChangePassScreen = ({navigation, route}) => {
  const {jsonData} = route.params;
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // set oldPass and newPass to empty string on screen focus
  useFocusEffect(
    React.useCallback(() => {
      setOldPass('');
      setNewPass('');
    }, []),
  );

  const handleChangePass = () => {
    // check if old pass and new pass are not empty or only spaces
    if (!oldPass.trim() && !newPass.trim()) {
      Alert.alert(
        'Error Message',
        'Masukan kata sandi lama dan kata sandi baru tidak boleh kosong atau hanya berisi spasi.',
      );
      return;
    }

    if (oldPass === newPass) {
      Alert.alert(
        'Error Message',
        'Masukan password harus berbeda dengan yang sebelumnya.',
      );
      return;
    }

    if (!oldPass.trim()) {
      Alert.alert(
        'Error Message',
        'Masukan kata sandi lama tidak boleh kosong atau hanya berisi spasi.',
      );
      return;
    }

    if (!newPass.trim()) {
      Alert.alert(
        'Error Message',
        'Masukan kata sandi baru tidak boleh kosong atau hanya berisi spasi.',
      );
      return;
    }

    // create request body with email and password input values
    const requestBody = {
      'input-old-password': oldPass,
      'input-new-password': newPass,
      'email-user': jsonData[0].email,
    };

    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 5000); // 5000 (5 detik)
    });

    Promise.race([
      fetch('https://rsmnbot.online/admin/mobile/changepasswordmobile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: Object.keys(requestBody)
          .map(
            key =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                requestBody[key],
              )}`,
          )
          .join('&'),
      }),
      timeoutPromise,
    ])
      .then(response => response.text())
      .then(textData => {
        // handle response data
        console.log(textData);

        // check if textData contains "ERROR"
        if (textData.includes('ERROR')) {
          // handle error case
          //console.error("Login failed:", textData);
          Alert.alert(
            'Error Message',
            'Maaf, perubahan kata sandi gagal. Silakan coba lagi.',
          );
          return;
        }

        // check if textData contains "INCORRECT"
        if (textData.includes('INCORRECT')) {
          // handle INCORRECT case
          Alert.alert(
            'Error Message',
            'Maaf, Anda salah memasukkan kata sandi lama. Silakan coba lagi.',
          );
          return;
        }

        if (textData.includes('SUCCESS')) {
          Alert.alert(
            'Password Changed',
            'Kata sandi telah berhasil diubah. Silakan masuk dengan kata sandi baru.',
          );
          // redirect to SignInScreen on successful change password
          navigation.navigate('SignInScreen');
        }
      })
      .catch(error => {
        //console.error(error);
        Alert.alert('Error Message', error.message);
        return;
      });
  };

  return (
    
  <View style={styles.container}>
   <View style={styles.container}>
      {/* header */}
      <LinearGradient
        colors={['#00bfff', '#B0E0E6']}
        style={styles.header}
      >
        <Text style={styles.headerText}>Change Password</Text>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => navigation.navigate('HomeScreen', {jsonData})}>
          <Image
            source={require('../assets/icons/arrow.png')}
            style={{...styles.backImage, width: 30, height: 30}}
          />
        </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* user profile */}
      <View style={styles.userProfile}>
        <View style={styles.userProfileLeft}>
        <Icon name="person-circle-outline" 
        size={80} color="#555" />
        
          <View>
            {/* <Text style={styles.userProfileFullName}>
              {jsonData[0].fullname}
            </Text> */}
            <Text style={styles.userProfileEmail}>{jsonData[0].email}</Text>
          </View>
        </View>
        <View style={styles.userProfileRight} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.inputContainer}>
        <Icon name="lock-closed" size={20} color="#333" style={styles.inputIcon} />
          <TextInput
            style={styles.inputField}
            placeholder="Old Password"
            placeholderTextColor={'#a1a1a1'}
            secureTextEntry={true}
            value={oldPass}
            onChangeText={setOldPass}
          />
        </View>
        <View style={styles.inputContainer}>
        <Icon name="lock-closed" size={20} color="#333" style={styles.inputIcon} />
          <TextInput
            style={styles.inputField}
            placeholder="New Password"
            placeholderTextColor={'#a1a1a1'}
            secureTextEntry={true}
            value={newPass}
            onChangeText={setNewPass}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleChangePass}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <Text style={styles.changePasswordText}>
          Silakan lakukan perubahan pada kata sandi Anda.
        </Text>
             <Image source={soundGif} style={styles.gifImage} />
      </View>

      {/* footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>RSMN BITUNG</Text>
      </View>
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  changePasswordText: {
    color: '#666',
    textAlign: 'center',
    marginTop: -220,
  },
  header: {
    backgroundColor: '#00bfff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 90,
    marginBottom: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationIcon: {
    position: 'relative',
    right: 0, 
    top: 0,
  },
  backImage: {
    width: 24,
    height: 24,
  },
  userProfile: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 25,
    marginVertical: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 30,
    shadowColor: 'black',
    top: 65,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 20,
  },

  userProfileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userProfileText: {
    color: '#05375a',
    marginLeft: 10,
    fontSize: 14,
  },
  userProfileEmail: {
    color: '#05375a',
    marginLeft: 10,
    fontSize: 11,
  },
     userProfileFullName: {
     color: '#05375a',
     marginLeft: 10,
     fontSize: 16,
   },
  userProfileRight: {
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'flex-start', 
    marginTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 1,
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  inputIcon: {
    margin: 10,
    width: 20,
  },
  inputField: {
    borderRadius: 5,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
    paddingLeft: 10,
    color: '#05375a',
    height: 48,
    borderWidth: 2,
    borderColor: '#ccc',
    paddingHorizontal: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 0,
    backgroundColor: '#ffff',
  },
  button: {
    backgroundColor: '#00bfff',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    height: 48,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 19,
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
  gifImage: {
    height: 180,
    width: 180,
    marginTop: 200,
  },
  
});

export default ChangePassScreen;
