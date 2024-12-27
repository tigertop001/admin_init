export function useAddDialog(_emit: (event: string, ...args: any[]) => void) {
  // 重置
  const resetForm = () => {};

  return {
    resetForm
  };
}
