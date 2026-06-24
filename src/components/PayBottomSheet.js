import React, { useEffect, useRef } from 'react';
import {
  View, Text, Modal, TouchableOpacity, Animated, Easing, StyleSheet,
} from 'react-native';
import { C } from '../theme';
import { useApp } from '../AppContext';

export default function PayBottomSheet() {
  const { pay, paySuccess, closePay, confirmPay, finishPay, fmt } = useApp();
  const slideAnim = useRef(new Animated.Value(400)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pay) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 12 }).start();
    } else {
      slideAnim.setValue(400);
    }
  }, [pay]);

  useEffect(() => {
    if (paySuccess) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }).start();
    }
  }, [paySuccess]);

  if (!pay) return null;

  const bill = { ...pay, amountStr: fmt(pay.amount) };

  return (
    <Modal transparent animationType="none" visible onRequestClose={closePay}>
      <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={!paySuccess ? closePay : undefined} />
      <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={s.handle} />

        {!paySuccess ? (
          <>
            <Text style={s.title}>ชำระบิล</Text>
            <View style={s.billCard}>
              <View style={s.billLogo}><Text style={s.billLogoTxt}>{bill.logo}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.billName}>{bill.name}</Text>
                <Text style={s.billSub}>{bill.sub}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', marginVertical: 22 }}>
              <Text style={s.amountLabel}>ยอดที่ต้องชำระ</Text>
              <Text style={s.amountText}>{bill.amountStr}</Text>
            </View>
            <View style={s.bankRow}>
              <View style={s.bankIcon}><Text style={{ color: C.lime, fontSize: 16 }}>฿</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.bankName}>บัญชี SCB ••4521</Text>
                <Text style={s.bankSub}>ตัดบัญชีอัตโนมัติ</Text>
              </View>
              <Text style={{ color: C.muted4, fontSize: 18 }}>›</Text>
            </View>
            <TouchableOpacity style={s.confirmBtn} onPress={confirmPay} activeOpacity={0.85}>
              <Text style={s.confirmBtnTxt}>ยืนยันการชำระ {bill.amountStr}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 14 }}>
            <Animated.View style={[s.successCircle, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={{ fontSize: 44, color: C.dark }}>✓</Text>
            </Animated.View>
            <Text style={s.successTitle}>ชำระเงินสำเร็จ</Text>
            <Text style={s.successSub}>ชำระ {bill.name} จำนวน {bill.amountStr}</Text>
            <TouchableOpacity style={s.confirmBtn} onPress={finishPay} activeOpacity={0.85}>
              <Text style={s.confirmBtnTxt}>เสร็จสิ้น</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(14,14,13,0.5)',
  },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: C.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 22, paddingBottom: 36,
  },
  handle: {
    width: 44, height: 5, borderRadius: 99, backgroundColor: '#D6D4CC',
    alignSelf: 'center', marginBottom: 18,
  },
  title: { fontSize: 19, fontWeight: '700', color: C.dark, marginBottom: 16 },
  billCard: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  billLogo: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: C.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  billLogoTxt: { color: C.white, fontSize: 17, fontWeight: '700' },
  billName: { fontSize: 15, fontWeight: '600', color: C.dark },
  billSub: { fontSize: 12, color: C.muted, marginTop: 2 },
  amountLabel: { fontSize: 13, color: C.muted },
  amountText: { fontSize: 42, fontWeight: '700', color: C.dark, letterSpacing: -1, marginTop: 4 },
  bankRow: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  bankIcon: {
    width: 36, height: 36, borderRadius: 9, backgroundColor: C.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  bankName: { fontSize: 14, fontWeight: '600', color: C.dark },
  bankSub: { fontSize: 12, color: C.muted, marginTop: 2 },
  confirmBtn: {
    marginTop: 18, backgroundColor: C.dark, borderRadius: 99, padding: 17, alignItems: 'center',
  },
  confirmBtnTxt: { color: C.lime, fontSize: 16, fontWeight: '700' },
  successCircle: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: C.lime,
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { fontSize: 24, fontWeight: '700', color: C.dark, marginTop: 20 },
  successSub: { fontSize: 14, color: C.muted, marginTop: 6 },
});
