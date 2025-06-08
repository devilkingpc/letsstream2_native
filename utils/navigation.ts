import { NavigationProp, StackActions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const navigateToDetails = (
  navigation: NavigationProp<RootStackParamList>,
  params: RootStackParamList['Details'],
  replace: boolean = false
) => {
  if (replace) {
    navigation.dispatch(
      StackActions.replace('Details', params)
    );
  } else {
    navigation.navigate('Details', params);
  }
};
