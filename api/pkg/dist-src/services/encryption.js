// @ts-ignore
import aes256 from "aes256";
function EncryptionService() {
    const instance = {
        secret: "",
        configure(configuration) {
            this.secret = configuration.secret;
        },
        encryptPassword(args) {
            return aes256
                .encrypt(this.secret, args.password + args.salt)
                .toString();
        },
        comparePassword(args) {
            return (aes256.decrypt(this.secret, args.encrypted) ===
                args.password + args.salt);
        },
    };
    return instance;
}
export default EncryptionService();
