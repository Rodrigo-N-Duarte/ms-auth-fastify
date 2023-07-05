import {Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, BaseEntity} from "typeorm";
import {UserHistoryEnum} from "../enums/UserHistoryEnum";
import User from "./User";

@Entity("tb_user_history")
class UserHistory extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    dateTime: Date
    @Column({type: "varchar"})
    history: UserHistoryEnum
    @ManyToOne(() => User, (user) => user.history, {cascade: true, lazy: true, onDelete: "CASCADE"})
    @JoinColumn({name: 'id_usuario'})
    user: User
}

export default UserHistory
