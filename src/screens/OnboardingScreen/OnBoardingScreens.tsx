import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView ,Platform ,Alert} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
// import { requestSmsPermission } from '../services/smsReader';
import { RootStackParamList } from '../../types';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { spacing } from '../../themes/spacing';
import { PERMISSIONS, RESULTS, openSettings, requestMultiple } from 'react-native-permissions';
import { useAppDispatch } from '../../store/hooks/hooks';
import { setPermissionState } from '../../store/slices/globalSlice';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const dispatch = useAppDispatch();
  
  const handlePermissionRequest = async () => {
    requestAllPermissions()
  };

  const requestAllPermissions = async () => {
    const permissions = Platform.select({
      android: [
        PERMISSIONS.ANDROID.READ_SMS,
        PERMISSIONS.ANDROID.RECEIVE_SMS
      ],
      ios: [], // No SMS permissions on iOS
    });
  
    if (!permissions || permissions.length === 0) return;
  
    const statuses = await requestMultiple(permissions);
  
    const smsStatus = statuses[PERMISSIONS.ANDROID.READ_SMS];
   console.log('SMS Permission Status:', smsStatus);
    if (smsStatus !== RESULTS.GRANTED) {
      Alert.alert(
        'READ_SMS Permission',
        'SMS access is required to parse bank messages.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() },
        ]
      );
    } else {
      dispatch(setPermissionState(true));
      navigation.replace('Dashboard');
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { padding: spacing.large }]}
      showsVerticalScrollIndicator={false}
    >
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Image 
            source={{}} 
            style={styles.image} 
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.primary, marginBottom: spacing.medium }]}>
            Welcome to Smart Expense Tracker
          </Text>
          <Text style={[styles.description, { color: colors.onSurface, marginBottom: spacing.large }]}>
            Track your expenses automatically by reading your bank SMS messages.
          </Text>
          <Button 
            mode="contained" 
            onPress={() => setStep(2)}
            style={{ marginBottom: spacing.medium }}
          >
            Next
          </Button>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Image 
            source={{}} 
            style={styles.image} 
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.primary, marginBottom: spacing.medium }]}>
            SMS Permissions Needed
          </Text>
          <Text style={[styles.description, { color: colors.onSurface, marginBottom: spacing.large }]}>
            To automatically track your expenses, we need permission to read SMS messages from your bank.
          </Text>
          <Button 
            mode="contained" 
            onPress={handlePermissionRequest}
            style={{ marginBottom: spacing.medium }}
          >
            Grant Permission
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => navigation.replace('Dashboard')}
          >
            Skip for Now
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default OnboardingScreen;