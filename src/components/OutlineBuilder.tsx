/**
 * OutlineBuilder Component
 * Mobile-native bullet outline builder for PM interview practice
 * Supports expandable sections, bullet point management, expert guidance toggle
 * Swiss-style design with International Blue primary color
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { theme } from '../theme';
import { Button } from './ui/Button';
import { TextInput } from './ui/TextInput';
import { Card } from './ui/Card';
import { MinusCircle, PlusCircle, Eye, EyeOff, ChevronRight, ChevronLeft, Mic } from 'lucide-react-native';

export type UserOutline = Record<string, string[]>; // section -> array of bullet points

export interface OutlineBuilderProps {
  // Required
  sections: string[]; // Array of section titles (framework steps or template sections)
  value: UserOutline; // Section -> array of bullet points
  onChange: (value: UserOutline) => void;

  // Optional
  variant?: 'outline' | 'filled';
  size?: 'lg' | 'md' | 'sm';
  readOnly?: boolean;
  maxPointsPerSection?: number;
  placeholder?: string;

  // Expert guidance
  expertOutline?: UserOutline;
  showExpertOutline?: boolean;
  onExpertOutlineToggle?: (show: boolean) => void;

  // Step-by-step mode (for FullPractice)
  currentStep?: number;
  onStepChange?: (step: number) => void;
  mode?: 'pattern' | 'full_practice'; // pattern = all sections expandable, full_practice = step-by-step

  // Submit (optional - component can render its own or rely on parent)
  onSubmit?: () => void;
  submitLabel?: string;
}

/**
 * Swiss Style OutlineBuilder with sharp corners and heavy borders
 */
