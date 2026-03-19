// services/job.service.ts

import api from "../api/api";
import type { Job, CreateJobPayload, UpdateJobPayload, InterviewDetailsResponse, ApplicationStatus } from "../types/job.types";

export const jobService = {
    // 1. Get all company jobs
    getCompanyJobs: async (): Promise<Job[]> => {
        const response = await api.get('/jobs/company');
        return response.data;
    },

    // 2. Create a new job
    createJob: async (data: CreateJobPayload): Promise<Job> => {
        const response = await api.post('/jobs/create', data);
        return response.data;
    },

    // 3. Update a job
    updateJob: async (id: string, data: UpdateJobPayload): Promise<Job> => {
        const response = await api.patch(`/jobs/${id}`, data);
        return response.data;
    },

    // 4. Delete a job
    deleteJob: async (id: string): Promise<void> => {
        await api.delete(`/jobs/${id}`);
    },

    getInterviewDetails: async (applicationId: string): Promise<InterviewDetailsResponse> => {
        const response = await api.get(`/interview/application/${applicationId}`);
        return response.data;
    },

    updateApplicationStatus: async (applicationId: string, status: ApplicationStatus): Promise<void> => {
        await api.patch(`/interview/application/${applicationId}/status`, { status });
    }
};