
/** 
 * AURAFIN - SUPABASE INTEGRATION, SCHEMA & RLS POLICIES
 * ---------------------------------------------------
 * INSTRUÇÕES: Copie o script SQL fornecido na resposta anterior e execute no SQL Editor do Supabase.
 */

const STORAGE_KEY_PREFIX = 'aurafin_v2_';

const getFromDB = (table: string) => {
  const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${table}`);
  return data ? JSON.parse(data) : [];
};

const saveToDB = (table: string, data: any[]) => {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${table}`, JSON.stringify(data));
};

const getCurrentUserId = () => {
  const session = localStorage.getItem('aurafin_session');
  return session === 'true' ? 'user-123' : null;
};

const mockUser = {
  id: 'user-123',
  email: 'user@aurafin.com',
};

export const supabase = {
  auth: {
    getSession: async () => ({ 
      data: { session: localStorage.getItem('aurafin_session') ? { user: mockUser } : null },
      error: null 
    }),
    signInWithPassword: async ({ email, password }: any) => {
      localStorage.setItem('aurafin_session', 'true');
      return { data: { user: mockUser }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('aurafin_session');
    },
    signUp: async ({ email, password }: any) => {
      localStorage.setItem('aurafin_session', 'true');
      const profiles = getFromDB('profiles');
      if (!profiles.find((p: any) => p.id === mockUser.id)) {
        saveToDB('profiles', [...profiles, { 
          id: mockUser.id, 
          email, 
          nickname: 'Novo Investidor', 
          full_name: '', 
          is_premium: false,
          total_invested_base: 0,
          language: 'pt',
          country: 'Brasil'
        }]);
      }
      return { data: { user: mockUser }, error: null };
    },
    resetPasswordForEmail: async (email: string) => {
      return { data: {}, error: null };
    }
  },
  from: (table: string) => ({
    select: (query: string = '*') => {
      const filters: { col: string; val: any }[] = [];
      let sortCol: string | null = null;
      let sortAsc: boolean = true;

      const builder: any = {
        eq: (col: string, val: any) => {
          filters.push({ col, val });
          return builder;
        },
        order: (col: string, { ascending = true } = {}) => {
          sortCol = col;
          sortAsc = ascending;
          return builder;
        },
        single: async () => {
          const rows = getFromDB(table);
          const uid = getCurrentUserId();
          const found = rows.find((r: any) => 
            filters.every(f => r[f.col] === f.val) && 
            (r.user_id === uid || r.id === uid)
          );
          return { data: found || null, error: found ? null : { message: "Registro não encontrado." } };
        },
        then: (onfulfilled: any, onrejected?: any) => {
          const uid = getCurrentUserId();
          let rows = getFromDB(table).filter((r: any) => 
            filters.every(f => r[f.col] === f.val) && 
            (r.user_id === uid || r.id === uid)
          );
          
          if (sortCol) {
            rows.sort((a: any, b: any) => {
              const valA = a[sortCol!];
              const valB = b[sortCol!];
              if (valA < valB) return sortAsc ? -1 : 1;
              if (valA > valB) return sortAsc ? 1 : -1;
              return 0;
            });
          }
          return Promise.resolve({ data: rows, error: null }).then(onfulfilled, onrejected);
        }
      };
      return builder;
    },
    insert: async (row: any) => {
      const rows = getFromDB(table);
      const uid = getCurrentUserId();
      if (!uid) return { data: null, error: { message: "Sessão expirada." } };

      const newRow = { 
        id: Math.random().toString(36).substr(2, 9), 
        created_at: new Date().toISOString(), 
        user_id: uid, 
        ...row 
      };
      saveToDB(table, [...rows, newRow]);
      return { data: newRow, error: null };
    },
    update: (updates: any) => ({
      eq: async (col: string, val: any) => {
        const rows = getFromDB(table);
        const uid = getCurrentUserId();
        const index = rows.findIndex((r: any) => r[col] === val && (r.user_id === uid || r.id === uid));
        if (index !== -1) {
          rows[index] = { ...rows[index], ...updates };
          saveToDB(table, rows);
          return { data: rows[index], error: null };
        }
        return { data: null, error: { message: "Acesso negado ou registro não encontrado." } };
      }
    }),
    delete: () => ({
      eq: async (col: string, val: any) => {
        const rows = getFromDB(table);
        const uid = getCurrentUserId();
        const filtered = rows.filter((r: any) => !(r[col] === val && (r.user_id === uid || r.id === uid)));
        saveToDB(table, filtered);
        return { error: null };
      }
    })
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://picsum.photos/seed/${path}/400/300` }
      })
    })
  }
};
