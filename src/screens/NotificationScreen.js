import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { C } from '../theme';
import { useApp } from '../AppContext';
import { setSetting } from '../database';

const NOTIFS = [
  { key: 'notif_due', label: 'แจ้งเตือนครบกำหนดชำระ', sub: 'แจ้งเตือนล่วงหน้า 3 วันก่อนครบกำหนด', icon: '🔔' },
  { key: 'notif_payment', label: 'ยืนยันการชำระเงิน', sub: 'แจ้งเมื่อชำระเงินสำเร็จ', icon: '✅' },
  { key: 'notif_promo', label: 'โปรโมชันและข้อเสนอพิเศษ', sub: 'ข่าวสารและดีลพิเศษจาก Sabai', icon: '🎁' },
  { key: 'notif_summary', label: 'สรุปรายเดือน', sub: 'รายงานสรุปการใช้จ่ายทุกเดือน', icon: '📊' },
];

export default function NotificationScreen({ navigation }) {
  const { notifSettings, loadNotifSettings } = useApp();

  const toggle = async (key, current) => {
    await setSetting(key, !current);
    await loadNotifSettings();
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Text style={{ fontSize: 18, color: C.dark }}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>การแจ้งเตือน</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={s.infoCard}>
          <Text style={{ fontSize: 13, color: C.greenText, lineHeight: 20 }}>
            การแจ้งเตือนช่วยให้คุณไม่พลาดวันครบกำหนดชำระและอัปเดตสำคัญต่างๆ
          </Text>
        </View>

        <View style={s.section}>
          {NOTIFS.map((item, i) => {
            const isOn = notifSettings[item.key] ?? true;
            return (
              <View key={item.key} style={[s.row, i < NOTIFS.length - 1 && s.rowBorder]}>
                <View style={s.iconBox}><Text style={{ fontSize: 18 }}>{item.icon}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowLabel}>{item.label}</Text>
                  <Text style={s.rowSub}>{item.sub}</Text>
                </View>
                <Switch
                  value={isOn}
                  onValueChange={() => toggle(item.key, isOn)}
                  trackColor={{ false: C.border2, true: C.dark }}
                  thumbColor={isOn ? C.lime : C.white}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, borderColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: C.dark },
  infoCard: { backgroundColor: C.greenLight, borderRadius: 14, padding: 14, marginBottom: 20 },
  section: { backgroundColor: C.white, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 14, fontWeight: '600', color: C.dark },
  rowSub: { fontSize: 12, color: C.muted, marginTop: 2 },
});
