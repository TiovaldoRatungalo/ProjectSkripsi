import React, {useState, useEffect,  useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {iBackgroundchat} from '../assets';
import LinearGradient from 'react-native-linear-gradient';
import Voice from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/Ionicons';
import Tts from 'react-native-tts';
import soundGif from '../assets/animation.gif';
import mengetikGif from '../assets/mengetik.gif';
import imageGif from '../assets/aichat.gif';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 



const CustomHeader = ({navigation, jsonData}) => {
  return (
    <LinearGradient colors={['#87CEFA', '#F8F8FF']} style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeScreen', {jsonData})}
        style={styles.backButton}>
        <Image
          source={require('../assets/icons/back.png')}
          style={{width: 24, height: 24}}
        />
      </TouchableOpacity>
      <Image source={imageGif} style={{width: 40, height: 30, marginLeft: -50}} />
      <Text style={styles.headerText}>AiChat</Text>
    </LinearGradient>
  );
};

const ChatScreen = ({navigation, route}) => {
  const {jsonData} = route.params;
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [isPressing, setIsPressing] = useState(false);
  const [previousRecognizedText, setPreviousRecognizedText] = useState('');
  const [questionHistory, setQuestionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const scrollViewRef = useRef(null);

  const filterOffensiveWords = (message) => {
    // daftar filter kata kata kasar
    const offensiveWords = ['bodoh', 'gak berguna', 'bodoh kau', 'aplikasi sampah', 'goblok', 'jelek', 'aplikasi Bodoh', 'aplikasi Jelek']; 
    const lowerCaseMessage = message.toLowerCase();

    return offensiveWords.some((word) => lowerCaseMessage.includes(word));
  };

  async function storeChatHistory(chatHistory) {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    } catch (error) {
      console.error(error);
    }
  }

  async function loadChatHistory() {
    try {
      const chatHistory = await AsyncStorage.getItem('chatHistory');
      if (chatHistory != null) {
        const parsedChatHistory = JSON.parse(chatHistory);
        setChatMessages(parsedChatHistory);
        return parsedChatHistory;
      }
      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const saveRecentQuestionsToAsyncStorage = async (questions) => {
    try {
      await AsyncStorage.setItem('recentQuestions', JSON.stringify(questions));
    } catch (error) {
      console.error('Gagal menyimpan recent questions:', error);
    }
  };

  const getRecentQuestionsFromAsyncStorage = async () => {
    try {
      const recentQuestionsJSON = await AsyncStorage.getItem('recentQuestions');
      if (recentQuestionsJSON) {
        const recentQuestions = JSON.parse(recentQuestionsJSON);
        setQuestionHistory(recentQuestions);
      }
    } catch (error) {
      console.error('Gagal mengambil recent questions:', error);
    }
  };

  useEffect(() => {
    loadChatHistory();
    getRecentQuestionsFromAsyncStorage();
  }, []);

  const startRecognition = async () => {
    try {
      await Voice.start('id-ID');
      setIsListening(true);
      setRecognizedText('');
    } catch (error) {
      console.error('Gagal memulai pengenalan suara:', error);
    }
  };

  const stopRecognition = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Gagal menghentikan pengenalan suara:', error);
    }
  };

  useEffect(() => {
    if (isListening) {
      startRecognition();
    }

    return () => {
      if (isListening) {
        stopRecognition();
      }
    };
  }, [isListening]);

  Voice.onSpeechResults = event => {
    const { value } = event;
    if (value) {
      const recognizedText = value[0];
      setRecognizedText(recognizedText);
      setPreviousRecognizedText(recognizedText);
      Voice.destroy().then(Voice.removeAllListeners);
    }
  };

  const handleListen = async () => {
    try {
      await Tts.setDefaultLanguage('en-US');
      await Tts.speak(message);
    } catch (error) {
      console.error(error);
    }
  };

  const user_email = jsonData;

  const handleSend = async () => {
    const user_message = message.trim();

    if (user_message === '' && recognizedText === '') {
      Alert.alert('Pesan Kosong', 'Maaf, obrolan pengguna tidak boleh kosong.');
      return;
    }
   

     // Check for offensive words using the filter function
     const isOffensive = filterOffensiveWords(user_message);

     if (isOffensive) {
       Alert.alert(
         'Peringatan',
         'Pesan Anda mengandung kata-kata yang tidak pantas. Harap ubah pesan Anda.',
       );
       return; 
     }

     setIsLoading(true);

    if (!questionHistory.includes(user_message)) {
      const updatedQuestions = [user_message, ...questionHistory];
      setQuestionHistory(updatedQuestions);
      saveRecentQuestionsToAsyncStorage(updatedQuestions);
    }

    handleLocationInquiry(user_message);

    const newUserMessage = {
      sender: 'User',
      content: user_message,
    };

    const requestBody = {
      'input-email': user_email,
      'input-message': user_message,
    };

    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out.'));
      }, 15000);
    });

    Promise.race([
      fetch('https://rsmnbot.online/admin/mobile/run_chatbot.php', {
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
        console.log('OUTPUT DARI SERVER:');
        console.log(textData);

        if (textData.includes('ERROR')) {
          Alert.alert(
            'Error Message',
            'Maaf, permintaan gagal. Silakan coba lagi.',
          );
          return;
        }

        if (textData.includes('id_pattern')) {
          const jsonData = JSON.parse(textData);
          console.log(jsonData);

          const sim_value = jsonData[0].similarity_probability * 100;

          const newBotMessage = {
            sender: 'AiChat',
            content: jsonData[0].answer,
          };

          setChatMessages((prevChatMessages) => [
            ...prevChatMessages,
            newUserMessage,
            newBotMessage,
          ]);
          storeChatHistory([...chatMessages, newUserMessage, newBotMessage]);
          setMessage('');
          setRecognizedText('');
        }
        setIsLoading(false);
      })
      .catch(error => {
        Alert.alert('Error Message', error.message);
        return;
      });

    setMessage('');
    setRecognizedText('');
  };

  const handleLocationInquiry = (user_message) => {
    const destinations = {
      "poli saraf": 'Poli Saraf',
      "poli bedah": 'Poli Bedah',
      "poli kulit dan kelamin": 'Poli Kulit dan Kelamin',
      "poli penyakit dalam ": 'Poli Penyakit Dalam ',
      "poli anak": 'Poli Anak',
      "poli gigi": 'Poli Gigi',
      "poli mata": 'Poli Mata',
      "poli umum": 'Poli Umum',
      "poli tht": 'Poli THT',
      "poli fisik dan rehabilitasi": 'Poli Fisik dan Rehabilitasi',
      "poli kandungan": 'Poli Kandungan',
      "poli mcu pelaut / kesehatan pelaut": 'Poli MCU Pelaut / Kesehatan Pelaut',
      "poli mcu": 'Poli MCU',
      "poli medikolegal": 'Poli Medikolegal ',
      "poli jantung dan pembuluh darah": 'Poli Jantung dan Pembuluh Darah',
      "poli paru": 'Poli Paru',
      "igd": 'IGD',
      "pusat informasi rs": 'Pusat Informasi RS'
    };
  
    const lowerCaseUserMessage = user_message.toLowerCase();
  
    for (let destination in destinations) {
      if (lowerCaseUserMessage.includes(destination)) {
        navigation.navigate('GeolocationScreen', { location: destinations[destination] });
        return;
      }
    }
  
  };
  const handleRecentQuestionSelect = (question) => {
    setMessage(question);
   
  };
  
  const handleMicrophonePressIn = () => {
    setIsPressing(true);
    startRecognition();
  };

  const handleMicrophonePressOut = () => {
    setIsPressing(false);
    if (isListening) {
      stopRecognition();
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    if (previousRecognizedText) {
      setMessage(previousRecognizedText);
    }
  }, [previousRecognizedText]);

  useEffect(() => {
    // Scroll to the bottom when chatMessages change (new message)
    scrollToBottom();
  }, [chatMessages]);

  
  return (
    <ImageBackground source={iBackgroundchat} style={{ flex: 1 }}>
      <CustomHeader navigation={navigation} jsonData={jsonData} />
      <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 50 }}>
        <View style={{ padding: 10 }}>
          <ScrollView ref={scrollViewRef}>
            {chatMessages.map((chat, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  marginTop: 10,
                }}>
                {chat.sender !== 'User' && (
                  <Image
                    source={require('../assets/icons/chatbot.png')}
                    style={{ width: 24, height: 24, marginRight: 5 }}
                  />
                )}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent:
                      chat.sender === 'User' ? 'flex-end' : 'flex-start',
                  }}>
                  <View
                    style={{
                      backgroundColor:
                        chat.sender === 'User' ? '#E0FFFF' : '#AFEEEE',
                      borderRadius: 10,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}>
                    <Text
                      style={{
                        color: chat.sender === 'User' ? '#000' : '#000',
                        fontWeight: 'bold',
                      }}>
                      {chat.sender}:
                    </Text>
                    <Text
                      style={{
                        color: chat.sender === 'User' ? '#5c5757' : '#5c5757',
                      }}>
                      {chat.content}
                    </Text>
                  </View>
                </View>
                {chat.sender === 'User' && (
                  <Image
                    source={require('../assets/icons/user.png')}
                    style={{ width: 24, height: 24, marginLeft: 5 }}
                  />
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.recentQuestionContainer}>
        <Image
          source={require('../assets/icons/ask.png')}
          style={{ width: 40, height: 40, marginLeft: -20 }}
        />
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ paddingLeft: 10 }}>
            {questionHistory.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentQuestionButton}
                onPress={() => handleRecentQuestionSelect(question)}>
                <Text style={styles.recentQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          
          <TextInput
            style={styles.inputBox}
            placeholder="Ketik pesan"
            placeholderTextColor="black"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity onPress={() => handleListen(message)} style={styles.audioButton}>
            <Icon name="volume-high" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={handleMicrophonePressIn}
            onPressOut={handleMicrophonePressOut}
            style={styles.voiceButton}>
            {isPressing ? (
              <Image source={soundGif} style={{ width: 45, height: 45 }} />
            ) : (
              <Image
                source={require('../assets/icons/microphone.png')}
                style={{ width: 45, height: 45 }}
              />
            )}
          </TouchableOpacity>
  
          {isLoading && (
            <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <Image source={mengetikGif} style={styles.gifImage} />
            </View>
          )}
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>


      {isPressing && (
        <View style={styles.gifContainer}>
          <Image source={soundGif} style={styles.gifImage} />
        </View>
      )}
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    position: 'fixed', 
    width: '100%', 
    zIndex: 2, 
  },
  headerText: {
    color: '#808080',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    marginLeft: 1,
    marginTop: 8,
  },
  backButton: {
    padding: 5,
    marginRight: 50,
  },
 
  messageBubble: {
    maxWidth: '70%',
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  audioButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    width: 40,
    height: 40,
    alignItems: 'center',
    marginLeft: 10,
    justifyContent: 'center',
  },
  inputBox: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    borderRadius: 20,
    color: 'black',
    backgroundColor: '#E0FFFF',
  },
  voiceButton: {
    marginLeft: 10,
    fontSize: 24,
  },
  voiceButtonText: {
    fontSize: 24,
    height: 45,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 20,
  },
  voiceOutput: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  gifContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    zIndex: 1,
  },
  gifImage: {
    width: 200,
    height: 200,
  },
  recentQuestionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginLeft: 30,
  },
  recentQuestionButton: {
    backgroundColor: 'transparent', 
    borderWidth: 1,                
    borderColor: '#0000CD',       
    borderRadius: 13,
    padding: 5,
    margin: 5,
  },
  recentQuestionText: {
    color: 'black',
    fontSize: 13,
  },
});

export default ChatScreen;