import { TaskModule } from "./modules/task/task.module";
import { UserModule } from "./modules/user/user.module";

export const getResourceModules = [
    UserModule,
    TaskModule
];