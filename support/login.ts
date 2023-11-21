import { execSync, type ExecSyncOptions } from "child_process";

const LOCAL_CMD = "lando drush uli";
const REMOTE_CMD = "terminus drush ~ -- user:login";

/*
 * Get the admin login URL for the site whether local or on lando.
 * 
 * @param {string} path - path to the yalesites-project directory.
 * 
 * @returns {string} - the login URL.
 */
export default function getLoginUrl(path: string) : string {
  let pathToUse = path;
  if (!path) {
    console.log("You might want to check the path is defined in YALESITES_PROJECT_PATH: defaulting to ../yalesites-project");
    pathToUse = "../yalesites-project";
  }

  let cmd = LOCAL_CMD;
  let opts: ExecSyncOptions = { cwd: pathToUse, stdio: 'pipe'};

  // If the path is a reference to a pantheon name with .dev, .live, .test extension.
  if (pathToUse.match(/\.dev|\.live|\.test/)) {
    cmd = REMOTE_CMD.replace('~', pathToUse);
    opts = { stdio: 'pipe' };
  }

  try {
    const stdout = execSync(cmd, opts);
    return stdout.toString().trim();
  }
  catch (err) {
    console.log(err);
    return null;
  };
};
