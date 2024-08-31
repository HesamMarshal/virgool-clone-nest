export enum BadRequestMessage {
  InValidLoginData = "اطلاعات ارسال شده برای ورود صحیح نمی باشد",
  InValidRegisterData = "اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد",
}
export enum AuthMessage {
  NotFoundAccount = "حساب کاربری یافت نشد",
  AlreadyExistUser = "حساب کاربری با این مشخصات وجود دارد",
}
export enum NotFoundMessage {}
export enum ValidationMessage {}
export enum PublicMessage {
  SendOtp = "OTP SENT",
}
