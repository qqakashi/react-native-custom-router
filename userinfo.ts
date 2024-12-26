import LocalStorage from "./store"
const USERTOKEN = "USERTOKEN"
const UserService = {
    saveUserToken: async (info: any) => {
        LocalStorage.setItem(USERTOKEN, info);
    },
    removeUserToken: async () => {
        LocalStorage.removeItem(USERTOKEN);
    },
    getUserToken: async () => {
        return LocalStorage.getItem<string>(USERTOKEN);
    }
}

export {UserService}