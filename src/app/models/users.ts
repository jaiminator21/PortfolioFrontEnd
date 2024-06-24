export class User {
  constructor(
    public username?: any,
    public email?: any,
    public password?: any,
    public cpassword?: any,
    public role: 'admin' | 'user' = 'user',
    public token?: any
  ) {}
}
