import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initDb, fetchBills, fetchProducts, payBill, createInstallmentBill,
  fetchUser, updateUser, fetchBankAccounts, fetchSettings,
} from './database';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeBills, setActiveBills] = useState([]);
  const [paidBills, setPaidBills] = useState([]);
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [notifSettings, setNotifSettings] = useState({});
  const [dbReady, setDbReady] = useState(false);
  const [checkout, setCheckout] = useState(null);
  const [pay, setPay] = useState(null);
  const [paySuccess, setPaySuccess] = useState(false);

  const fmt = (n) => '฿' + Number(n).toLocaleString('en-US');

  const loadBills = useCallback(async () => {
    const [active, paid] = await Promise.all([fetchBills('active'), fetchBills('paid')]);
    setActiveBills(active);
    setPaidBills(paid);
  }, []);

  const loadUser = useCallback(async () => { setUser(await fetchUser()); }, []);
  const loadBankAccounts = useCallback(async () => { setBankAccounts(await fetchBankAccounts()); }, []);
  const loadNotifSettings = useCallback(async () => { setNotifSettings(await fetchSettings()); }, []);

  const refreshUser = useCallback(async (fields) => {
    await updateUser(fields);
    await loadUser();
  }, [loadUser]);

  useEffect(() => {
    initDb()
      .then(() => Promise.all([
        loadBills(),
        fetchProducts().then(setProducts),
        loadUser(),
        loadBankAccounts(),
        loadNotifSettings(),
      ]))
      .then(() => setDbReady(true))
      .catch(console.error);
  }, []);

  const openCheckout = (product) => setCheckout({ step: 'plan', planIndex: 1, product, error: null });
  const closeCheckout = () => setCheckout(null);
  const openPay = (bill) => { setPay(bill); setPaySuccess(false); };
  const closePay = () => { setPay(null); setPaySuccess(false); };
  const confirmPay = () => setPaySuccess(true);

  const finishPay = useCallback(async () => {
    if (!pay) return;
    await payBill(pay.id);
    await loadBills();
    setPay(null);
    setPaySuccess(false);
  }, [pay, loadBills]);

  const checkoutNext = async (plan) => {
    if (!checkout) return;
    if (checkout.step === 'plan') setCheckout({ ...checkout, step: 'confirm', plan, error: null });
    else if (checkout.step === 'confirm') {
      try {
        const updatedUser = await createInstallmentBill(checkout.product, checkout.plan);
        await loadBills();
        setUser(updatedUser);
        setCheckout({ ...checkout, step: 'success', error: null });
      } catch (error) {
        setCheckout({ ...checkout, error: error.message });
      }
    }
  };
  const checkoutBack = () => {
    if (!checkout) return;
    if (checkout.step === 'confirm') setCheckout({ ...checkout, step: 'plan' });
    else setCheckout(null);
  };
  const selectPlan = (i) => setCheckout({ ...checkout, planIndex: i });

  return (
    <AppContext.Provider value={{
      activeBills, paidBills, products, user, bankAccounts, notifSettings,
      dbReady, fmt,
      loadBankAccounts, loadNotifSettings, refreshUser,
      checkout, openCheckout, closeCheckout, checkoutNext, checkoutBack, selectPlan,
      pay, paySuccess, openPay, closePay, confirmPay, finishPay,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
