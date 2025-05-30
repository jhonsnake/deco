import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StyledInput from '../common/StyledInput';
import StyledButton from '../common/StyledButton';

interface CommentInputProps {
  onSubmit: (commentText: string) => void;
  isSubmitting?: boolean; // Optional prop to show loading/disabled state
}

const CommentInput: React.FC<CommentInputProps> = ({ onSubmit, isSubmitting }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (commentText.trim()) {
      onSubmit(commentText.trim());
      setCommentText(''); // Clear input after submit
    }
  };

  return (
    <View style={styles.container}>
      <StyledInput
        placeholder="Escribe tu comentario aquí..."
        value={commentText}
        onChangeText={setCommentText}
        multiline
        numberOfLines={3} // Adjust as needed
        containerStyle={styles.inputContainer}
        style={styles.inputText} // Style for the text input itself
      />
      <StyledButton
        title="Enviar Comentario"
        onPress={handleSubmit}
        disabled={!commentText.trim() || isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5, // Give a bit of horizontal padding if it's screen-wide
    backgroundColor: '#fff', // Or a slightly off-white background for the input area
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputContainer: {
    marginBottom: 10, // Space between input and button
  },
  inputText: {
    minHeight: 60, // Ensure multiline has some initial height
    textAlignVertical: 'top', // For Android multiline
  }
});

export default CommentInput;
