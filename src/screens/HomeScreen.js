import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { C } from '../theme';
import { useApp } from '../AppContext';

export default function HomeScreen({ navigation }) {
  const { activeBills, fmt, openPay, user } = useApp();
  const totalUsed = user?.credit_used ?? 25500;
  const totalCredit = user?.credit_limit ?? 50000;
  const available = totalCredit - totalUsed;
  const usedPct = totalCredit > 0 ? totalUsed / totalCredit : 0;
  const dueBill = activeBills[0] || null;
  const displayName = user ? `${user.name.split(' ')[0]} ${user.initials}.` : '...';
  const displayInitial = user?.initials ?? 'น';

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.welcome}>WELCOME BACK</Text>
            <Text style={s.name}>{displayName}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={s.avatar}
            activeOpacity={0.8}
          >
            <Text style={s.avatarTxt}>{displayInitial}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero card */}
        <View style={s.hero}>
          <View style={s.heroBubble} />
          <Text style={s.heroLabel}>AVAILABLE · วงเงินคงเหลือ</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 10 }}>
            <Text style={s.heroCurrency}>฿</Text>
            <Text style={s.heroAmount}>{available.toLocaleString('en-US')}</Text>
          </View>
          <View style={s.progressBar}>
            <View style={[s.progressFill, { flex: Math.round(usedPct * 100) }]} />
            <View style={[s.progressEmpty, { flex: Math.round((1 - usedPct) * 100) }]} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={s.progressLabel}>ใช้ไป ฿{totalUsed.toLocaleString('en-US')}</Text>
            <Text style={s.progressLabel}>วงเงิน ฿{totalCredit.toLocaleString('en-US')}</Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.actionDark}
            onPress={() => navigation.navigate('Bills')}
            activeOpacity={0.85}
          >
            <Text style={s.actionIcon}>↑</Text>
            <Text style={s.actionLabelWhite}>จ่ายบิล{'\n'}<Text style={s.actionSub}>Pay now</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.actionLime} onPress={() => navigation.navigate('Products')} activeOpacity={0.85}>
            <Text style={s.actionIcon}>⊞</Text>
            <Text style={s.actionLabelDark}>ผ่อนสินค้า{'\n'}<Text style={s.actionSubDark}>Installment</Text></Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.actionOutline}
            onPress={() => navigation.navigate('Bills')}
            activeOpacity={0.85}
          >
            <Text style={s.actionIcon}>↻</Text>
            <Text style={s.actionLabelDark}>ประวัติ{'\n'}<Text style={s.actionSubMuted}>History</Text></Text>
          </TouchableOpacity>
        </View>

        {/* Due alert */}
        {dueBill && (
          <View style={s.dueAlert}>
            <Text style={s.dueLabel}>DUE{'\n'}NEXT</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.dueName}>{dueBill.name} · ครบกำหนด</Text>
              <Text style={s.dueAmount}>{fmt(dueBill.amount)}</Text>
            </View>
            <TouchableOpacity
              style={s.dueBtn}
              onPress={() => openPay(dueBill)}
              activeOpacity={0.85}
            >
              <Text style={s.dueBtnTxt}>จ่าย</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recent bills */}
        <View style={s.recentHeader}>
          <Text style={s.recentTitle}>รายการที่กำลังผ่อน</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bills')}>
            <Text style={s.recentAll}>ทั้งหมด</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 8 }}>
          {activeBills.map((bill) => (
            <TouchableOpacity
              key={bill.id}
              onPress={() => openPay(bill)}
              style={s.billRow}
              activeOpacity={0.75}
            >
              <View style={s.billLogo}><Text style={s.billLogoTxt}>{bill.logo}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.billName}>{bill.name}</Text>
                <Text style={s.billSub}>{bill.sub}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.billAmount}>{fmt(bill.amount)}</Text>
                <Text style={s.billTap}>แตะเพื่อจ่าย</Text>
              </View>
            </TouchableOpacity>
          ))}
          {activeBills.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Text style={{ fontSize: 32 }}>✓</Text>
              <Text style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>ไม่มีรายการที่กำลังผ่อน</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 14, paddingBottom: 0,
  },
  welcome: { fontSize: 12, color: C.muted, fontWeight: '500', letterSpacing: 0.6 },
  name: { fontSize: 22, fontWeight: '700', color: C.dark, letterSpacing: -0.5 },
  avatar: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: C.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTxt: { color: C.lime, fontWeight: '700', fontSize: 16 },
  hero: {
    margin: 20, marginTop: 18, backgroundColor: C.dark, borderRadius: 24, padding: 22,
    overflow: 'hidden', position: 'relative',
  },
  heroBubble: {
    position: 'absolute', right: -30, top: -30, width: 140, height: 140,
    borderRadius: 70, backgroundColor: C.lime, opacity: 0.16,
  },
  heroLabel: { fontSize: 12, color: C.muted2, fontWeight: '500', letterSpacing: 0.5 },
  heroCurrency: { fontSize: 18, fontWeight: '600', color: C.lime },
  heroAmount: { fontSize: 46, fontWeight: '700', color: C.white, letterSpacing: -2, lineHeight: 54 },
  progressBar: { flexDirection: 'row', gap: 6, marginTop: 20, marginBottom: 8 },
  progressFill: { height: 6, backgroundColor: C.lime, borderRadius: 99 },
  progressEmpty: { height: 6, backgroundColor: '#333', borderRadius: 99 },
  progressLabel: { fontSize: 12, color: C.muted2 },
  actions: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 18 },
  actionDark: {
    flex: 1, backgroundColor: C.dark, borderRadius: 16, padding: 14,
  },
  actionLime: { flex: 1, backgroundColor: C.lime, borderRadius: 16, padding: 14 },
  actionOutline: {
    flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 14,
    borderWidth: 1.5, borderColor: C.dark,
  },
  actionIcon: { fontSize: 22, lineHeight: 28 },
  actionLabelWhite: { fontSize: 12, fontWeight: '600', color: C.white, marginTop: 18 },
  actionLabelDark: { fontSize: 12, fontWeight: '600', color: C.dark, marginTop: 18 },
  actionSub: { fontSize: 11, color: C.muted2, fontWeight: '400' },
  actionSubDark: { fontSize: 11, color: C.green, fontWeight: '400' },
  actionSubMuted: { fontSize: 11, color: C.muted, fontWeight: '400' },
  dueAlert: {
    marginHorizontal: 20, marginTop: 16, backgroundColor: C.white,
    borderWidth: 1.5, borderColor: C.dark, borderRadius: 18, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  dueLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: C.dark,
    writingDirection: 'ltr', textAlign: 'center',
  },
  dueName: { fontSize: 13, color: C.muted, fontWeight: '500' },
  dueAmount: { fontSize: 24, fontWeight: '700', color: C.dark, letterSpacing: -0.5, marginTop: 2 },
  dueBtn: { backgroundColor: C.dark, borderRadius: 99, paddingHorizontal: 20, paddingVertical: 11 },
  dueBtnTxt: { color: C.lime, fontSize: 13, fontWeight: '700' },
  recentHeader: {
    paddingHorizontal: 24, paddingTop: 20, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  recentTitle: { fontSize: 15, fontWeight: '700', color: C.dark },
  recentAll: {
    fontSize: 12, color: C.dark, fontWeight: '600',
    textDecorationLine: 'underline', textDecorationColor: C.lime,
  },
  billRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  billLogo: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: C.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  billLogoTxt: { color: C.white, fontSize: 16, fontWeight: '700' },
  billName: { fontSize: 14, fontWeight: '600', color: C.dark },
  billSub: { fontSize: 12, color: C.muted, marginTop: 1 },
  billAmount: { fontSize: 15, fontWeight: '700', color: C.dark },
  billTap: { fontSize: 11, color: C.muted, marginTop: 1 },
});
