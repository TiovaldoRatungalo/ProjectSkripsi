import React, {useState} from 'react';
import {
  View,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {LinearGradient} from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SignUpScreen = ({navigation}) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateAccount = () => {
    // check if input fields are not empty or only spaces
    if (
      !fullname.trim() ||
      !email.trim() ||
      !password.trim() ||
      !repassword.trim()
    ) {
      Alert.alert(
        'Empty Input Field',
        'Periksa lagi, semua kolom tidak boleh kosong.',
      );
      return;
    }

    // check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error Message', 'Format email tidak valid.');
      return;
    }

    if (password !== repassword) {
      Alert.alert(
        'Kata sandi',
        'Sandi tidak cocok. Silakan masukkan kata sandi yang sama di kedua kolom.',
      );
      return;
    }
    if (password !== repassword) {
      Alert.alert(
        'Kata sandi',
        'Sandi tidak cocok. Silakan masukkan kata sandi yang sama di kedua kolom.',
      );
      return;
    }

    if (password.length < 8 || repassword.length < 8) {
      Alert.alert('Kata sandi', 'Panjang kata sandi minimal harus 8 karakter.');
      return;
    }

    // create request body with email and password input values
    const requestBody = {
      'email': email,
      'fullname': fullname,
      'password': password,
    };

    // Time out request data
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 5000); // 5000 (5 detik)
    });

    Promise.race([
      fetch('https://rsmnbot.online/admin/mobile/signupmobile.php', {
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
          Alert.alert(
            'Error Message',
            'Maaf, pembuatan akun baru gagal. Silakan coba lagi.',
          );
          return;
        }

        // check if textData contains "DUPLICATE"
        if (textData.includes('DUPLICATE')) {
          // handle DUPLICATE case
          Alert.alert(
            'Error Message',
            'Maaf, duplikat email ditemukan di database. Harap masukkan email yang lain.',
          );
          return;
        }

        if (textData.includes('SUCCESS')) {
          // message
          Alert.alert('User Account', 'Akun baru berhasil dibuat.', [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to the Sign-In screen after successful account creation
                navigation.navigate('SignInScreen');

                // Clear input fields
                setFullname('');
                setEmail('');
                setPassword('');
                setRePassword('');
              },
            },
          ]);
        }
      })
      
      .catch(error => {
        Alert.alert('Error Message', error.message);
        return;
      });
  };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
      <ImageBackground
        source={require('../assets/icons/backgroundchat.jpg')}
        style={styles.image}
        resizeMode="cover">
        <View style={styles.logoContainer}>
          <Animatable.Image
            animation="zoomIn"
            source={require('../assets/icons/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>RSMN BITUNG</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignInScreen')}
          style={styles.backButton}>
          <Icon name="arrow-left" size={25} color="#003f5c" />
        </TouchableOpacity>
        <Animatable.View animation="fadeInLeftBig" style={styles.formContainer}>
          <Text style={styles.CreateAccountText}>Create an Account</Text>
          <ScrollView contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" 
          >
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Icon name="account-circle" size={18} color="black" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#003f5c"
              value={fullname}
              onChangeText={setFullname}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Icon name="gmail" size={18} color="black" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              value={email}
              autoCapitalize="none"
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCompleteType="email"
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Icon name="key" size={18} color="black" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#003f5c"
              value={password}
              onChangeText={setPassword}
              autoCompleteType="password"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}>
              <Icon
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Icon name="lock" size={18} color="black" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Re-enter Password"
              placeholderTextColor="#003f5c"
              value={repassword}
              onChangeText={setRePassword}
              autoCompleteType="password"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}>
              <Icon
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="black"
              />
            </TouchableOpacity>
          </View>
          </ScrollView>
          <TouchableOpacity onPress={handleCreateAccount}>
            <LinearGradient
              colors={['#66CDAA', '#66CDAA']}
              style={styles.loginButton}>
              <Text style={styles.loginText}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </ImageBackground>
      </KeyboardAvoidingView>
     );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputIcon: {
    paddingRight: 5,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 1,
    padding: 10,
  },

  CreateAccountText: {
    color: '#003f5c',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
    height: '50%',
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoText: {
    color: 'black',
    fontSize: 30,
    marginTop: 10,
    fontFamily: 'Poppins-Bold',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 50,
    paddingHorizontal: 30,
    width: '90%',
    height: '55%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: 'center',
    position: 'absolute',
    top: '40%',
  },
  inputContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF8DC',
    borderRadius: 25,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    flex: 1,
    color: '#003f5c',
  },
  loginButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -25,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
});

export default SignUpScreen;
