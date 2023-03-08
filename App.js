import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Search from './Component.js/SearchScreen';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={{textAlign : 'center',margin : 20}} >Weather app!</Text>
      <Search />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
 
});
