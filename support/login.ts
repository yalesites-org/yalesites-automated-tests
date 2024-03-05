import { execSync, type ExecSyncOptions } from "child_process";

const LOCAL_CMD = "lando drush {DRUSH_OPTS}";
const REMOTE_CMD = "terminus drush {LOCATION} -- {DRUSH_OPTS}";

type LoginOptions = {
  user?: string;
  roles: Array<string>;
  drupalPath: string;
  multidev?: string;
};

function getLoginUrl(options: LoginOptions): string {
  const user = options.user || "admin";
  const drupalPath = options.drupalPath || "../yalesites-project";

  let cmd = LOCAL_CMD;
  let opts: ExecSyncOptions = { cwd: drupalPath, stdio: "pipe" };

  cmd = cmd + ` ${user}`;
  cmd = cmd.replace("{DRUSH_OPTS}", "user:login");

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
    return false;
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

function assignRoles(
  drupalPath: string,
  username: string,
  roles: Array<string>,
) {
  const opts: ExecSyncOptions = { cwd: drupalPath, stdio: "pipe" };
  roles.forEach((role) => {
    const cmd = `lando drush user:role:add ${role} ${username}`;
    try {
      execSync(cmd, opts);
    } catch (err) {
      return false;
    }
  });
  return true;
}

export { getLoginUrl, doesUserExist, createUser, assignRoles };
