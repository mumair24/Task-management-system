import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EUser } from "./entities/user.entity";
import { UserService } from "./user.service";
import { FirebaseModule } from "src/utils/firebase/firebase.module";
import { NodemailerModule } from "src/utils/nodemailer/nodemailer.module";
import { UserController } from "./user.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EUser
        ]),
        FirebaseModule,
        NodemailerModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: []
})

export class UserModule {}