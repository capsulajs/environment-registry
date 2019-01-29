export interface Env {
  /** Env access points is an Array of url */
  accessPoints: {
    /** The url gives access to a specific version of a project */
    url: string;
  }[];
}
