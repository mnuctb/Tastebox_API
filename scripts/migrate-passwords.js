const db = require("../services/mysql.service");
const { hashPassword } = require("../utils/password");

const BCRYPT_PREFIX = /^\$2[aby]\$/;

const migrate = async () => {
    const [users] = await db.query("SELECT id, password_hash FROM user");
    let migrated = 0;
    for (const user of users) {
        if (BCRYPT_PREFIX.test(user.password_hash)) continue;
        const newHash = await hashPassword(user.password_hash);
        await db.query("UPDATE user SET password_hash = ? WHERE id = ?", [newHash, user.id]);
        migrated++;
    }
    console.log(`Usuarios migrados: ${migrated} de ${users.length}`);
    await db.end();
};

migrate().catch((error) => {
    console.error(error);
    process.exit(1);
});