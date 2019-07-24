import { Student, Enrollment } from './Student';
export class Ensemble {
    id: number;
    name: string;
    term: string;
    is_active: boolean;
    members: Student[];
    enrollments: Enrollment[];
}