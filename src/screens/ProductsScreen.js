import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';
import { useApp } from '../AppContext';
import { PRODUCT_IMAGES } from '../productImages';

const CATEGORIES = ['ทั้งหมด', 'โน้ตบุ๊ก', 'เดสก์ท็อป', 'จอภาพ'];

export default function ProductsScreen() {
  const { products, dbReady, fmt, openCheckout } = useApp();
  const [category, setCategory] = useState('ทั้งหมด');
  const visibleProducts = useMemo(
    () => products.filter((product) => category === 'ทั้งหมด' || product.category === category),
    [products, category]
  );

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.header}>
          <Text style={s.kicker}>APPLE STORE</Text>
          <Text style={s.title}>เลือกสินค้าของคุณ</Text>
          <Text style={s.subtitle}>ผ่อนสบาย ๆ เลือกแผนได้ก่อนยืนยัน</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categories}>
          {CATEGORIES.map((item) => {
            const active = category === item;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                style={[s.category, active && s.categoryActive]}
                activeOpacity={0.8}
              >
                <Text style={[s.categoryText, active && s.categoryTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={s.summary}>
          <Text style={s.summaryText}>{dbReady ? `${visibleProducts.length} รายการ` : 'กำลังโหลดสินค้า...'}</Text>
          <Text style={s.summarySub}>ข้อมูลสินค้าในฐานข้อมูล</Text>
        </View>

        <View style={s.grid}>
          {visibleProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={s.productCard}
              onPress={() => openCheckout(product)}
              activeOpacity={0.82}
            >
              <View style={s.productVisual}>
                <Image
                  source={PRODUCT_IMAGES[product.image_key] || PRODUCT_IMAGES.laptop}
                  style={s.productImage}
                  resizeMode="cover"
                />
                {!!product.badge && <Text style={s.badge}>{product.badge}</Text>}
              </View>
              <Text numberOfLines={2} style={s.productName}>{product.name}</Text>
              <Text numberOfLines={1} style={s.productChip}>{product.chip}</Text>
              <Text numberOfLines={1} style={s.productSpecs}>{product.specs}</Text>
              <View style={s.priceRow}>
                <Text style={s.price}>{fmt(product.price)}</Text>
                <Text style={s.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { paddingBottom: 28 },
  header: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 14 },
  kicker: { fontSize: 11, letterSpacing: 1.1, color: C.muted, fontWeight: '700' },
  title: { fontSize: 27, lineHeight: 33, color: C.dark, fontWeight: '700', letterSpacing: -0.6, marginTop: 3 },
  subtitle: { fontSize: 13, color: C.muted, marginTop: 5 },
  categories: { gap: 8, paddingHorizontal: 20, paddingVertical: 8 },
  category: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 99, backgroundColor: C.white, borderWidth: 1, borderColor: C.border2 },
  categoryActive: { backgroundColor: C.dark, borderColor: C.dark },
  categoryText: { fontSize: 13, color: C.muted, fontWeight: '600' },
  categoryTextActive: { color: C.lime },
  summary: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 15, paddingBottom: 9 },
  summaryText: { fontSize: 13, fontWeight: '700', color: C.dark },
  summarySub: { fontSize: 12, color: C.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 },
  productCard: { width: '48%', flexGrow: 1, backgroundColor: C.white, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 12, minWidth: 150 },
  productVisual: { height: 106, backgroundColor: C.surface, borderRadius: 13, marginBottom: 12, overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  badge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 99, backgroundColor: C.lime, color: C.dark, fontSize: 10, fontWeight: '700' },
  productName: { fontSize: 14, lineHeight: 18, color: C.dark, fontWeight: '700', minHeight: 36 },
  productChip: { fontSize: 12, color: C.green, fontWeight: '600', marginTop: 5 },
  productSpecs: { fontSize: 11, color: C.muted, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 11 },
  price: { fontSize: 15, color: C.dark, fontWeight: '700' },
  arrow: { fontSize: 24, lineHeight: 20, color: C.muted },
});
