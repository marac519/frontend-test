import create from 'zustand'

const useAppStore = create(set => ({
    user: null,
    setuser: (newuser: object) => set(() => ({ user: newuser })),
//   bears: 0,
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
}))

export default useAppStore