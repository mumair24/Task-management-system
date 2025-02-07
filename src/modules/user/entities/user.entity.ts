import { Column, Entity, Index, OneToMany } from "typeorm";
import { getUserRoles } from "../utils/user.roles";
import { AbstractEntity } from "src/utils/database/abstract.entity";
import { ETask } from "src/modules/task/entities/task.entity";


@Index('user_id_pk', ['id'], { unique: true })
@Index('user_email_idx', ['email'], { unique: true })
@Entity("user")
export class EUser extends AbstractEntity<EUser> {

    @Column({ type: 'varchar', name: 'uid' })
    uid: string;

    @Column({ type: 'varchar', name: 'displayName' })
    displayName: string;

    @Column({ type: 'varchar', name: 'firstName' })
    firstName: string;

    @Column({ type: 'varchar', name: 'middleName', nullable: true })
    middleName: string | null;

    @Column({ type: 'varchar', name: 'lastName' })
    lastName: string;

    @Column({ type: 'varchar', name: 'email', unique: true })
    email: string;

    @Column({ type: 'enum', name: 'role', enum: getUserRoles })
    role: string;

    @Column({ type: 'date', name: 'dob', nullable: true })
    dob: Date | null;

    @Column({ type: 'varchar', name: 'displayPicture', nullable: true })
    displayPicture: string | null;

    @Column({ type: 'varchar', name: 'phoneNumber', length: 100, nullable: true })
    phoneNumber: string;

    @OneToMany(() => ETask, (task) => task.assignedTo)
    assignedTasks: ETask[];
}