// @ts-ignore
import aes256 from "aes256";

function EncryptionService() {
    const instance = {
        secret: "",

        configure(configuration: any) {
            this.secret = configuration.secret;
        },

        encryptPassword(args: { password: string; salt: string }) {
            return aes256
                .encrypt(this.secret, args.password + args.salt)
                .toString();
        },

        comparePassword(args: {
            password: string;
            salt: string;
            encrypted: string;
        }) {
            return (
                aes256.decrypt(this.secret, args.encrypted) ===
                args.password + args.salt
            );
        },
    };

    return instance;
}

export default EncryptionService();
