import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { C } from '../theme';
import { useApp } from '../AppContext';

export default function PersonalInfoScreen({ navigation }) {
  const { user, refreshUser } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const save = async () => {
    if (!name.trim()) { Alert.alert('กรุณาใส่ชื่อ'); return; }
    setSaving(true);
    const initials = name.trim().charAt(0).toUpperCase();
    await refreshUser({ name: name.trim(), phone: phone.trim(), email: email.trim(), initials });
    setSaving(false);
    navigation.goBack();
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Text style={{ fontSize: 18, color: C.dark }}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>ข้อมูลส่วนตัว</Text>
        <TouchableOpacity onPress={save} disabled={saving}>
          <Text style={[s.saveBtn, saving && { opacity: 0.4 }]}>บันทึก</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View style={s.avatarRow}>
          <View style={s.avatar}><Text style={s.avatarTxt}>{name.charAt(0) || 'น'}</Text></View>
        </View>

        {[
          { label: 'ชื่อ-นามสกุล', value: name, onChange: setName, placeholder: 'กรอกชื่อ-นามสกุล', keyboard: 'default' },
          { label: 'เบอร์โทรศัพท์', value: phone, onChange: setPhone, placeholder: '+66 8X XXX XXXX', keyboard: 'phone-pad' },
          { label: 'อีเมล', value: email, onChange: setEmail, placeholder: 'email@example.com', keyboard: 'email-address' },
        ].map(({ label, value, onChange, placeholder, keyboard }) => (
          <View key={label} style={s.field}>
            <Text style={s.label}>{label}</Text>
            <TextInput
              style={s.input}
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor={C.muted4}
              keyboardType={keyboard}
              autoCapitalize="none"
            />
          </View>
        ))}

        <View style={s.infoCard}>
          <Text style={s.infoTxt}>ข้อมูลส่วนตัวของคุณได้รับการคุ้มครองตามนโยบายความเป็นส่วนตัวของ Sabai</Text>
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
  saveBtn: { fontSize: 15, fontWeight: '700', color: C.dark, textDecorationLine: 'underline', textDecorationColor: C.lime },
  avatarRow: { alignItems: 'center', marginBottom: 28 },
  avatar: { width: 72, height: 72, borderRadius: 22, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 28, fontWeight: '700', color: C.lime },
  field: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', color: C.muted, letterSpacing: 0.5, marginBottom: 8 },
  input: {
    backgroundColor: C.white, borderWidth: 1.5, borderColor: C.border2,
    borderRadius: 14, padding: 14, fontSize: 15, color: C.dark,
  },
  infoCard: { backgroundColor: C.greenLight, borderRadius: 12, padding: 14, marginTop: 8 },
  infoTxt: { fontSize: 12, color: C.greenText, lineHeight: 18 },
});
