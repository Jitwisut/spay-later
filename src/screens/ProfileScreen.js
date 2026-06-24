import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';
import { useApp } from '../AppContext';

export default function ProfileScreen({ navigation }) {
  const { user, bankAccounts, notifSettings, fmt } = useApp();
  if (!user) return null;

  const defaultBank = bankAccounts.find((b) => b.is_default);
  const available = user.credit_limit - user.credit_used;
  const notifOn = Object.values(notifSettings).filter(Boolean).length;

  const SETTINGS = [
    { icon: '👤', label: 'ข้อมูลส่วนตัว', value: user.phone, onPress: () => navigation.navigate('PersonalInfo') },
    { icon: '🏦', label: 'บัญชีธนาคาร', value: defaultBank ? `${defaultBank.bank_name} ${defaultBank.masked_number}` : '-', onPress: () => navigation.navigate('BankAccount') },
    { icon: '🔔', label: 'การแจ้งเตือน', value: `เปิด ${notifOn} รายการ`, onPress: () => navigation.navigate('Notification') },
    { icon: '🌐', label: 'ภาษา · Language', value: 'ไทย', onPress: () => {} },
  ];

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={s.header}>
          <Text style={s.label}>ACCOUNT</Text>
          <Text style={s.title}>โปรไฟล์</Text>
        </View>

        {/* Identity */}
        <View style={s.identity}>
          <View style={s.avatar}>
            <Text style={s.avatarTxt}>{user.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.fullName}>{user.name}</Text>
            <Text style={s.phone}>{user.phone}</Text>
            <View style={s.badge}>
              <Text style={s.badgeTxt}>★ สมาชิก {user.tier}</Text>
            </View>
          </View>
        </View>

        {/* KYC */}
        <View style={s.kycCard}>
          <View style={s.kycIcon}><Text style={{ color: C.lime, fontSize: 18 }}>✓</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.kycTitle}>ยืนยันตัวตนแล้ว</Text>
            <Text style={s.kycSub}>KYC Verified · บัตรประชาชน</Text>
          </View>
        </View>

        {/* Credit */}
        <View style={s.creditCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.creditLabel}>วงเงินรวม</Text>
            <Text style={s.creditValue}>{fmt(user.credit_limit)}</Text>
          </View>
          <View style={s.creditDivider} />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={s.creditLabel}>ใช้ได้</Text>
            <Text style={[s.creditValue, { color: C.green }]}>{fmt(available)}</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
          {SETTINGS.map((row, i) => (
            <TouchableOpacity key={i} style={s.settingRow} onPress={row.onPress} activeOpacity={0.7}>
              <View style={s.settingIcon}><Text style={{ fontSize: 16 }}>{row.icon}</Text></View>
              <Text style={s.settingLabel}>{row.label}</Text>
              {row.value ? <Text style={s.settingValue} numberOfLines={1}>{row.value}</Text> : null}
              <Text style={s.settingArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
          <TouchableOpacity style={{ padding: 12, alignItems: 'center' }} activeOpacity={0.7}
            onPress={() => navigation.navigate('Pin')}>
            <Text style={s.logout}>ออกจากระบบ</Text>
          </TouchableOpacity>
          <Text style={s.version}>Sabai · เวอร์ชัน 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { padding: 24, paddingBottom: 0 },
  label: { fontSize: 12, color: C.muted, fontWeight: '500', letterSpacing: 0.6 },
  title: { fontSize: 26, fontWeight: '700', color: C.dark, letterSpacing: -0.5, marginTop: 2 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 16, marginHorizontal: 20, marginTop: 16 },
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: C.lime, fontWeight: '700', fontSize: 24 },
  fullName: { fontSize: 19, fontWeight: '700', color: C.dark },
  phone: { fontSize: 13, color: C.muted, marginTop: 2 },
  badge: { marginTop: 6, alignSelf: 'flex-start', backgroundColor: C.dark, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  badgeTxt: { color: C.lime, fontSize: 11, fontWeight: '700' },
  kycCard: { marginHorizontal: 20, marginTop: 18, backgroundColor: C.greenLight, borderWidth: 1, borderColor: C.greenBorder, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  kycIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  kycTitle: { fontSize: 14, fontWeight: '700', color: C.greenText },
  kycSub: { fontSize: 12, color: C.greenSub, marginTop: 2 },
  creditCard: { marginHorizontal: 20, marginTop: 14, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center' },
  creditLabel: { fontSize: 12, color: C.muted },
  creditValue: { fontSize: 20, fontWeight: '700', color: C.dark, marginTop: 2 },
  creditDivider: { width: 1, height: 44, backgroundColor: C.border, marginHorizontal: 16 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: C.border },
  settingIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: C.dark },
  settingValue: { fontSize: 12, color: C.muted2, maxWidth: 120 },
  settingArrow: { fontSize: 16, color: C.muted4 },
  logout: { color: '#C0392B', fontSize: 14, fontWeight: '600' },
  version: { textAlign: 'center', color: '#B8B8B0', fontSize: 11, marginTop: 4 },
});
