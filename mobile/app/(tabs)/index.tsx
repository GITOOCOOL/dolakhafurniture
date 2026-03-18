import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, FlatList, Image, 
  TouchableOpacity, Linking, ActivityIndicator 
} from 'react-native';
import { getProducts } from '../../src/lib/sanity';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Replace with your actual phone number for COD
  const handleCall = () => Linking.openURL('tel:+97798XXXXXXXX'); 

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>DOLAKHA</Text>
        <Text style={styles.tagline}>FURNITURE COD STORE</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.image} 
              resizeMode="cover" 
            />
            <View style={styles.cardInfo}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.price}>Rs. {item.price.toLocaleString()}</Text>
              <TouchableOpacity style={styles.button} onPress={handleCall}>
                <Text style={styles.buttonText}>CALL TO ORDER</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    paddingTop: 60, 
    paddingBottom: 20, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  brand: { fontSize: 28, fontWeight: '900', color: '#111', letterSpacing: -1 },
  tagline: { fontSize: 10, fontWeight: 'bold', color: '#2563eb', letterSpacing: 2 },
  list: { padding: 10 },
  card: { 
    flex: 0.5, 
    backgroundColor: '#fff', 
    margin: 6, 
    borderRadius: 16, 
    overflow: 'hidden', 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  image: { width: '100%', height: 130, backgroundColor: '#f0f0f0' },
  cardInfo: { padding: 12 },
  name: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  price: { fontSize: 13, color: '#059669', fontWeight: '900', marginVertical: 6 },
  button: { 
    backgroundColor: '#111', 
    paddingVertical: 10, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});
