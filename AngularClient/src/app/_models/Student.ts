import { User } from './user';

export class Enrollment {
    ensemble: number;
    student: number;
    assets: number[];
}

export class Student {
    m_number: string;
    user: User;
    enrollments: Enrollment[];
}
