export type RequiredExceptFor<T, TOptional extends keyof T> = Partial<T> &
  Required<Omit<T, TOptional>>
