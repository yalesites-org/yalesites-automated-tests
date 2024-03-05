import { execSync, type ExecSyncOptions } from "child_process";

const LOCAL_CMD = "lando drush {DRUSH_OPTS}";
const REMOTE_CMD = "terminus drush {LOCATION} -- {DRUSH_OPTS}";

type LoginOptions = {
  user?: string;
  roles: Array<string>;
  drupalPath: string;
  multidev?: string;
};

/*
 * Get the login URL for a user
 * @param options
 * @param options.user - the username of the user
 * @param options.roles - an array of roles to assign to the user
 * @param options.drupalPath - the path to the Drupal project
 * @param options.multidev - the multidev environment to use
 * @returns the login URL
 */
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

/*
 * Check if a user exists
 * @param drupalPath - the path to the Drupal project
 * @param username - the username to check
 * @returns true if the user exists, false if not
 */
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

/*
 * Create a user
 * @param drupalPath - the path to the Drupal project
 * @param username - the username to create
 * @returns true if the user was created, false if not
 */
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

/*
 * Assign roles to a user
 * @param drupalPath - the path to the Drupal project
 * @param username - the username to assign roles to
 * @param roles - an array of roles to assign
 * @returns true if the roles were assigned, false if not
 */
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

function ensureLoggedIn(user: string, roles: Array<string>, drupalPath: string) {
  if (!doesUserExist(drupalPath, user)) {
    createUser(drupalPath, user);
  }

  assignRoles(drupalPath, user, roles);
  return getLoginUrl({ user, drupalPath, roles });
}

export { getLoginUrl, doesUserExist, createUser, assignRoles, ensureLoggedIn };
