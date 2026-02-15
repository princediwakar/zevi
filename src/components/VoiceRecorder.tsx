import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { 
  useAudioRecorder, 
  useAudioRecorderState, 
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabaseClient';
import { useUserStore } from '../stores/userStore';

// Note: AssemblyAI SDK requires Node.js stream module which doesn't work in React Native
// For production, use a server-side API endpoint for transcription instead

interface VoiceRecorderProps {
  onRecordingComplete?: (audioUri: string, transcription: string) => void;
  maxDuration?: number; // in seconds
  mode?: 'practice' | 'mock';
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  maxDuration = 300, // 5 minutes
  mode = 'practice',
}) => {
  const { theme } = useTheme();
  const { user } = useUserStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [audioUri, setAudioUri] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Use expo-audio's useAudioRecorder hook
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  useEffect(() => {
    // Check permissions on mount
    checkPermissions();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Update recording state based on recorder state
    if (recorderState.isRecording && !isRecording) {
      setIsRecording(true);
      // Start timer when recording begins
      timerRef.current = setInterval(() => {
        setRecordTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (!recorderState.isRecording && isRecording) {
      // Recording stopped
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [recorderState.isRecording]);

  const checkPermissions = async () => {
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      setHasPermission(granted);
    } catch (error) {
      console.error('Failed to check permissions:', error);
      setHasPermission(false);
    }
  };

  const startRecording = async () => {
    try {
      if (hasPermission === false) {
        const { granted } = await requestRecordingPermissionsAsync();
        if (!granted) {
          Alert.alert('Permission required', 'Microphone permission is needed to record voice.');
          return;
        }
        setHasPermission(true);
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();

      setRecordTime(0);
      setTranscription('');
      setAudioUri('');
    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Recording Error', 'Could not start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recorder) return;

    try {
      await recorder.stop();
      
      if (recorder.uri) {
        setAudioUri(recorder.uri);
        await processRecording(recorder.uri);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Recording Error', 'Could not stop recording properly.');
    }
  };

  const processRecording = async (uri: string) => {
    if (!user) {
      Alert.alert('Authentication required', 'Please sign in to use voice features.');
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Supabase Storage
      const fileName = `voice_${user.id}_${Date.now()}.m4a`;
      // Convert URI to Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('voice_recordings')
        .upload(fileName, blob, {
          contentType: 'audio/m4a',
        });

      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage
        .from('voice_recordings')
        .getPublicUrl(fileName).data.publicUrl;

      // Call Whisper API for transcription (placeholder)
      setIsTranscribing(true);
      const transcript = await transcribeAudio(uri);
      setTranscription(transcript);

      // Notify parent component
      if (onRecordingComplete) {
        onRecordingComplete(publicUrl, transcript);
      }

      // TODO: Send to Claude for analysis
      // analyzeDelivery(transcript);

      Alert.alert(
        'Recording Complete',
        `Your ${formatTime(recordTime)} recording has been transcribed.`
      );
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Processing Error', 'Could not process recording. Please try again.');
    } finally {
      setIsUploading(false);
      setIsTranscribing(false);
    }
  };

  const transcribeAudio = async (uri: string): Promise<string> => {
    // Note: AssemblyAI SDK doesn't work in React Native - it requires Node.js stream module
    // For production, create a server-side API endpoint to handle transcription
    // This is a placeholder that returns a message about the feature
    console.log('Transcription requested for:', uri);
    return `Voice transcription is a premium feature. Your ${formatTime(recordTime)} recording has been saved.`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getRecordingStatus = () => {
    if (isRecording) return `Recording... ${formatTime(recordTime)}`;
    if (isUploading) return 'Uploading...';
    if (isTranscribing) return 'Transcribing...';
    if (audioUri) return 'Recording complete';
    return 'Ready to record';
  };

  const getStatusColor = () => {
    if (isRecording) return theme.colors.semantic.error;
    if (isUploading || isTranscribing) return theme.colors.semantic.warning;
    if (audioUri) return theme.colors.semantic.success;
    return theme.colors.text.secondary;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="mic" size={24} color={theme.colors.primary[500]} />
        <Text style={[styles.headerText, { color: theme.colors.text.primary }]}>
          Voice Practice
        </Text>
        <Text style={[styles.headerSubtext, { color: theme.colors.text.secondary }]}>
          Record your answer, get AI feedback on delivery
        </Text>
      </View>

      {/* Recording Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getRecordingStatus()}
          </Text>
        </View>

        {isRecording && (
          <View style={styles.recordingAnimation}>
            <View style={[styles.recordingDot, { backgroundColor: theme.colors.semantic.error }]} />
            <Text style={[styles.recordingText, { color: theme.colors.semantic.error }]}>
              LIVE
            </Text>
          </View>
        )}
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: theme.colors.text.primary }]}>
          {formatTime(recordTime)}
        </Text>
        <Text style={[styles.timerLabel, { color: theme.colors.text.secondary }]}>
          / {formatTime(maxDuration)}
        </Text>
      </View>

      {/* Record Button */}
      <TouchableOpacity
        style={[
          styles.recordButton,
          {
            backgroundColor: isRecording
              ? theme.colors.semantic.error
              : theme.colors.primary[500],
          },
        ]}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={isUploading || isTranscribing}
      >
        <Ionicons
          name={isRecording ? 'stop' : 'mic'}
          size={32}
          color={theme.colors.text.inverse}
        />
        <Text style={[styles.recordButtonText, { color: theme.colors.text.inverse }]}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>

      {/* Transcription Preview */}
      {transcription ? (
        <View style={styles.transcriptionContainer}>
          <Text style={[styles.transcriptionLabel, { color: theme.colors.text.secondary }]}>
            Transcription Preview:
          </Text>
          <ScrollView style={styles.transcriptionScroll}>
            <Text style={[styles.transcriptionText, { color: theme.colors.text.primary }]}>
              {transcription}
            </Text>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Ionicons name="document-text" size={48} color={theme.colors.border.light} />
          <Text style={[styles.placeholderText, { color: theme.colors.text.secondary }]}>
            Your transcription will appear here after recording
          </Text>
        </View>
      )}

      {/* Loading States */}
      {(isUploading || isTranscribing) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
            {isUploading ? 'Uploading to secure storage...' : 'Transcribing with AI...'}
          </Text>
        </View>
      )}

      {/* Premium Badge */}
      {mode === 'mock' && (
        <View style={styles.premiumBadge}>
          <Ionicons name="star" size={16} color={theme.colors.semantic.warning} />
          <Text style={[styles.premiumText, { color: theme.colors.semantic.warning }]}>
            Premium Feature
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recordingAnimation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recordingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  timerLabel: {
    fontSize: 20,
    fontWeight: '500',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 24,
  },
  recordButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  transcriptionContainer: {
    marginTop: 16,
  },
  transcriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  transcriptionScroll: {
    maxHeight: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    padding: 12,
  },
  transcriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  placeholderContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    borderColor: '#E4E4E7',
    marginTop: 16,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    alignSelf: 'center',
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
  },
});


export default VoiceRecorder;
