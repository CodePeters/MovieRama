export interface User {
	user:{
		id: number;
		username: string;
		password: string;
		email: string;
	};
	token: string;
}

export interface CreateUserPayload {
	  email: string;
	  username: string;
	  password: string;
}
  
export interface LoginUserPayload {
	username: string;
	password: string;
}
