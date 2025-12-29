
import { TranslationDict } from './types';

export const translations: TranslationDict = {
  welcome: { en: 'Welcome', pt: 'Bem-vindo(a)', es: 'Bienvenido' },
  dashboard: { en: 'Dashboard', pt: 'Painel', es: 'Panel' },
  expenses: { en: 'Expenses', pt: 'Despesas', es: 'Gastos' },
  transactions: { en: 'Transactions', pt: 'Transações', es: 'Transacciones' },
  investments: { en: 'Investments', pt: 'Investimentos', es: 'Inversiones' },
  receipts: { en: 'Receipts', pt: 'Comprovantes', es: 'Recibos' },
  cards: { en: 'Cards', pt: 'Cartões', es: 'Tarjetas' },
  balance: { en: 'Balance', pt: 'Saldo', es: 'Saldo' },
  income: { en: 'Income', pt: 'Receitas', es: 'Ingresos' },
  fixed: { en: 'Fixed', pt: 'Fixas', es: 'Fijos' },
  variable: { en: 'Variable', pt: 'Variáveis', es: 'Variables' },
  settings: { en: 'Settings', pt: 'Configurações', es: 'Ajustes' },
  logout: { en: 'Logout', pt: 'Sair', es: 'Cerrar Sesión' },
  save: { en: 'Save', pt: 'Salvar', es: 'Guardar' },
  cancel: { en: 'Cancel', pt: 'Cancelar', es: 'Cancelar' },
  essential: { en: 'Essential', pt: 'Essencial / Contas', es: 'Esencial' },
  paySelf: { en: 'Pay Yourself', pt: 'Pagar-se', es: 'Pagarse' },
  savings: { en: 'Savings', pt: 'Poupar', es: 'Ahorro' },
  invest: { en: 'Invest', pt: 'Investir', es: 'Invertir' },
  abound: { en: 'Abound', pt: 'Abundar', es: 'Abundar' },
  appearance: { en: 'Appearance', pt: 'Aparência', es: 'Apariencia' },
  language: { en: 'Language', pt: 'Idioma', es: 'Idioma' },
  country: { en: 'Country', pt: 'País', es: 'País' },
  thermometer: { en: 'Financial Thermometer', pt: 'Termômetro Financeiro', es: 'Termómetro Financiero' },
  incomeTax: { en: 'Income Tax', pt: 'Imposto de Renda', es: 'Imposto de Renda' }
};

export const getTranslation = (key: string, lang: string = 'pt'): string => {
  return translations[key]?.[lang] || key;
};

export const formatCurrency = (value: number, country: string = 'Brasil') => {
  const configs: { [key: string]: { locale: string; currency: string } } = {
    'Brasil': { locale: 'pt-BR', currency: 'BRL' },
    'EUA': { locale: 'en-US', currency: 'USD' },
    'Portugal': { locale: 'pt-PT', currency: 'EUR' },
    'Spain': { locale: 'es-ES', currency: 'EUR' },
    'United Kingdom': { locale: 'en-GB', currency: 'GBP' },
    'Germany': { locale: 'de-DE', currency: 'EUR' },
    'France': { locale: 'fr-FR', currency: 'EUR' },
    'Japan': { locale: 'ja-JP', currency: 'JPY' },
    'China': { locale: 'zh-CN', currency: 'CNY' }
  };
  const config = configs[country] || configs['Brasil'];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(value);
};

export const getDDI = (country: string) => {
  const ddis: { [key: string]: string } = {
    'Brasil': '+55',
    'EUA': '+1',
    'Portugal': '+351',
    'Spain': '+34',
    'United Kingdom': '+44',
    'Germany': '+49',
    'France': '+33',
    'Japan': '+81',
    'China': '+86'
  };
  return ddis[country] || '+1';
};

export const getDocumentLabel = (country: string) => {
  const labels: { [key: string]: string } = {
    'Brasil': 'CPF',
    'EUA': 'SSN',
    'Portugal': 'NIF',
    'Spain': 'DNI',
    'United Kingdom': 'NIN',
    'Germany': 'IdNr',
    'France': 'NIR'
  };
  return labels[country] || 'Documento / ID';
};
