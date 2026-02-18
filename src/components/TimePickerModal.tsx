import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// ---- Constants ----
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1–12
const MINUTES = [0, 15, 30, 45];
const PERIODS = ['AM', 'PM'] as const;

export type Period = 'AM' | 'PM';

// ---- Helpers ----
export function to24Hour(hour12: number, period: Period): number {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

export function from24Hour(hour24: number): { hour12: number; period: Period } {
  const period: Period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period };
}

// ---- Props ----
export interface TimePickerModalProps {
  visible: boolean;
  hour: number; // 24h
  minute: number;
  onConfirm: (hour: number, minute: number) => void;
  onCancel: () => void;
}

export function TimePickerModal({ visible, hour, minute, onConfirm, onCancel }: TimePickerModalProps) {
  const { hour12: initHour12, period: initPeriod } = from24Hour(hour);
  const [selectedHour, setSelectedHour] = React.useState(initHour12);
  const [selectedMinute, setSelectedMinute] = React.useState(minute);
  const [selectedPeriod, setSelectedPeriod] = React.useState<Period>(initPeriod);

  useEffect(() => {
    if (visible) {
      const { hour12, period } = from24Hour(hour);
      setSelectedHour(hour12);
      setSelectedMinute(minute);
      setSelectedPeriod(period);
    }
  }, [visible, hour, minute]);

  const handleConfirm = (): void => {
    onConfirm(to24Hour(selectedHour, selectedPeriod), selectedMinute);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>SET REMINDER TIME</Text>
          </View>

          <View style={styles.columns}>
            {/* Hour */}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>HOUR</Text>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                {HOURS.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.item, selectedHour === h && styles.itemSelected]}
                    onPress={() => setSelectedHour(h)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.itemText, selectedHour === h && styles.itemTextSelected]}>
                      {h}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Minute */}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>MIN</Text>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                {MINUTES.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.item, selectedMinute === m && styles.itemSelected]}
                    onPress={() => setSelectedMinute(m)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.itemText, selectedMinute === m && styles.itemTextSelected]}>
                      {m < 10 ? `0${m}` : m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* AM/PM */}
            <View style={styles.column}>
              <Text style={styles.columnLabel}>AM/PM</Text>
              <View style={styles.scroll}>
                {PERIODS.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.item, selectedPeriod === p && styles.itemSelected]}
                    onPress={() => setSelectedPeriod(p)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.itemText, selectedPeriod === p && styles.itemTextSelected]}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
              <Text style={styles.confirmBtnText}>SET TIME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 3,
    borderTopColor: '#000000',
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#000000',
  },
  columns: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#888888',
    marginBottom: 10,
  },
  scroll: {
    width: '100%',
    maxHeight: 220,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 6,
    alignItems: 'center',
  },
  itemSelected: {
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  itemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#000000',
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#888888',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#FFFFFF',
  },
});
