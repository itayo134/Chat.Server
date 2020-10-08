function AuthService() {
    this.users = {};

    this.createUser = (username, password, isAdvisor) => {
        if (this.users[username]) {
            return false;
        }
        
        this.user[username] = {
            username,
            password,
            isAdvisor,
            chats: []
        };

        return true;
    };

    this.signIn = (username, password) => {
        if (this.users[username] && this.users[username["password"] === password]) {
            return this.users[username];
        }

        return false;
    };
}