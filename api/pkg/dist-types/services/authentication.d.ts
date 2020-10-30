declare const _default: {
    logger: import("@harmonyjs/logger").ILogger;
    account: any;
    configure(account: any): void;
    authenticateAccount(args: {
        req: any;
        res: any;
        done: (error?: Error | undefined) => void;
    }): Promise<any>;
};
export default _default;
