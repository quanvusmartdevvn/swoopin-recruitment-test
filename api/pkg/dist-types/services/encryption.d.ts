declare const _default: {
    secret: string;
    configure(configuration: any): void;
    encryptPassword(args: {
        password: string;
        salt: string;
    }): any;
    comparePassword(args: {
        password: string;
        salt: string;
        encrypted: string;
    }): boolean;
};
export default _default;
