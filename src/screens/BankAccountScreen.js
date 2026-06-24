import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { C } from '../theme';
import { useApp } from '../AppContext';
import { setDefaultAccount, deleteAccount, addBankAccount } from '../database';

const BANKS = ['SCB','KBank','BBL','KTB','BAY','GSB','TMBThanachart'];
const BANK_COLORS = { SCB:'#4E2E7F', KBank:'#138F2D', BBL:'#1C3F94', KTB:'#00A0E9', BAY:'#FEC10E', GSB:'#E8008D', TMBThanachart:'#FC4C02' };

export default function BankAccountScreen({ navigation }) {
  const { bankAccounts, loadBankAccounts } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [bankName, setBankName] = useState('SCB');
  const [masked, setMasked] = useState('');
  const [accountName, setAccountName] = useState('');

  const handleSetDefault = async (id) => {
    await setDefaultAccount(id);
    await loadBankAccounts();
  };

  const handleDelete = (id) => {
    Alert.alert('ลบบัญชี', 'ต้องการลบบัญชีนี้ออกไหม?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลบ', style: 'destructive', onPress: async () => { await deleteAccount(id); await loadBankAccounts(); } },
    ]);
  };

  const handleAdd = async () => {
    if (!masked.trim() || !accountName.trim()) { Alert.alert('กรุณากรอกข้อมูลให้ครบ'); return; }
    await addBankAccount({ bank_name: bankName, masked_number: masked.trim(), account_name: accountName.trim() });
    await loadBankAccounts();
    setShowAdd(false);
    setMasked('');
    setAccountName('');
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} activeOpacity={0.7}>
          <Text style={{ fontSize: 18, color: C.dark }}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>บัญชีธนาคาร</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)}>
          <Text style={s.addBtn}>+ เพิ่ม</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {bankAccounts.map((acc) => (
          <View key={acc.id} style={[s.card, acc.is_default && s.cardDefault]}>
            <View style={[s.bankBadge, { backgroundColor: BANK_COLORS[acc.bank_name] || C.dark }]}>
              <Text style={s.bankBadgeTxt}>{acc.bank_name}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.accName}>{acc.account_name}</Text>
              <Text style={s.accNumber}>{acc.bank_name} {acc.masked_number}</Text>
            </View>
            <View style={{ gap: 6, alignItems: 'flex-end' }}>
              {acc.is_default ? (
                <View style={s.defaultBadge}><Text style={s.defaultBadgeTxt}>ค่าเริ่มต้น</Text></View>
              ) : (
                <TouchableOpacity onPress={() => handleSetDefault(acc.id)}>
                  <Text style={s.setDefaultTxt}>ตั้งค่าเริ่มต้น</Text>
                </TouchableOpacity>
              )}
              {!acc.is_default && (
                <TouchableOpacity onPress={() => handleDelete(acc.id)}>
                  <Text style={s.deleteTxt}>ลบ</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {showAdd && (
          <View style={s.addForm}>
            <Text style={s.formTitle}>เพิ่มบัญชีใหม่</Text>
            <Text style={s.label}>ธนาคาร</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {BANKS.map((b) => (
                  <TouchableOpacity key={b} onPress={() => setBankName(b)}
                    style={[s.bankChip, bankName === b && s.bankChipActive]}>
                    <Text style={[s.bankChipTxt, bankName === b && { color: C.white }]}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={s.label}>เลขบัญชี (เช่น ••••1234)</Text>
            <TextInput style={s.input} value={masked} onChangeText={setMasked} placeholder="••••XXXX" placeholderTextColor={C.muted4} />
            <Text style={s.label}>ชื่อเจ้าของบัญชี</Text>
            <TextInput style={s.input} value={accountName} onChangeText={setAccountName} placeholder="ชื่อ-นามสกุล" placeholderTextColor={C.muted4} />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowAdd(false)}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.muted }}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.confirmBtn} onPress={handleAdd}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.lime }}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  addBtn: { fontSize: 14, fontWeight: '700', color: C.dark, textDecorationLine: 'underline', textDecorationColor: C.lime },
  card: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 14 },
  cardDefault: { borderColor: C.dark, borderWidth: 1.5 },
  bankBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  bankBadgeTxt: { color: C.white, fontSize: 12, fontWeight: '700' },
  accName: { fontSize: 14, fontWeight: '600', color: C.dark },
  accNumber: { fontSize: 12, color: C.muted, marginTop: 2 },
  defaultBadge: { backgroundColor: C.greenLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  defaultBadgeTxt: { fontSize: 11, fontWeight: '700', color: C.green },
  setDefaultTxt: { fontSize: 12, color: C.dark, fontWeight: '600', textDecorationLine: 'underline', textDecorationColor: C.lime },
  deleteTxt: { fontSize: 12, color: '#C0392B' },
  addForm: { backgroundColor: C.white, borderRadius: 18, padding: 18, borderWidth: 1.5, borderColor: C.border2, marginTop: 8 },
  formTitle: { fontSize: 16, fontWeight: '700', color: C.dark, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: C.muted, letterSpacing: 0.5, marginBottom: 8 },
  input: { backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border2, borderRadius: 12, padding: 12, fontSize: 15, color: C.dark, marginBottom: 14 },
  bankChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, borderWidth: 1.5, borderColor: C.border2, backgroundColor: C.white },
  bankChipActive: { backgroundColor: C.dark, borderColor: C.dark },
  bankChipTxt: { fontSize: 13, fontWeight: '600', color: C.dark },
  cancelBtn: { flex: 1, padding: 13, borderRadius: 12, borderWidth: 1.5, borderColor: C.border2, alignItems: 'center' },
  confirmBtn: { flex: 1, padding: 13, borderRadius: 12, backgroundColor: C.dark, alignItems: 'center' },
});
