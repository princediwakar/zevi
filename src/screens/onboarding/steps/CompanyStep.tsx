import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

/*
  Using generic categories as per plan, plus some specific ones.
  Plan says: "Popular: Meta, Google... Type: FAANG, Startups..."
*/
const COMPANIES = [
  { id: 'meta', label: 'Meta', type: 'popular' },
  { id: 'google', label: 'Google', type: 'popular' },
  { id: 'amazon', label: 'Amazon', type: 'popular' },
  { id: 'microsoft', label: 'Microsoft', type: 'popular' },
  { id: 'apple', label: 'Apple', type: 'popular' },
  { id: 'netflix', label: 'Netflix', type: 'popular' },
  { id: 'uber', label: 'Uber', type: 'popular' },
  { id: 'airbnb', label: 'Airbnb', type: 'popular' },
  { id: 'faang', label: 'FAANG / Big Tech', type: 'category' },
  { id: 'startup', label: 'Startups (Series A-C)', type: 'category' },
  { id: 'enterprise', label: 'Enterprise (B2B)', type: 'category' },
  { id: 'fintech', label: 'Fintech', type: 'category' },
];

export default function CompanyStep({ onNext, onBack, data, updateData }: OnboardingStepProps) {
  
  const toggleCompany = (id: string) => {
    const current = data.targetCompanies || [];
    if (current.includes(id)) {
      updateData({ targetCompanies: current.filter(c => c !== id) });
    } else {
      updateData({ targetCompanies: [...current, id] });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text> 
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '30%' }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          Target companies?
        </Text>
        <Text style={styles.subtitle}>
          Pick at least one. We'll prioritize practice questions from these companies.
        </Text>

        <Text style={styles.sectionTitle}>
          POPULAR COMPANIES
        </Text>
        <View style={styles.companiesContainer}>
          {COMPANIES.filter(c => c.type === 'popular').map((company) => {
            const isSelected = data.targetCompanies.includes(company.id);
            return (
              <TouchableOpacity
                key={company.id}
                onPress={() => toggleCompany(company.id)}
                style={[
                  styles.companyChip,
                  isSelected ? styles.companyChipSelected : styles.companyChipUnselected
                ]}
              >
                <Text style={[
                  styles.companyChipText,
                  isSelected ? styles.companyChipTextSelected : styles.companyChipTextUnselected
                ]}>
                  {isSelected ? '✓ ' : ''}{company.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          COMPANY TYPES
        </Text>
        <View style={styles.companiesContainer}>
          {COMPANIES.filter(c => c.type === 'category').map((company) => {
             const isSelected = data.targetCompanies.includes(company.id);
             return (
               <TouchableOpacity
                 key={company.id}
                 onPress={() => toggleCompany(company.id)}
                 style={[
                   styles.companyChip,
                   isSelected ? styles.companyChipSelected : styles.companyChipUnselected
                 ]}
               >
                 <Text style={[
                   styles.companyChipText,
                   isSelected ? styles.companyChipTextSelected : styles.companyChipTextUnselected
                 ]}>
                   {isSelected ? '✓ ' : ''}{company.label}
                 </Text>
               </TouchableOpacity>
             );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
         <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => {
                updateData({ targetCompanies: [] });
                onNext();
              }}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.continueButton,
                data.targetCompanies.length > 0 ? styles.continueButtonEnabled : styles.continueButtonDisabled
              ]}
              onPress={onNext}
              disabled={data.targetCompanies.length === 0}
            >
              <Text style={[
                styles.continueButtonText,
                data.targetCompanies.length > 0 ? styles.continueButtonTextEnabled : styles.continueButtonTextDisabled
              ]}>
                Continue
              </Text>
            </TouchableOpacity>
         </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    borderBottomWidth: theme.spacing.borderWidth.thin,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    padding: theme.spacing[2],
    marginLeft: -theme.spacing[2],
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text.primary,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.spacing.borderRadius.sm,
    marginLeft: theme.spacing[4],
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.spacing.borderRadius.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[6],
  },
  title: {
    fontSize: theme.typography.heading.h2.fontSize,
    fontWeight: theme.typography.heading.h2.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.body.lg.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    fontSize: theme.typography.label.sm.fontSize,
    fontWeight: theme.typography.label.sm.fontWeight,
    color: theme.colors.text.disabled,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: theme.spacing[3],
  },
  companiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[6],
  },
  companyChip: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.spacing.borderRadius.full,
    borderWidth: theme.spacing.borderWidth.thin,
  },
  companyChipSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  companyChipUnselected: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border.light,
  },
  companyChipText: {
    fontSize: theme.typography.body.md.fontSize,
    fontWeight: '600',
  },
  companyChipTextSelected: {
    color: theme.colors.text.inverse,
  },
  companyChipTextUnselected: {
    color: theme.colors.text.secondary,
  },
  footer: {
    padding: theme.spacing[6],
    borderTopWidth: theme.spacing.borderWidth.thin,
    borderTopColor: theme.colors.border.light,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  skipButton: {
    flex: 1,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.lg,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: theme.typography.heading.h4.fontWeight,
    color: theme.colors.text.secondary,
  },
  continueButton: {
    flex: 2,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.spacing.borderRadius.lg,
    alignItems: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: theme.colors.primary[500],
    shadowColor: theme.colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.neutral[200],
  },
  continueButtonText: {
    fontSize: theme.typography.heading.h4.fontSize,
    fontWeight: theme.typography.heading.h4.fontWeight,
  },
  continueButtonTextEnabled: {
    color: theme.colors.text.inverse,
  },
  continueButtonTextDisabled: {
    color: theme.colors.text.disabled,
  },
});

