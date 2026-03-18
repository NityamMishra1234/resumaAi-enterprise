import type { companyDto, } from "../types/user.type";

const USER_KEY = "user_data";
export const userStorage = {
    async setCompany(user: companyDto) {
        localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    async getCompany() {
        const data = await localStorage.getItem(USER_KEY)

        if (!data) return null;

        return JSON.parse(data)
    },

    async removeCompany() {
        await localStorage.removeItem(USER_KEY)
    }
}