import { MulterFile } from "src/common/utils/multer.util";

export type ProfileImages = {
  profile_image: MulterFile[];
  bg_image: MulterFile[];
};
