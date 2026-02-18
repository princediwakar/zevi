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
import { theme } from '../theme';
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

interface VoiceRecorderProps {
  onRecordingComplete?: (audioUri: string, transcription: string) => void;
  maxDuration?: number;
  mode?: 'practice' | 'mock';
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  maxDuration = 300,
  mode = 'practice',
}) => {
  const { user } = useUserStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  useEffect(() => {
    checkPermissions();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (recorderState.isRecording && !isRecording) {
      setIsRecording(true);
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
        await processRecording(recorder.uri);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Recording Error', 'Could not stop recording properly.');
    }
  };

  const processRecording = async (uri: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      
      const fileType = uri.includes('.mp3') ? 'mp3' : 
                       uri.includes('.webm') ? 'webm' : 'm4a';

      const transcript = await transcribeAudio(base64, fileType);
      setTranscription(transcript);

      if (onRecordingComplete) {
        onRecordingComplete(uri, transcript);
      }
    } catch (error) {
      console.error('Processing error:', error);
      Alert.alert('Processing Error', 'Could not process recording. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const transcribeAudio = async (base64Audio: string, fileType: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('transcribe', {
      body: { audioBase64: base64Audio, fileType },
    });

    if (error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }

    if (!data?.transcription) {
      throw new Error('No transcription returned from API');
    }

    return data.transcription;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.secondary, borderColor: theme.colors.border.light }]}>
      {/* Status */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: isRecording ? theme.colors.semantic.error : theme.colors.text.primary }]} />
        <Text style={[styles.statusText, { color: theme.colors.text.primary }]}>
          {isRecording ? 'RECORDING' : isProcessing ? 'PROCESSING' : transcription ? 'COMPLETED' : 'TAP TO RECORD'}
        </Text>
        <Text style={[styles.timerText, { color: isRecording ? theme.colors.semantic.error : theme.colors.text.secondary }]}>
          {formatTime(recordTime)}
        </Text>
      </View>

      {/* Large Record Button */}
      <TouchableOpacity
        style={[
          styles.recordButton,
          {
            backgroundColor: isRecording ? theme.colors.semantic.error : theme.colors.text.primary,
          }
        ]}
        onPress={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isRecording ? 'stop' : 'mic'}
          size={48}
          color={theme.colors.text.inverse}
        />
      </TouchableOpacity>

      {/* Button Label */}
      <Text style={[styles.buttonLabel, { color: theme.colors.text.secondary }]}>
        {isRecording ? 'TAP TO STOP' : 'TAP TO START RECORDING'}
      </Text>

      {/* Transcription */}
      {(transcription || isProcessing) && (
        <View style={[styles.transcriptionBox, { borderColor: theme.colors.border.light, backgroundColor: theme.colors.background }]}>
          {isProcessing ? (
            <View style={styles.processingRow}>
              <ActivityIndicator size="small" color={theme.colors.text.primary} />
              <Text style={[styles.processingText, { color: theme.colors.text.secondary }]}>
                Transcribing your answer...
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.transcriptionScroll} nestedScrollEnabled>
              <Text style={[styles.transcriptionText, { color: theme.colors.text.primary }]}>
                {transcription}
              </Text>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 12,
    padding: theme.spacing[6],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing[2],
  },
  statusText: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.bold,
    letterSpacing: theme.swiss.letterSpacing.wide,
    flex: 1,
  },
  timerText: {
    fontSize: theme.swiss.fontSize.label,
    fontWeight: theme.swiss.fontWeight.bold,
    fontVariant: ['tabular-nums'],
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: theme.spacing[4],
  },
  buttonLabel: {
    fontSize: theme.swiss.fontSize.small,
    fontWeight: theme.swiss.fontWeight.medium,
    textAlign: 'center',
    letterSpacing: theme.swiss.letterSpacing.normal,
  },
  transcriptionBox: {
    marginTop: theme.spacing[6],
    borderWidth: 1,
    borderRadius: 8,
    padding: theme.spacing[4],
    maxHeight: 180,
  },
  transcriptionScroll: {
    maxHeight: 140,
  },
  transcriptionText: {
    fontSize: theme.swiss.fontSize.body,
    fontWeight: theme.swiss.fontWeight.medium,
    lineHeight: 24,
  },
  processingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[4],
  },
  processingText: {
    fontSize: theme.swiss.fontSize.body,
    marginLeft: theme.spacing[3],
  },
});

export default VoiceRecorder;
