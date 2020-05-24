import type { Student, Enrollment } from '.';

export class Ensemble {
    id: number;
    name: string;
    term: string;
    is_active: boolean;
    members: Student[];
    enrollments: number[] | Enrollment[];
}
