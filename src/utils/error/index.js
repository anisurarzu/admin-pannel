import { Toastify } from "../../components/toastify"

export const CustomError = async error => {
  try {
    if (error) {
      if (error.status === 422) {
        Object.keys(error.data.message).forEach(key => {
          const message = error.data.message[key]
          if (message) return Toastify.Error(message)
        })
      } else {
        return Toastify.Error(error.data.message)
      }
    }
  } catch (error) {
    return Toastify.Error("Something going wrong.")
  }
}