export function useApp() {
  return {
    lang: "en",
    setLang: () => {},
    t: (k: any) => k,
    screen: "dashboard",
    go: () => {},
    business: {},
    setBusiness: () => {},
    projects: [],
    current: null,
    startProject: () => {},
    openProject: () => {},
    updateCurrent: () => {},
    saveCurrent: () => {},
    totals: {},
    money: (n: number) => "$" + n,
  } as any
}
