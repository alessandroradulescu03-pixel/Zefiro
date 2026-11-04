import { createContext, useContext } from "react";

/* ready: l'intro è finita (la hero può partire)
   go(path, { section }): naviga con la transizione di pagina
   goSection(id): porta a una sezione della home da qualsiasi pagina */
export const AppContext = createContext({
  ready: true,
  setReady: () => {},
  go: () => {},
  goSection: () => {},
  navTo: () => {},
});

export const useApp = () => useContext(AppContext);
