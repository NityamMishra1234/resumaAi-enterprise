// types/job.types.ts

export enum JobType {
    FULL_TIME = "full-time",
    PART_TIME = "part-time",
    INTERNSHIP = "internship",
    CONTRACT = "contract"
}

export interface Application {
    id: string;
    user: User;
    resumeUrl: string;
    portfolioUrl: string;
    status: string;
    score: number;
    appliedAt: string;
}

export interface User {
    id: string,
    name: string,
    email: string,
    createdAt: string,
    updatedAt: string,
}

export interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    type: JobType;
    salaryMin?: number;
    salaryMax?: number;
    isActive: boolean;
    applications: Application[];
    skills: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateJobPayload {
    title: string;
    description: string;
    location: string;
    type: JobType;
    salaryMin?: number;
    salaryMax?: number;
    skills?: string[];
}

export enum ApplicationStatus {
    PENDING = "pending",
    IN_PROGRESS = "in-progress",
    COMPLETED = "completed",
    SHORTLISTED = "shortlisted",
    REJECTED = "rejected"
}

export interface Conversation {
    question: string;
    answer: string;
}

export interface InterviewDetailsResponse {
    application: Application;
    user: User;
    job: {
        id: string;
        title: string;
        skills: string[];
    };
    interview: {
        score: number;
        feedback: string;
        difficulty: string;
        conversation: Conversation[];
        createdAt: string;
    };
}
export type UpdateJobPayload = Partial<CreateJobPayload>;