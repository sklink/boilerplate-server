/**
 * The following configuration variables determine at a high-level what features
 * are enabled in the application.
 *
 * These are not hooked up to env variables because they have heavy implications
 * on the user experience of the application.
 */
import { MAIL_PROVIDERS } from '@/services/mailer';

// TODO: Review this file and configure high-level settings for your app...
export const HAS_USERS = true;
export const HAS_COMPANIES = true;
export const HAS_PROJECTS = true;

export const OPEN_REGISTRATION = HAS_USERS && true;

export const HAS_PHI = false;
export const ENABLE_WEBSOCKETS = false;

export const MAIL_PROVIDER = MAIL_PROVIDERS.ENVOKE;
export const ENABLE_EMAIL = !HAS_PHI || MAIL_PROVIDER.PHI_COMPLIANT;

/**
 * NOTE: You can enable remote debugging on PHI enabled application, but be sure
 * that you are not exposing sensitive information to the public in your logs
 */
export const ENABLE_REMOTE_DEBUGGING = !HAS_PHI && false;

export const ROLES = [
  // Add your roles here
];

// Add administrators to all companies with "ADMIN" level access
// Configure administrator emails in process.env.ADMIN_USERS
export const ADMIN_GLOBAL_ACCESS = false;
