import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import StyledButton from '../common/StyledButton'; // Assuming StyledButton is in common

// Mock media item structure
interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
}

interface MediaUploaderProps {
  onMediaSelected: (media: MediaItem[]) => void; // For now, just simulates selection
  initialMedia?: MediaItem[];
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaSelected, initialMedia = [] }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>(initialMedia);

  const handleSelectMedia = () => {
    // Simulate media selection
    // In a real app, this would open ImagePicker or similar
    console.log('Simulando selección de medios...');
    const mockImage: MediaItem = {
      id: `mock-${Date.now()}`,
      uri: `https://via.placeholder.com/150/0000FF/808080?Text=MockMedia${selectedMedia.length + 1}`,
      type: 'image',
    };
    const newMediaList = [...selectedMedia, mockImage];
    setSelectedMedia(newMediaList);
    onMediaSelected(newMediaList); // Notify parent
  };

  const renderMediaItem = ({ item }: { item: MediaItem }) => (
    <View style={styles.previewItem}>
      <Image source={{ uri: item.uri }} style={styles.previewImage} />
      <Text style={styles.previewType}>{item.type === 'image' ? 'Imagen' : 'Video'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StyledButton title="Adjuntar Fotos/Videos" onPress={handleSelectMedia} />
      {selectedMedia.length > 0 && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Archivos Adjuntos:</Text>
          <FlatList
            data={selectedMedia}
            renderItem={renderMediaItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.previewList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  previewContainer: {
    marginTop: 15,
  },
  previewTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  previewList: {
    maxHeight: 120, // So it doesn't take too much space if many items
  },
  previewItem: {
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 5,
    backgroundColor: '#f9f9f9'
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginBottom: 4,
  },
  previewType: {
    fontSize: 10,
    color: '#555',
  },
});

export default MediaUploader;
