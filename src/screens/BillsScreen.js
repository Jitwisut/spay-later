import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';
import { useApp } from '../AppContext';

export default function BillsScreen() {
  const { activeBills, paidBills, fmt, openPay } = useApp();
  const [filter, setFilter] = useState('active');

  const currentBills = filter === 'active' ? activeBills : paidBills;
  const totalDue = activeBills.reduce((a, b) => a + b.amount, 0);

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={s.header}>
          <Text style={s.label}>MY BILLS</Text>
          <Text style={s.title}>บิลของฉัน</Text>
        </View>

        {/* Summary card */}
        <View style={s.summaryCard}>
          <View>
            <Text style={s.summaryLabel}>ยอดค้างชำระทั้งหมด</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <Text style={s.summaryCurrency}>฿</Text>
              <Text style={s.summaryTotal}>{totalDue.toLocaleString('en-US')}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.summaryLabel}>รายการ</Text>
            <Text style={s.summaryCount}>{activeBills.length}</Text>
          </View>
        </View>

        {/* Filter tabs */}
        <View style={s.tabs}>
          <TouchableOpacity
            style={[s.tab, filter === 'active' && s.tabActive]}
            onPress={() => setFilter('active')}
            activeOpacity={0.85}
          >
            <Text style={[s.tabTxt, filter === 'active' && s.tabTxtActive]}>กำลังผ่อน</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, filter === 'paid' && s.tabActive]}
            onPress={() => setFilter('paid')}
            activeOpacity={0.85}
          >
            <Text style={[s.tabTxt, filter === 'paid' && s.tabTxtActive]}>ชำระแล้ว</Text>
          </TouchableOpacity>
        </View>

        {/* Bill list */}
        <View style={s.list}>
          {currentBills.map((bill) => {
            const isActive = filter === 'active';
            return (
              <View key={bill.id} style={s.billCard}>
                <View style={s.billLogo}><Text style={s.billLogoTxt}>{bill.logo}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.billName}>{bill.name}</Text>
                  <Text style={s.billSub}>{bill.sub}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.billAmount}>{fmt(bill.amount)}</Text>
                  {isActive && (
                    <TouchableOpacity
                      style={s.payBtn}
                      onPress={() => openPay(bill)}
                      activeOpacity={0.85}
                    >
                      <Text style={s.payBtnTxt}>จ่าย</Text>
                    </TouchableOpacity>
                  )}
                  {!isActive && (
                    <View style={s.paidBadge}><Text style={s.paidBadgeTxt}>PAID</Text></View>
                  )}
                </View>
              </View>
            );
          })}
          {currentBills.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 50 }}>
              <Text style={{ fontSize: 40, color: C.muted }}>✓</Text>
              <Text style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>ไม่มีรายการในหมวดนี้</Text>
            </View>
          )}
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
  summaryCard: {
    marginHorizontal: 20, marginTop: 16, backgroundColor: C.dark, borderRadius: 20,
    padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  summaryLabel: { fontSize: 12, color: C.muted2 },
  summaryCurrency: { color: C.lime, fontWeight: '600', fontSize: 14 },
  summaryTotal: { fontSize: 30, fontWeight: '700', color: C.white, letterSpacing: -0.8 },
  summaryCount: { fontSize: 30, fontWeight: '700', color: C.lime },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 18 },
  tab: {
    flex: 1, textAlign: 'center', paddingVertical: 11, borderRadius: 99,
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border2, alignItems: 'center',
  },
  tabActive: { backgroundColor: C.dark, borderColor: C.dark },
  tabTxt: { fontSize: 14, fontWeight: '600', color: C.muted },
  tabTxtActive: { color: C.lime },
  list: { padding: 14, paddingHorizontal: 20 },
  billCard: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 16, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  billLogo: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: C.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  billLogoTxt: { color: C.white, fontSize: 16, fontWeight: '700' },
  billName: { fontSize: 15, fontWeight: '600', color: C.dark },
  billSub: { fontSize: 12, color: C.muted, marginTop: 2 },
  billAmount: { fontSize: 16, fontWeight: '700', color: C.dark },
  payBtn: {
    marginTop: 5, backgroundColor: C.lime, borderRadius: 99,
    paddingHorizontal: 14, paddingVertical: 5,
  },
  payBtnTxt: { fontSize: 12, fontWeight: '700', color: C.dark },
  paidBadge: {
    marginTop: 5, backgroundColor: C.greenLight, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  paidBadgeTxt: { fontSize: 11, fontWeight: '700', color: C.green },
});
