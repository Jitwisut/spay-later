import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Vibration } from 'react-native';
import { getPin, setPin } from '../database';
import { C } from '../theme';

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function PinScreen({ onSuccess }) {
  const [mode, setMode] = useState('loading'); // loading | set | confirm | enter
  const [pin, setEnteredPin] = useState('');
  const [tempPin, setTempPin] = useState('');
  const [error, setError] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getPin().then((saved) => setMode(saved ? 'enter' : 'set'));
  }, []);

  const shake = () => {
    Vibration.vibrate(400);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleKey = async (key) => {
    if (key === '') return;
    if (key === '⌫') {
      setEnteredPin((p) => p.slice(0, -1));
      setError('');
      return;
    }
    const next = pin + key;
    setEnteredPin(next);
    setError('');

    if (next.length < 6) return;

    if (mode === 'set') {
      setTempPin(next);
      setEnteredPin('');
      setMode('confirm');
    } else if (mode === 'confirm') {
      if (next === tempPin) {
        await setPin(next);
        onSuccess();
      } else {
        shake();
        setError('PIN ไม่ตรงกัน ลองใหม่อีกครั้ง');
        setEnteredPin('');
        setMode('set');
        setTempPin('');
      }
    } else if (mode === 'enter') {
      const saved = await getPin();
      if (next === saved) {
        onSuccess();
      } else {
        shake();
        setError('PIN ไม่ถูกต้อง');
        setEnteredPin('');
      }
    }
  };

  if (mode === 'loading') return <View style={s.container} />;

  const titles = {
    set: 'ตั้ง PIN 6 หลัก',
    confirm: 'ยืนยัน PIN อีกครั้ง',
    enter: 'ใส่ PIN เพื่อเข้าสู่ระบบ',
  };
  const subs = {
    set: 'PIN ใช้สำหรับยืนยันตัวตนเข้าแอพ',
    confirm: 'กรุณากรอก PIN เดิมซ้ำอีกครั้ง',
    enter: 'Sabai · Pay Later',
  };

  return (
    <View style={s.container}>
      <View style={s.top}>
        <View style={s.logoCircle}><Text style={s.logoTxt}>S</Text></View>
        <Text style={s.title}>{titles[mode]}</Text>
        <Text style={s.sub}>{subs[mode]}</Text>
      </View>

      <Animated.View style={[s.dots, { transform: [{ translateX: shakeAnim }] }]}>
        {[0,1,2,3,4,5].map((i) => (
          <View key={i} style={[s.dot, i < pin.length && s.dotFilled]} />
        ))}
      </Animated.View>

      {error ? <Text style={s.error}>{error}</Text> : null}

      <View style={s.pad}>
        {KEYS.map((key, i) => (
          <TouchableOpacity
            key={i}
            style={[s.key, key === '' && { opacity: 0 }]}
            onPress={() => handleKey(key)}
            activeOpacity={0.6}
            disabled={key === ''}
          >
            <Text style={s.keyTxt}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 60 },
  top: { alignItems: 'center', gap: 12 },
  logoCircle: { width: 72, height: 72, borderRadius: 22, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  logoTxt: { fontSize: 32, fontWeight: '700', color: C.lime },
  title: { fontSize: 22, fontWeight: '700', color: C.dark },
  sub: { fontSize: 14, color: C.muted },
  dots: { flexDirection: 'row', gap: 16 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: C.dark, backgroundColor: 'transparent' },
  dotFilled: { backgroundColor: C.dark },
  error: { fontSize: 13, color: '#C0392B', fontWeight: '600' },
  pad: { flexDirection: 'row', flexWrap: 'wrap', width: 280, justifyContent: 'center', gap: 16 },
  key: { width: 72, height: 72, borderRadius: 36, backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  keyTxt: { fontSize: 26, fontWeight: '600', color: C.dark },
});
