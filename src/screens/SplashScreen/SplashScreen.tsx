import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme , Text} from 'react-native-paper';
import { RootStackParamList } from '../../types';
import { useAppSelector } from '../../store/hooks/hooks';

type AddExpenseScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SplashScreen'>;
}
const SplashScreen: React.FC<AddExpenseScreenProps> = ({navigation}) => {
  const { colors } = useTheme();
  const { isAllPermissionsGranted } = useAppSelector(state => state.global);

  useEffect(()=>{
    const timer = setTimeout(() => {
      navigation.replace(isAllPermissionsGranted ? 'Dashboard' : 'Onboarding');
    }, 2000);

    return () => clearTimeout(timer); 
  },[])

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
       <Text style={{ color: colors.onPrimary, fontSize: 24, fontWeight: 'bold' }}>
        Welcome to
      </Text>
      <Text style={{ color: colors.onPrimary, fontSize: 26, fontWeight: 'bold' }}>
        Smart Expense Tracker
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  loader: {
    marginTop: 40,
  },
});

export default SplashScreen;