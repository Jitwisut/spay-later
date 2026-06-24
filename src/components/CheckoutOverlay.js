import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, Modal, TouchableOpacity, ScrollView, Animated, StyleSheet,
} from 'react-native';
import { C } from '../theme';
import { useApp } from '../AppContext';
import { PRODUCT_IMAGES } from '../productImages';

const money = (amount) => `฿${Number(amount).toLocaleString('en-US')}`;

function createPlans(product) {
  const makePlan = (title, months, rate, fee) => {
    const total = Math.ceil(product.price * (1 + rate));
    return { title, months, monthly: Math.ceil(total / months), perSub: months === 1 ? 'วันนี้' : '/เดือน', fee, total };
  };

  return [
    makePlan('จ่ายเต็มจำนวน', 1, 0, 'ไม่มีค่าธรรมเนียม'),
    makePlan('ผ่อน 3 เดือน', 3, 0, '0% ดอกเบี้ย'),
    makePlan('ผ่อน 6 เดือน', 6, 0.035, 'ค่าธรรมเนียม 3.5%'),
    makePlan('ผ่อน 10 เดือน', 10, 0.07, 'ค่าธรรมเนียม 7%'),
  ];
}

function PlanStep({ product, plans, planIndex, onSelect }) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 16 }}>
      <View style={s.productCard}>
        <View style={s.productIcon}>
          <Image source={PRODUCT_IMAGES[product.image_key] || PRODUCT_IMAGES.laptop} style={s.checkoutProductImage} resizeMode="cover" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.productName}>{product.name}</Text>
          <Text style={s.productSub}>{product.chip} · {product.specs}</Text>
        </View>
        <Text style={s.productPrice}>{money(product.price)}</Text>
      </View>

      <Text style={s.sectionLabel}>เลือกแผนการชำระ · CHOOSE A PLAN</Text>

      {plans.map((p, i) => {
        const selected = i === planIndex;
        return (
          <TouchableOpacity
            key={i}
            onPress={() => onSelect(i)}
            activeOpacity={0.85}
            style={[s.planCard, selected && s.planCardSelected]}
          >
            <View style={selected ? s.radioSelected : s.radioEmpty}>
              {selected && <Text style={{ color: C.lime, fontSize: 13 }}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={s.planTitle}>{p.title}</Text>
                <Text style={s.planPer}>{money(p.monthly)}<Text style={s.planPerSub}>{p.perSub}</Text></Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                <Text style={s.planFee}>{p.fee}</Text>
                <Text style={s.planFee}>รวม {money(p.total)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function ConfirmStep({ product, plan }) {
  const schedule = [
    { label: 'งวดที่ 1 · 24 ก.ค. 2569', amount: money(plan.monthly), dot: C.lime },
    { label: 'งวดที่ 2 · 24 ส.ค. 2569', amount: money(plan.monthly), dot: '#D6D4CC' },
    { label: 'งวดถัดไป...', amount: money(plan.monthly), dot: '#D6D4CC' },
  ];
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 16 }}>
      <View style={s.confirmHero}>
        <Text style={s.confirmHeroLabel}>แผนที่เลือก</Text>
        <Text style={s.confirmHeroTitle}>{plan.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 14 }}>
          <Text style={s.confirmHeroPer}>{money(plan.monthly)}</Text>
          <Text style={s.confirmHeroPerSub}>{plan.perSub}</Text>
        </View>
      </View>

      <View style={s.confirmCard}>
        {[
          ['สินค้า', product.name],
          ['ยอดสินค้า', money(product.price)],
          ['ค่าธรรมเนียม', plan.fee],
        ].map(([k, v]) => (
          <View key={k} style={s.confirmRow}>
            <Text style={s.confirmKey}>{k}</Text>
            <Text style={s.confirmVal}>{v}</Text>
          </View>
        ))}
        <View style={s.divider} />
        <View style={s.confirmRow}>
          <Text style={[s.confirmKey, { fontWeight: '700', color: C.dark }]}>รวมทั้งสิ้น</Text>
          <Text style={[s.confirmVal, { fontSize: 17 }]}>{money(plan.total)}</Text>
        </View>
      </View>

      <View style={[s.confirmCard, { marginTop: 14 }]}>
        <Text style={[s.confirmKey, { fontWeight: '700', color: C.dark, marginBottom: 10 }]}>กำหนดการชำระ</Text>
        {schedule.map((sch, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: sch.dot }} />
            <Text style={{ flex: 1, fontSize: 13, color: '#5A5A52' }}>{sch.label}</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.dark }}>{sch.amount}</Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 14, paddingHorizontal: 4 }}>
        <Text style={{ fontSize: 13, color: C.dark }}>✓</Text>
        <Text style={{ fontSize: 11, color: C.muted, lineHeight: 18 }}>
          ฉันยอมรับ <Text style={{ color: C.dark, fontWeight: '600', textDecorationLine: 'underline', textDecorationColor: C.lime }}>เงื่อนไขการผ่อนชำระ</Text> และยินยอมให้หักชำระอัตโนมัติทุกวันที่ครบกำหนด
        </Text>
      </View>
    </ScrollView>
  );
}

