export enum BadRequestMessage {
  InValidLoginData = "اطلاعات ارسال شده برای ورود صحیح نمی باشد",
  InValidRegisterData = "اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد",
}
export enum AuthMessage {
  NotFoundAccount = "حساب کاربری یافت نشد",
  TryAgain = "دوباره تلاش کنید",
  AlreadyExistUser = "حساب کاربری با این مشخصات وجود دارد",
  ExpiredCode = "کد تایید منقضی شده است",
  LoginAgain = "مجدد وارد حساب کاربری خود شوید",
  LoginIsRequired = "وارد حساب کاربری خود شوید",
}
export enum NotFoundMessage {}
export enum ValidationMessage {}
export enum PublicMessage {
  SendOtp = "کد یکبار مصرف ارسال شد",
  LoggedIn = "با موفقیت وارد حساب کاربری خود شدید",
  Created = "با موفقیت ایجاد شد",
}
