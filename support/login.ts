import { execSync, type ExecSyncOptions } from "child_process";

const LOCAL_CMD = "lando drush uli";
const REMOTE_CMD = "terminus drush ~ -- user:login";

type LoginOptions = {
  user?: string,
  roles: Array<string>,
  drupalPath: string,
};

function getLoginUrl(options: LoginOptions): string {
  const user = options.user || "admin";
  const roles = options.roles || [];
  const drupalPath = options.drupalPath || "../yalesites-project";

  let cmd = LOCAL_CMD;
  let opts: ExecSyncOptions = { cwd: drupalPath, stdio: "pipe" };

  cmd = cmd + ` ${user}`;

  // If the path is a reference to a pantheon name with .dev, .live, .test extension.
  // if (pathToUse.match(/\.dev|\.live|\.test/)) {
  //   cmd = REMOTE_CMD.replace("~", drupalPath);
  //   opts = { stdio: "pipe" };
  // }

  try {
    const stdout = execSync(cmd, opts);
    return stdout.toString().trim();
  } catch (err) {
    console.log(err);
    return null;
  }
}

function doesUserExist(drupalPath: string, username: string) {
  const opts: ExecSyncOptions = { cwd: drupalPath, stdio: "pipe" };
  const cmd = `lando drush user:information ${username}`;
  try {
    execSync(cmd, opts);
    return true;
  } catch (err) {
    return false
  }
}

function createUser(drupalPath: string, username: string) {
  const opts: ExecSyncOptions = { cwd: drupalPath, stdio: "pipe" };
  const cmd = `lando drush user:create ${username}`;
  try {
    execSync(cmd, opts);
    return true;
  } catch (err) {
    return false;
  }
}

export {
  getLoginUrl,
  doesUserExist,
  createUser,
}
