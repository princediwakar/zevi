import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { OnboardingStepProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    fontSize: 24,
    color: '#1E293B',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    marginLeft: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  companiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  companyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  companyChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  companyChipUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  companyChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  companyChipTextSelected: {
    color: '#FFFFFF',
  },
  companyChipTextUnselected: {
    color: '#475569',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
  },
  continueButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  continueButtonTextEnabled: {
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#94A3B8',
  },
});
