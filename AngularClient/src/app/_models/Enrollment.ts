import { Student } from '.';

export class Enrollment {
    id: number;
    ensemble: number;
    student: number | Student;
    assets: any[];
}

export class PostEnrollment {
    ensemble: number;
    student: number;
}