export const OutlineBuilder: React.FC<OutlineBuilderProps> = ({
  sections,
  value,
  onChange,
  variant = 'outline',
  size = 'md',
  readOnly = false,
  maxPointsPerSection = 10,
  placeholder = 'Add bullet point...',
  expertOutline,
  showExpertOutline = false,
  onExpertOutlineToggle,
  currentStep = 0,
  onStepChange,
  mode = 'pattern',
  onSubmit,
  submitLabel = 'Submit',
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [newPointInputs, setNewPointInputs] = useState<Record<string, string>>({});
  
  // Undo functionality - track recently removed points
  const [undoStack, setUndoStack] = useState<{section: string; index: number; point: string}[]>([]);
  const [showUndoButton, setShowUndoButton] = useState(false);

  // Size configurations
  const sizeConfig = {
    lg: {
      padding: theme.spacing[6], // 24px
      fontSize: 16,
      bulletSize: 20,
    },
    md: {
      padding: theme.spacing[5], // 20px
      fontSize: 14,
      bulletSize: 18,
    },
    sm: {
      padding: theme.spacing[4], // 16px
      fontSize: 12,
      bulletSize: 16,
    },
  };

  // Variant configurations
  const variantConfig = {
    outline: {
      backgroundColor: theme.colors.surface.primary,
      borderColor: theme.colors.border.medium,
      borderWidth: theme.spacing.borderWidth.medium, // Heavy border (2px)
    },
    filled: {
      backgroundColor: theme.colors.surface.secondary,
      borderColor: 'transparent',
      borderWidth: 0,
    },
  };

  const config = variantConfig[variant];
  const sizeStyle = sizeConfig[size];

  // Helper functions
  const addPoint = (section: string, point: string) => {
    if (!point.trim() || readOnly) return;

    const newValue = { ...value };
    if (!newValue[section]) {
      newValue[section] = [];
    }

    if (newValue[section].length >= maxPointsPerSection) {
      // Could show a warning here
      return;
    }

    newValue[section].push(point.trim());
    onChange(newValue);
    setNewPointInputs(prev => ({ ...prev, [section]: '' }));
  };

  const removePoint = (section: string, index: number) => {
    if (readOnly) return;

    const pointToRemove = value[section]?.[index];
    if (!pointToRemove) return;

    const newValue = { ...value };
    if (newValue[section]) {
      newValue[section].splice(index, 1);
      if (newValue[section].length === 0) {
        delete newValue[section];
      }
      onChange(newValue);
      
      // Add to undo stack for recovery
      if (undoStack.length >= 5) {
        // Keep only last 5 items
        setUndoStack(prev => [...prev.slice(1), { section, index, point: pointToRemove }]);
      } else {
        setUndoStack(prev => [...prev, { section, index, point: pointToRemove }]);
      }
      setShowUndoButton(true);
      
      // Auto-hide undo button after 5 seconds
      setTimeout(() => setShowUndoButton(false), 5000);
    }
  };

  const handleUndo = () => {
    const lastItem = undoStack[undoStack.length - 1];
    if (!lastItem) return;

    const newValue = { ...value };
    if (!newValue[lastItem.section]) {
      newValue[lastItem.section] = [];
    }
    // Insert back at the original position
    newValue[lastItem.section].splice(lastItem.index, 0, lastItem.point);
    onChange(newValue);
    
    // Remove from undo stack
    setUndoStack(prev => prev.slice(0, -1));
    if (undoStack.length <= 1) {
      setShowUndoButton(false);
    }
  };

  const toggleSection = (section: string) => {
    if (mode === 'full_practice') return; // No expand/collapse in step-by-step mode

    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleNewPointChange = (section: string, text: string) => {
    setNewPointInputs(prev => ({ ...prev, [section]: text }));
  };

  const handleStepChange = (direction: 'next' | 'prev') => {
    if (!onStepChange) return;

    if (direction === 'next' && currentStep < sections.length - 1) {
      onStepChange(currentStep + 1);
    } else if (direction === 'prev' && currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  // Voice input handler - triggers native dictation
  const handleVoiceInput = (section: string) => {
    // On iOS, we can use Speech recognition via native modules
    // For now, this is a placeholder that shows the intent
    // In production, integrate with expo-speech-recognition or similar
    console.log('Voice input requested for section:', section);
  };

  // Render section for pattern mode (all sections expandable)
  const renderPatternSection = (section: string, index: number) => {
    const isExpanded = expandedSections.has(section);
    const sectionPoints = value[section] || [];
    const newPointInput = newPointInputs[section] || '';

    return (
      <Card
        key={section}
        variant="outline"
        radius="none"
        padding={sizeStyle.padding}
        style={[
          styles.sectionCard,
          {
            borderWidth: config.borderWidth,
            borderColor: config.borderColor,
            backgroundColor: config.backgroundColor,
          },
        ]}
      >
        {/* Section Header */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section)}
          disabled={readOnly}
          accessibilityLabel={`${section} section. ${isExpanded ? 'Expanded' : 'Collapsed'}. ${sectionPoints.length} points`}
          accessibilityHint="Tap to expand or collapse this section"
          accessibilityRole="button"
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            {isExpanded ? '▼' : '►'} {section}
          </Text>
          <Text style={[styles.sectionCount, { color: theme.colors.text.secondary }]}>
            {sectionPoints.length} {sectionPoints.length === 1 ? 'point' : 'points'}
          </Text>
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.sectionContent}>
            {/* Points List */}
            <View style={styles.pointsList}>
              {sectionPoints.map((point, pointIndex) => (
                <View key={pointIndex} style={styles.pointItem}>
                  <Text style={[styles.bullet, { color: theme.colors.primary[500] }]}>•</Text>
                  <Text style={[styles.pointText, { color: theme.colors.text.primary, flex: 1 }]}>
                    {point}
                  </Text>
                  {!readOnly && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removePoint(section, pointIndex)}
                      accessibilityLabel="Remove bullet point"
                      accessibilityHint={`Remove "${point.slice(0, 30)}..." from this section`}
                      accessibilityRole="button"
                    >
                      <MinusCircle size={sizeStyle.bulletSize} color={theme.colors.semantic.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Expert Guidance (if provided) */}
            {expertOutline && expertOutline[section] && (
              <View style={styles.expertSection}>
                <View style={styles.expertHeader}>
                  <TouchableOpacity
                    onPress={() => onExpertOutlineToggle?.(!showExpertOutline)}
                    style={styles.expertToggle}
                  >
                    {showExpertOutline ? (
                      <EyeOff size={16} color={theme.colors.primary[500]} />
                    ) : (
                      <Eye size={16} color={theme.colors.primary[500]} />
                    )}
                    <Text style={[styles.expertTitle, { color: theme.colors.primary[500] }]}>
                      Expert Guidance
                    </Text>
                  </TouchableOpacity>
                </View>
                {showExpertOutline && (
                  <View style={styles.expertPoints}>
                    {expertOutline[section].map((point, idx) => (
                      <Text key={idx} style={[styles.expertPoint, { color: theme.colors.text.secondary }]}>
                        • {point}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Add Point Input (if not read-only) */}
            {!readOnly && (
              <View style={styles.addPointContainer}>
                <TextInput
                  variant="outline"
                  size={size}
                  placeholder="Tap mic to speak your point..."
                  value={newPointInput}
                  onChangeText={(text) => handleNewPointChange(section, text)}
                  style={styles.addPointInput}
                  onSubmitEditing={() => addPoint(section, newPointInput)}
                />
                <TouchableOpacity
                  style={[
                    styles.voiceButton,
                    { backgroundColor: theme.colors.primary[500] }
                  ]}
                  onPress={() => handleVoiceInput(section)}
                >
                  <Mic size={sizeStyle.bulletSize} color="white" />
                </TouchableOpacity>
                <Button
                  variant="primary"
                  size="sm"
                  onPress={() => addPoint(section, newPointInput)}
                  style={styles.addButton}
                >
                  <PlusCircle size={sizeStyle.bulletSize} color={theme.colors.text.inverse} />
                </Button>
              </View>
            )}
          </View>
        )}
      </Card>
    );
  };

  // Render step-by-step mode (for FullPractice)
  const renderStepByStep = () => {
    const currentSection = sections[currentStep];
    const sectionPoints = value[currentSection] || [];
    const newPointInput = newPointInputs[currentSection] || '';
    const currentExpertPoints = expertOutline?.[currentSection] || [];

    return (
      <Card
        variant="outline"
        radius="none"
        padding={sizeStyle.padding}
        style={[
          styles.stepCard,
          {
            borderWidth: config.borderWidth,
            borderColor: config.borderColor,
            backgroundColor: config.backgroundColor,
          },
        ]}
      >
        {/* Step Header */}
        <View style={styles.stepHeader}>
          <Text style={[styles.stepNumber, { color: theme.colors.primary[500] }]}>
            {currentStep + 1}
          </Text>
          <Text style={[styles.stepTitle, { color: theme.colors.text.primary }]}>
            {currentSection}
          </Text>
        </View>

        {/* Expert Guidance Toggle */}
        {expertOutline && currentExpertPoints.length > 0 && (
          <View style={styles.expertSection}>
            <TouchableOpacity
              style={styles.expertToggleRow}
              onPress={() => onExpertOutlineToggle?.(!showExpertOutline)}
            >
              {showExpertOutline ? (
                <EyeOff size={16} color={theme.colors.primary[500]} />
              ) : (
                <Eye size={16} color={theme.colors.primary[500]} />
              )}
              <Text style={[styles.expertTitle, { color: theme.colors.primary[500] }]}>
                {showExpertOutline ? 'Hide Expert Guidance' : 'Show Expert Guidance'}
              </Text>
            </TouchableOpacity>
            {showExpertOutline && (
              <View style={styles.expertPoints}>
                {currentExpertPoints.map((point, idx) => (
                  <Text key={idx} style={[styles.expertPoint, { color: theme.colors.text.secondary }]}>
                    • {point}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Points List */}
        <View style={styles.pointsList}>
          {sectionPoints.map((point, pointIndex) => (
            <View key={pointIndex} style={styles.pointItem}>
              <Text style={[styles.bullet, { color: theme.colors.primary[500] }]}>•</Text>
              <Text style={[styles.pointText, { color: theme.colors.text.primary, flex: 1 }]}>
                {point}
              </Text>
              {!readOnly && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePoint(currentSection, pointIndex)}
                  accessibilityLabel="Remove bullet point"
                  accessibilityHint={`Remove "${point.slice(0, 30)}..." from this section`}
                  accessibilityRole="button"
                >
                  <MinusCircle size={sizeStyle.bulletSize} color={theme.colors.semantic.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Add Point Input (if not read-only) */}
        {!readOnly && (
          <View style={styles.addPointContainer}>
            <TextInput
              variant="outline"
              size={size}
              placeholder="Tap mic to speak your point..."
              value={newPointInput}
              onChangeText={(text) => handleNewPointChange(currentSection, text)}
              style={styles.addPointInput}
              onSubmitEditing={() => addPoint(currentSection, newPointInput)}
            />
            <TouchableOpacity
              style={[
                styles.voiceButton,
                { backgroundColor: theme.colors.primary[500] }
              ]}
              onPress={() => handleVoiceInput(currentSection)}
            >
              <Mic size={sizeStyle.bulletSize} color="white" />
            </TouchableOpacity>
            <Button
              variant="primary"
              size="sm"
              onPress={() => addPoint(currentSection, newPointInput)}
              style={styles.addButton}
            >
              <PlusCircle size={sizeStyle.bulletSize} color={theme.colors.text.inverse} />
            </Button>
          </View>
        )}

        {/* Step Navigation */}
        {onStepChange && (
          <View style={styles.stepNavigation}>
            <Button
              variant="outline"
              size="sm"
              onPress={() => handleStepChange('prev')}
              disabled={currentStep === 0}
              leftIcon={<ChevronLeft size={16} color={theme.colors.text.primary} />}
            >
              Previous
            </Button>
            <Text style={[styles.stepCounter, { color: theme.colors.text.secondary }]}>
              {currentStep + 1} of {sections.length}
            </Text>
            <Button
              variant="primary"
              size="sm"
              onPress={() => handleStepChange('next')}
              disabled={currentStep === sections.length - 1}
              rightIcon={<ChevronRight size={16} color={theme.colors.text.inverse} />}
            >
              {currentStep === sections.length - 1 ? 'Review' : 'Next'}
            </Button>
          </View>
        )}
      </Card>
    );
  };

  // Main render
  return (
    <View style={styles.container}>
      {mode === 'pattern' ? (
        <ScrollView 
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {sections.map((section, index) => renderPatternSection(section, index))}
        </ScrollView>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={styles.stepByStepContent}
        >
          {renderStepByStep()}
        </ScrollView>
      )}

      {/* Undo Button - shows when a point was recently removed */}
      {showUndoButton && undoStack.length > 0 && (
        <View style={styles.undoContainer}>
          <TouchableOpacity 
            style={styles.undoButton}
            onPress={handleUndo}
            accessibilityLabel="Undo last action"
            accessibilityHint="Restore the last deleted bullet point"
            accessibilityRole="button"
          >
            <Text style={styles.undoText}>↩ Undo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Submit Button (if provided) */}
      {onSubmit && (
        <View style={styles.submitContainer}>
          <Button
            variant="primary"
            size="lg"
            onPress={onSubmit}
            fullWidth
          >
            {submitLabel}
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  sectionCard: {
    marginBottom: theme.spacing[4],
  },
  stepCard: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing[3],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionContent: {
    gap: theme.spacing[4],
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  stepNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: theme.spacing[3],
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  pointsList: {
    gap: theme.spacing[2],
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  bullet: {
    fontSize: 16,
    fontWeight: '600',
    width: 16,
  },
  pointText: {
    fontSize: 14,
    lineHeight: 20,
  },
  removeButton: {
    padding: theme.spacing[1],
  },
  expertSection: {
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.spacing.borderRadius.sm,
    padding: theme.spacing[3],
    gap: theme.spacing[2],
  },
  expertHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  expertToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  expertToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
    marginBottom: theme.spacing[3],
  },
  expertTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  expertPoints: {
    gap: theme.spacing[1],
    paddingLeft: theme.spacing[2],
  },
  expertPoint: {
    fontSize: 12,
    lineHeight: 16,
  },
  addPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  addPointInput: {
    flex: 1,
  },
  addButton: {
    minHeight: 40,
    minWidth: 40,
  },
  voiceButton: {
    minHeight: 40,
    minWidth: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing[4],
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitContainer: {
    marginTop: theme.spacing[6],
  },
  stepByStepContent: {
    flexGrow: 1,
  },
  undoContainer: {
    position: 'absolute',
    bottom: theme.spacing[6],
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  undoButton: {
    backgroundColor: theme.colors.neutral[800],
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.md,
  },
  undoText: {
    color: theme.colors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OutlineBuilder;