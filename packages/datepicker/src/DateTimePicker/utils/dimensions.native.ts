import { Dimensions } from 'react-native';

export const getDimensions = () => Dimensions.get('window');

export const addEventListener = (callback: (data: { window: { width: number; height: number } }) => void) => {
  return Dimensions.addEventListener('change', ({ window }) => {
    callback({ window });
  });
};