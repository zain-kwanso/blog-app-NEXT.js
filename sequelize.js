import "ts-node/register";
import { execSync } from "child_process";

execSync("sequelize db:migrate", { stdio: "inherit" });
