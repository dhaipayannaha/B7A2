import app from "./app";
import config from "./config";
const main = () => {
    app.listen(config.database.port, () => {
        console.log(`Example app listening on Port ${config.database.port}`);
    });
};
main();
//# sourceMappingURL=server.js.map