function SuccessStep({ product, plan }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }).start();
  }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      <Animated.View style={[s.successCircle, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={{ fontSize: 48, color: C.dark }}>✓</Text>
      </Animated.View>
      <Text style={s.successTitle}>ผ่อนสำเร็จ!</Text>
      <Text style={s.successSub}>คุณเลือก {plan.title} สำหรับ{'\n'}{product.name}</Text>
      <View style={s.successCard}>
        <View style={s.confirmRow}>
          <Text style={s.confirmKey}>งวดถัดไป</Text>
          <Text style={s.confirmVal}>{money(plan.monthly)} {plan.perSub}</Text>
        </View>
        <View style={s.confirmRow}>
          <Text style={s.confirmKey}>ครบกำหนดงวดแรก</Text>
          <Text style={s.confirmVal}>24 ก.ค. 2569</Text>
        </View>
      </View>
    </View>
  );
}

export default function CheckoutOverlay() {
  const { checkout, closeCheckout, checkoutNext, checkoutBack, selectPlan, user } = useApp();
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (checkout) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 70, friction: 14 }).start();
    } else {
      slideAnim.setValue(400);
    }
  }, [!!checkout]);

  if (!checkout) return null;

  const titles = { plan: 'เลือกแผนผ่อน', confirm: 'ยืนยันรายการ', success: 'สำเร็จ' };
  const planIdx = checkout.planIndex ?? 1;
  const product = checkout.product;
  const plans = createPlans(product);
  const plan = checkout.plan || plans[planIdx];
  const availableCredit = Math.max(0, (user?.credit_limit ?? 0) - (user?.credit_used ?? 0));
  const hasEnoughCredit = product.price <= availableCredit;

  return (
    <Modal visible animationType="slide" transparent={false} onRequestClose={checkoutBack}>
      <View style={s.overlay}>
        <View style={s.header}>
          <TouchableOpacity onPress={checkoutBack} style={s.backBtn} activeOpacity={0.8}>
            <Text style={{ fontSize: 18 }}>‹</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>{titles[checkout.step]}</Text>
          <TouchableOpacity onPress={closeCheckout}>
            <Text style={{ fontSize: 13, color: C.muted, fontWeight: '600' }}>ปิด</Text>
          </TouchableOpacity>
        </View>

        {checkout.step === 'plan' && <PlanStep product={product} plans={plans} planIndex={planIdx} onSelect={selectPlan} />}
        {checkout.step === 'confirm' && <ConfirmStep product={product} plan={plan} />}
        {checkout.step === 'success' && <SuccessStep product={product} plan={plan} />}

        <View style={s.footer}>
          {checkout.step === 'plan' && (
            <TouchableOpacity style={s.primaryBtn} onPress={() => checkoutNext(plans[planIdx])} activeOpacity={0.85}>
              <Text style={s.primaryBtnTxt}>ดำเนินการต่อ</Text>
            </TouchableOpacity>
          )}
          {checkout.step === 'confirm' && (
            <>
              <View style={hasEnoughCredit ? s.creditInfo : s.creditWarning}>
                <Text style={hasEnoughCredit ? s.creditInfoText : s.creditWarningText}>
                  วงเงินคงเหลือ {money(availableCredit)}
                  {hasEnoughCredit ? ` · ใช้วงเงิน ${money(product.price)}` : ' · วงเงินไม่เพียงพอ'}
                </Text>
              </View>
              {!!checkout.error && <Text style={s.errorText}>{checkout.error}</Text>}
              <TouchableOpacity
                style={[s.primaryBtn, !hasEnoughCredit && s.primaryBtnDisabled]}
                onPress={checkoutNext}
                activeOpacity={0.85}
                disabled={!hasEnoughCredit}
              >
              <Text style={s.primaryBtnTxt}>ยืนยันการผ่อน · {money(plan.total)}</Text>
              </TouchableOpacity>
            </>
          )}
          {checkout.step === 'success' && (
            <TouchableOpacity style={[s.primaryBtn, { backgroundColor: C.lime }]} onPress={closeCheckout} activeOpacity={0.85}>
              <Text style={[s.primaryBtnTxt, { color: C.dark }]}>เสร็จสิ้น</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 22, paddingTop: 56, paddingBottom: 14,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12, borderWidth: 1.5, borderColor: C.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: C.dark },
  productCard: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.dark,
    borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22,
  },
  productIcon: {
    width: 56, height: 56, borderRadius: 14, backgroundColor: C.surface, overflow: 'hidden',
  },
  checkoutProductImage: { width: '100%', height: '100%' },
  productName: { fontSize: 15, fontWeight: '700', color: C.dark },
  productSub: { fontSize: 12, color: C.muted, marginTop: 2 },
  productPrice: { fontSize: 17, fontWeight: '700', color: C.dark },
  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: C.muted, letterSpacing: 0.5,
    marginBottom: 12, textTransform: 'uppercase',
  },
  planCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10,
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border2,
    borderRadius: 18, padding: 16,
  },
  planCardSelected: {
    backgroundColor: '#FBFBF6', borderColor: C.dark, borderWidth: 2,
    shadowColor: C.dark, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
  },
  radioSelected: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: C.dark,
    alignItems: 'center', justifyContent: 'center',
  },
  radioEmpty: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D8D6CE' },
  planTitle: { fontSize: 15, fontWeight: '700', color: C.dark },
  planPer: { fontSize: 16, fontWeight: '700', color: C.dark },
  planPerSub: { fontSize: 12, color: C.muted, fontWeight: '500' },
  planFee: { fontSize: 12, color: C.muted },
  confirmHero: { backgroundColor: C.dark, borderRadius: 20, padding: 22, marginBottom: 14 },
  confirmHeroLabel: { fontSize: 12, color: C.muted2 },
  confirmHeroTitle: { fontSize: 24, fontWeight: '700', color: C.white, marginTop: 4 },
  confirmHeroPer: { fontSize: 34, fontWeight: '700', color: C.lime },
  confirmHeroPerSub: { fontSize: 14, color: C.muted2 },
  confirmCard: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 18, padding: 18,
  },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  confirmKey: { fontSize: 13, color: C.muted },
  confirmVal: { fontSize: 13, fontWeight: '600', color: C.dark },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 8 },
  successCircle: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: C.lime,
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { fontSize: 26, fontWeight: '700', color: C.dark, marginTop: 24 },
  successSub: { fontSize: 14, color: C.muted, marginTop: 8, textAlign: 'center', lineHeight: 22 },
  successCard: {
    backgroundColor: C.white, borderWidth: 1, borderColor: C.border,
    borderRadius: 16, padding: 16, marginTop: 24, width: '100%',
  },
  footer: { padding: 20, paddingBottom: 36, backgroundColor: C.bg },
  primaryBtn: { backgroundColor: C.dark, borderRadius: 99, padding: 17, alignItems: 'center' },
  primaryBtnDisabled: { backgroundColor: '#BEBEB7' },
  primaryBtnTxt: { color: C.lime, fontSize: 16, fontWeight: '700' },
  creditInfo: { backgroundColor: C.greenLight, borderRadius: 12, padding: 10, marginBottom: 10 },
  creditWarning: { backgroundColor: '#FFF0EC', borderRadius: 12, padding: 10, marginBottom: 10 },
  creditInfoText: { color: C.green, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  creditWarningText: { color: '#A63E22', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  errorText: { color: '#A63E22', fontSize: 12, textAlign: 'center', marginBottom: 8 },
});
