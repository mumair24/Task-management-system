import { Column, Entity, ManyToOne, Index, JoinColumn } from 'typeorm';
import { AbstractEntity } from 'src/utils/database/abstract.entity';
import { TaskStatus } from '../utils/task.status';
import { EUser } from 'src/modules/user/entities/user.entity';

@Index('task_id_pk', ['id'], { unique: true })
@Entity('task')
export class ETask extends AbstractEntity<ETask> {
  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ManyToOne(() => EUser, (user) => user.assignedTasks)
  assignedTo?: EUser;

}
