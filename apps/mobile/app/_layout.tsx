import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity, View, SafeAreaView, Image, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'Fraunces-Regular': require('../assets/fonts/Fraunces_72pt-Regular.ttf'),
    'Fraunces-Bold': require('../assets/fonts/Fraunces_72pt-Bold.ttf'),
    'Fraunces-SemiBold': require('../assets/fonts/Fraunces_72pt-SemiBold.ttf'),
  });

  const CustomHeader = ({ showBackButton = false, tintColor = '#ffffff', showLogo = false, title = '' }) => (
    <SafeAreaView style={{ backgroundColor: '#000000' }}>
      <View style={{
        height: 80,
        backgroundColor: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}>
        <View style={{ width: 44, justifyContent: 'center', alignItems: 'flex-start' }}>
          {showBackButton && (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Feather name="arrow-left" size={24} color={tintColor} />
            </TouchableOpacity>
          )}
        </View>
        
        {showLogo && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image 
              source={require('../assets/logo1.png')} 
              style={{
                width: 200,
                height: 100,
                marginTop: 10,
                marginLeft: -150
              }}
              resizeMode="contain"
            />
          </View>
        )}
        
        {title && !showLogo && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{
              fontSize: 20,
              fontFamily: 'Fraunces-Bold',
              color: '#ffffff',
              marginLeft: showBackButton ? 0 : -44,
            }}>
              {title}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          onPress={() => router.push('/profile')}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: '#1f1f1f',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#333333',
          }}
        >
          <Feather name="user" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            header: () => <CustomHeader showBackButton={false} tintColor="#ffffff" showLogo={true} />,
          }} 
        />
        <Stack.Screen 
          name="ar-camera" 
          options={{ 
            header: () => <CustomHeader showBackButton={true} tintColor="#10c0df" />,
          }} 
        />
        <Stack.Screen 
          name="gallery" 
          options={{ 
            header: () => <CustomHeader showBackButton={true} tintColor="#10c0df" title="Furniture Gallery" />,
          }} 
        />
        <Stack.Screen 
          name="profile" 
          options={{ 
            header: () => <CustomHeader showBackButton={true} tintColor="#10c0df" title="Profile" />,
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}
