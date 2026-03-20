import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    "mutationFn"
  >,
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn,
    ...options,
  });
}