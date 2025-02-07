import { Column } from "typeorm";

export class AbstractEntity<T> {
    @Column({type: 'uuid', primary: true, default: () => 'gen_random_uuid()'})
    id?: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
    createdAt?: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt?: Date;

    @Column({ type: 'varchar', nullable: true})
    createdBy?: string;

    @Column({ type: 'varchar', nullable: true})
    updatedBy?: string;

    @Column({ type: 'boolean', default: true })
    isActive?: boolean;

    constructor(entity: Partial<T>) {
        Object.assign(this, entity);
    }
}