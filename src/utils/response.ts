export const success = (data: any) => ({ success: true, data })
export const fail = (message: string) => ({ success: false, message })
