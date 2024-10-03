export enum BadRequestMessage {
  InValidLoginData = "اطلاعات ارسال شده برای ورود صحیح نمی باشد",
  InValidRegisterData = "اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد",
  SomethingWrong = "خطایی پیش آمده",
  InvalidEmail = "ایمیل وارد شده صحیح نمی باشد",
  InvalidCategories = "دسته بندی وارد شده صحیح نمی باشد",
}
export enum AuthMessage {
  NotFoundAccount = "حساب کاربری یافت نشد",
  TryAgain = "دوباره تلاش کنید",
  // TODO: change to AlreadyExist
  AlreadyExistUser = "حساب کاربری با این مشخصات وجود دارد",
  ExpiredCode = "کد تایید منقضی شده است",
  LoginAgain = "مجدد وارد حساب کاربری خود شوید",
  LoginIsRequired = "وارد حساب کاربری خود شوید",
}
export enum UserMessage {
  Updated = "حساب کاربری به روز رسانی شد",
  ConflictEmail = "این ایمیل متعلق به حساب کاربری دیگری است",
  ConflictPhone = "این شماره موبایل متعلق به حساب کاربری دیگری است",
  ConflictUsername = "این نام کاربری متعلق به حساب کاربری دیگری است",
}

export enum CategoryMessage {
  AlreadyExist = "این دسته بندی وجود دارد",
  NotFound = "دسته بندی پیدا نشد",
  Deleted = "دسته بندی با موفقیت حذف گردید",
  Updated = "دسته بندی با موفقیت به روز رسانی گردید",
}

export enum NotFoundMessage {
  NotFoundPost = "مقاله ای یافت نشد",
}
export enum ValidationMessage {
  InvalidImageForamt = "فرمت تصویر وارد شده قابل قبول نیست",
  InvalidEmailForamt = "فرمت ایمیل وارد شده قابل قبول نیست",
  InvalidPhoneForamt = "فرمت شماره موبایل وارد شده قابل قبول نیست",
}
export enum PublicMessage {
  SendOtp = "کد یکبار مصرف ارسال شد",
  LoggedIn = "با موفقیت وارد حساب کاربری خود شدید",
  Created = "با موفقیت ایجاد شد",
  Updated = "به روز رسانی شد",
  Deleted = "با موفقیت حذف شد",
  Liked = "مقاله لایک شد",
  DisLiked = "لایک برداشته شد",
  Bookmarked = "مقاله بوک مارک شد",
  UnBookmarked = "از بوک مارک خارج شد",
  CommentCreated = "نظر شما با موفقیت ثبت شد",
}
