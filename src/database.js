import * as SQLite from 'expo-sqlite';

let db = null;

export async function getDb() {
  if (!db) db = await SQLite.openDatabaseAsync('sabai.db');
  return db;
}

export async function initDb() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS bills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT NOT NULL,
      sub TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      chip TEXT NOT NULL,
      specs TEXT NOT NULL,
      price INTEGER NOT NULL,
      icon TEXT NOT NULL,
      badge TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL DEFAULT 'นิรันดร์ วงศ์สว่าง',
      initials TEXT NOT NULL DEFAULT 'น',
      phone TEXT NOT NULL DEFAULT '+66 81 234 5678',
      email TEXT NOT NULL DEFAULT 'nirundorn@email.com',
      credit_limit INTEGER NOT NULL DEFAULT 50000,
      credit_used INTEGER NOT NULL DEFAULT 25500,
      tier TEXT NOT NULL DEFAULT 'GOLD'
    );

    CREATE TABLE IF NOT EXISTS bank_accounts (
      id TEXT PRIMARY KEY,
      bank_name TEXT NOT NULL,
      masked_number TEXT NOT NULL,
      account_name TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '1'
    );
  `);

  // Seed bills
  const billCount = await db.getFirstAsync('SELECT COUNT(*) as n FROM bills');
  if (billCount.n === 0) {
    await db.runAsync(
      `INSERT INTO bills (id, name, logo, sub, amount, status) VALUES
        ('b1','Central Online','C','งวด 1/3 · ครบกำหนด 5 ก.ค.',1200,'active'),
        ('b2','Lazada','L','งวด 2/6 · ครบกำหนด 12 ก.ค.',890,'active'),
        ('b3','Power Mall','P','งวด 1/10 · ครบกำหนด 20 ก.ค.',953,'active'),
        ('p1','AIS Online','A','ชำระเมื่อ 1 มิ.ย.',1499,'paid'),
        ('p2','Shopee','S','ชำระเมื่อ 28 พ.ค.',650,'paid'),
        ('p3','7-Eleven','7','ชำระเมื่อ 15 พ.ค.',320,'paid')`
    );
  }

  // Seed products
  await db.execAsync(`
    INSERT OR IGNORE INTO products (id, name, category, chip, specs, price, icon, badge) VALUES
      ('macbook-neo-m5','MacBook Neo 13-inch','โน้ตบุ๊ก','Apple M5','16GB · 256GB SSD',19900,'◒','ใหม่'),
      ('macbook-air-13-m5','MacBook Air 13-inch','โน้ตบุ๊ก','Apple M5','16GB · 256GB SSD',36900,'▱','แนะนำ'),
      ('macbook-air-15-m5','MacBook Air 15-inch','โน้ตบุ๊ก','Apple M5','16GB · 512GB SSD',43900,'▱','ใหม่'),
      ('macbook-pro-14-m5','MacBook Pro 14-inch','โน้ตบุ๊ก','Apple M5','16GB · 512GB SSD',56900,'▰','ยอดนิยม'),
      ('macbook-pro-16-m5-pro','MacBook Pro 16-inch','โน้ตบุ๊ก','Apple M5 Pro','24GB · 512GB SSD',91900,'▰','โปร'),
      ('imac-24-m4','iMac 24-inch','เดสก์ท็อป','Apple M4','16GB · 256GB SSD',44900,'▣','All-in-one'),
      ('mac-mini-m4','Mac mini','เดสก์ท็อป','Apple M4','16GB · 512GB SSD',27900,'▪','แนะนำ'),
      ('mac-mini-m4-pro','Mac mini','เดสก์ท็อป','Apple M4 Pro','24GB · 512GB SSD',49900,'▪','โปร'),
      ('mac-studio-m4-max','Mac Studio','เดสก์ท็อป','Apple M4 Max','36GB · 512GB SSD',69900,'▣','มืออาชีพ'),
      ('mac-studio-m3-ultra','Mac Studio','เดสก์ท็อป','Apple M3 Ultra','96GB · 1TB SSD',149900,'▣','แรงสุด'),
      ('studio-display','Studio Display','จอภาพ','Retina 5K','27-inch · Standard glass',52900,'▤','ใหม่'),
      ('studio-display-xdr','Studio Display XDR','จอภาพ','Retina 5K XDR','27-inch · Nano-texture glass',109900,'▤','โปร');
  `);

  // Seed user (one row only)
  await db.runAsync(`INSERT OR IGNORE INTO user (id) VALUES (1)`);

  // Seed bank account
  const bankCount = await db.getFirstAsync('SELECT COUNT(*) as n FROM bank_accounts');
  if (bankCount.n === 0) {
    await db.runAsync(
      `INSERT INTO bank_accounts (id, bank_name, masked_number, account_name, is_default) VALUES
        ('ba1','SCB','••••4521','นิรันดร์ วงศ์สว่าง',1),
        ('ba2','KBank','••••8823','นิรันดร์ วงศ์สว่าง',0)`
    );
  }

  // Seed notification settings
  await db.execAsync(`
    INSERT OR IGNORE INTO settings (key, value) VALUES
      ('notif_due','1'),
      ('notif_payment','1'),
      ('notif_promo','0'),
      ('notif_summary','1');
  `);
}

// ─── Bills ───────────────────────────────────────────────
export async function fetchBills(status) {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM bills WHERE status = ? ORDER BY rowid ASC', [status]);
}

export async function payBill(id) {
  const db = await getDb();
  await db.runAsync(`UPDATE bills SET status='paid', sub='ชำระเมื่อวันนี้' WHERE id=?`, [id]);
}

export async function createInstallmentBill(product, plan) {
  const db = await getDb();
  const id = `order-${Date.now()}`;
  const user = await db.getFirstAsync('SELECT credit_limit, credit_used FROM user WHERE id = 1');
  const available = user.credit_limit - user.credit_used;
  if (product.price > available) {
    throw new Error('วงเงินคงเหลือไม่เพียงพอสำหรับสินค้านี้');
  }

  await db.runAsync(
    `INSERT INTO bills (id, name, logo, sub, amount, status) VALUES (?, ?, ?, ?, ?, 'active')`,
    [id, product.name, product.icon, `งวด 1/${plan.months} · ครบกำหนด 24 ก.ค.`, plan.monthly]
  );
  await db.runAsync('UPDATE user SET credit_used = credit_used + ? WHERE id = 1', [product.price]);

  return db.getFirstAsync('SELECT * FROM user WHERE id = 1');
}

// ─── Products ─────────────────────────────────────────────
export async function fetchProducts(category = 'ทั้งหมด') {
  const db = await getDb();
  if (category === 'ทั้งหมด') return db.getAllAsync('SELECT * FROM products ORDER BY price ASC');
  return db.getAllAsync('SELECT * FROM products WHERE category = ? ORDER BY price ASC', [category]);
}

// ─── User ─────────────────────────────────────────────────
export async function fetchUser() {
  const db = await getDb();
  return db.getFirstAsync('SELECT * FROM user WHERE id = 1');
}

export async function updateUser(fields) {
  const db = await getDb();
  const keys = Object.keys(fields);
  const sets = keys.map((k) => `${k} = ?`).join(', ');
  await db.runAsync(`UPDATE user SET ${sets} WHERE id = 1`, Object.values(fields));
}

// ─── Bank Accounts ────────────────────────────────────────
export async function fetchBankAccounts() {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM bank_accounts ORDER BY is_default DESC');
}

export async function addBankAccount(data) {
  const db = await getDb();
  const id = `ba-${Date.now()}`;
  await db.runAsync(
    `INSERT INTO bank_accounts (id, bank_name, masked_number, account_name, is_default) VALUES (?,?,?,?,0)`,
    [id, data.bank_name, data.masked_number, data.account_name]
  );
}

export async function setDefaultAccount(id) {
  const db = await getDb();
  await db.runAsync(`UPDATE bank_accounts SET is_default = 0`);
  await db.runAsync(`UPDATE bank_accounts SET is_default = 1 WHERE id = ?`, [id]);
}

export async function deleteAccount(id) {
  const db = await getDb();
  await db.runAsync(`DELETE FROM bank_accounts WHERE id = ?`, [id]);
}

// ─── Settings ─────────────────────────────────────────────
export async function fetchSettings() {
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT * FROM settings');
  const result = {};
  rows.forEach((r) => { result[r.key] = r.value === '1'; });
  return result;
}

export async function setSetting(key, value) {
  const db = await getDb();
  await db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, value ? '1' : '0']);
}

// ─── PIN ──────────────────────────────────────────────────
export async function getPin() {
  const db = await getDb();
  const row = await db.getFirstAsync(`SELECT value FROM settings WHERE key = 'pin'`);
  return row ? row.value : null;
}

export async function setPin(pin) {
  const db = await getDb();
  await db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES ('pin', ?)`, [pin]);
}
