/*import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';

const DocumentScannerPage = () => {
  const [scannedImage, setScannedImage] = useState(null);
  const [error, setError] = useState(null);

  const scanDocument = async () => {
    try {
      // start the document scanner
      const { scannedImages } = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });

      // get back an array with scanned image file paths
      if (scannedImages.length > 0) {
        // set the img src, so we can view the first scanned image
        setScannedImage(scannedImages[0]);
      }
    } catch (err) {
      console.error('Document scanning failed:', err);
      setError(err);
    }
  };

  useEffect(() => {
    // call scanDocument on load
    scanDocument();
  }, []);

  return (
    <View style={styles.container}>
      {scannedImage ? (
        <Image
          resizeMode="contain"
          style={styles.image}
          source={{ uri: scannedImage }}
        />
      ) : (
        <Text style={styles.text}>Scanning document...</Text>
      )}
      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});

export default DocumentScannerPage;
*/