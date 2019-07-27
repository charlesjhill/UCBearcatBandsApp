import { User } from './user';
import { Enrollment } from './Enrollment';

export class Student {
    m_number: string;
    user: User;
    enrollments: Enrollment[];
}
