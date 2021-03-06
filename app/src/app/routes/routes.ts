export enum ROOT_ROUTES {
  ACCOUNT_REVIEW = 'account-review',
  ADMIN = 'admin',
  BOATS = 'boats',
  BOAT_INSTRUCTIONS = 'boat-instructions',
  CHALLENGES = 'challenges',
  CLINICS = 'clinics',
  DASHBOARD = 'dashboard',
  FEEDBACK = 'feedback',
  LOGIN = 'login',
  LOGS = 'logs',
  MAINTENANCE = 'maintenance',
  PROFILES = 'profiles',
  REQUIRED_ACTIONS = 'required-actions',
  ROOT = '/',
  SAILS = 'sails',
  SAIL_CHECKLISTS = 'sail-checklists',
  SAIL_PATHS = 'sail-paths',
  SAIL_PEOPLE_MANIFEST = 'sail-people-manifest',
  SAIL_REQUESTS = 'sail-requests',
  SEPARATOR = '/',
}

export enum SUB_ROUTES {
  ARRIVAL_SAIL_CHECKLIST = 'arrival',
  CANCEL_SAIL = 'cancel',
  CREATE_BOAT = 'create',
  CREATE_CHALLENGE = 'create',
  CREATE_CLINIC = 'create',
  CREATE_MAINTENANCE = 'create',
  CREATE_SAIL = 'create',
  CREATE_SAIL_REQUEST = 'create',
  DEPARTURE_SAIL_CHECKLIST = 'departure',
  EDIT_BOAT = 'edit',
  EDIT_BOAT_INSTRUCTIONS = 'edit',
  EDIT_CHALLENGE = 'edit',
  EDIT_CLINIC = 'edit',
  EDIT_CLINIC_ENROLLMENT = 'edit-enrollment',
  EDIT_MAINTENANCE = 'edit',
  EDIT_PROFILE = 'edit',
  EDIT_PROFILE_PRIVILEGES = 'edit-privileges',
  EDIT_SAIL = 'edit',
  EDIT_SAIL_CHECKLIST = 'edit',
  EDIT_SAIL_CREW = 'edit-crew',
  EDIT_SAIL_PASSENGERS = 'edit-passengers',
  EDIT_SAIL_PATH = 'edit',
  EDIT_SAIL_PEOPLE_MANIFEST = 'edit',
  EDIT_SAIL_REQUEST = 'edit',
  EDIT_SAIL_SKIPPER = 'edit-skipper',
  LIST_CHALLENGES = 'list',
  LIST_CLINICS = 'list',
  LIST_FEEDBACK = 'list',
  LIST_LOGS = 'list',
  LIST_SAIL_PATHS = 'list',
  RECORD_SAIL_PATH = 'record',
  RESOLVE_MAINTENANCE = 'resolve',
  SUBMIT_FEEDBACK = 'submit',
  VIEW_BOAT = 'view',
  VIEW_BOAT_INSTRUCTIONS = 'view',
  VIEW_CHALLENGE = 'view',
  VIEW_CLINIC = 'view',
  VIEW_FEEDBACK = 'view',
  VIEW_LOGS = 'view',
  VIEW_MAINTENANCE = 'view',
  VIEW_PROFILE = 'view',
  VIEW_REQUIRED_ACTION = 'view',
  VIEW_SAIL = 'view',
  VIEW_SAIL_CHECKLIST = 'view',
  VIEW_SAIL_PATH = 'view',
  VIEW_SAIL_PEOPLE_MANIFEST = 'view',
  VIEW_SAIL_PER_PERSON = 'user-sails',
  VIEW_SAIL_PICTURES = 'pictures',
  VIEW_SAIL_REQUEST = 'view',
}

export enum FULL_ROUTES {
  ROOT = ROOT_ROUTES.ROOT,
  SEPARATOR = ROOT_ROUTES.SEPARATOR,
  // ^ KEEP THESE FIRST^
  ACCOUNT_REVIEW = ROOT + ROOT_ROUTES.ACCOUNT_REVIEW,
  ADMIN = ROOT + ROOT_ROUTES.ADMIN,
  BOATS = ROOT + ROOT_ROUTES.BOATS,
  BOAT_INSTRUCTIONS = ROOT + ROOT_ROUTES.BOAT_INSTRUCTIONS,
  CHALLENGES = ROOT + ROOT_ROUTES.CHALLENGES,
  CLINICS = ROOT + ROOT_ROUTES.CLINICS,
  DASHBOARD = ROOT + ROOT_ROUTES.DASHBOARD,
  FEEDBACK = ROOT + ROOT_ROUTES.FEEDBACK,
  LOGIN = ROOT + ROOT_ROUTES.LOGIN,
  LOGS = ROOT + ROOT_ROUTES.LOGS,
  MAINTENACE = ROOT + ROOT_ROUTES.MAINTENANCE,
  PROFILE = ROOT + ROOT_ROUTES.PROFILES,
  REQUIRED_ACTIONS = ROOT + ROOT_ROUTES.REQUIRED_ACTIONS,
  SAILS = ROOT + ROOT_ROUTES.SAILS,
  SAIL_CHECKLISTS = ROOT + ROOT_ROUTES.SAIL_CHECKLISTS,
  SAIL_PATHS = ROOT + ROOT_ROUTES.SAIL_PATHS,
  SAIL_PEOPLE_MANIFEST = ROOT + ROOT_ROUTES.SAIL_PEOPLE_MANIFEST,
  SAIL_REQUESTS = ROOT + ROOT_ROUTES.SAIL_REQUESTS,
  // ^ KEEP THESE SECOND^
  ARRIVAL_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SUB_ROUTES.ARRIVAL_SAIL_CHECKLIST,
  CANCEL_SAIL = SAILS + SEPARATOR + SUB_ROUTES.CANCEL_SAIL,
  CREATE_BOAT = BOATS + SEPARATOR + SUB_ROUTES.CREATE_BOAT,
  CREATE_CHALLENGE = CHALLENGES + SEPARATOR + SUB_ROUTES.CREATE_CHALLENGE,
  CREATE_CLINIC = CLINICS + SEPARATOR + SUB_ROUTES.CREATE_CLINIC,
  CREATE_MAINTENANCE = MAINTENACE + SEPARATOR + SUB_ROUTES.CREATE_MAINTENANCE,
  CREATE_SAIL = SAILS + SEPARATOR + SUB_ROUTES.CREATE_SAIL,
  CREATE_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SUB_ROUTES.CREATE_SAIL_REQUEST,
  DEPARTURE_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SUB_ROUTES.DEPARTURE_SAIL_CHECKLIST,
  EDIT_BOAT = BOATS + SEPARATOR + SUB_ROUTES.EDIT_BOAT,
  EDIT_BOAT_INSTRUCTIONS = BOAT_INSTRUCTIONS + SEPARATOR + SUB_ROUTES.EDIT_BOAT_INSTRUCTIONS,
  EDIT_CHALLENGE = CHALLENGES + SEPARATOR + SUB_ROUTES.EDIT_CHALLENGE,
  EDIT_CLINIC = CLINICS + SEPARATOR + SUB_ROUTES.EDIT_CLINIC,
  EDIT_CLINIC_ENROLLMENT = CLINICS + SEPARATOR + SUB_ROUTES.EDIT_CLINIC_ENROLLMENT,
  EDIT_MAINTENANCE = MAINTENACE + SEPARATOR + SUB_ROUTES.EDIT_MAINTENANCE,
  EDIT_PROFILE = PROFILE + SEPARATOR + SUB_ROUTES.EDIT_PROFILE,
  EDIT_PROFILE_PRIVILEGES = ADMIN + SEPARATOR + SUB_ROUTES.EDIT_PROFILE_PRIVILEGES,
  EDIT_SAIL = SAILS + SEPARATOR + SUB_ROUTES.EDIT_SAIL,
  EDIT_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_CHECKLIST,
  EDIT_SAIL_CREW = SAILS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_CREW,
  EDIT_SAIL_PASSENGERS = SAILS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_PASSENGERS,
  EDIT_SAIL_PATH = SAIL_PATHS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_PATH,
  EDIT_SAIL_PEOPLE_MANIFEST = SAIL_PEOPLE_MANIFEST + SEPARATOR + SUB_ROUTES.EDIT_SAIL_PEOPLE_MANIFEST,
  EDIT_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_REQUEST,
  EDIT_SAIL_SKIPPER = SAILS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_SKIPPER,
  LIST_CHALLENGES = CHALLENGES + SEPARATOR + SUB_ROUTES.LIST_CHALLENGES,
  LIST_CLICNICS = CLINICS + SEPARATOR + SUB_ROUTES.LIST_CLINICS,
  LIST_FEEDBACK = FEEDBACK + SEPARATOR + SUB_ROUTES.LIST_FEEDBACK,
  LIST_LOGS = LOGS + SEPARATOR + SUB_ROUTES.LIST_LOGS,
  LIST_SAIL_PATHS = SAIL_PATHS + SEPARATOR + SUB_ROUTES.LIST_SAIL_PATHS,
  RECORD_SAIL_PATH = SAIL_PATHS + SEPARATOR + SUB_ROUTES.RECORD_SAIL_PATH,
  RESOLVE_MAINTENANCE = MAINTENACE + SEPARATOR + SUB_ROUTES.RESOLVE_MAINTENANCE,
  SUBMIT_FEEDBACK = FEEDBACK + SEPARATOR + SUB_ROUTES.SUBMIT_FEEDBACK,
  VIEW_BOAT = BOATS + SEPARATOR + SUB_ROUTES.VIEW_BOAT,
  VIEW_BOAT_INSTRUCTIONS = BOAT_INSTRUCTIONS + SEPARATOR + SUB_ROUTES.VIEW_BOAT_INSTRUCTIONS,
  VIEW_CHALLENGE = CHALLENGES + SEPARATOR + SUB_ROUTES.VIEW_CHALLENGE,
  VIEW_CLINIC = CLINICS + SEPARATOR + SUB_ROUTES.VIEW_CLINIC,
  VIEW_FEEDBACK = FEEDBACK + SEPARATOR + SUB_ROUTES.VIEW_FEEDBACK,
  VIEW_LOGS = LOGS + SEPARATOR + SUB_ROUTES.VIEW_LOGS,
  VIEW_MAINTENANCE = MAINTENACE + SEPARATOR + SUB_ROUTES.VIEW_MAINTENANCE,
  VIEW_PROFILE = PROFILE + SEPARATOR + SUB_ROUTES.VIEW_PROFILE,
  VIEW_REQUIRED_ACTION = REQUIRED_ACTIONS + SEPARATOR + SUB_ROUTES.VIEW_REQUIRED_ACTION,
  VIEW_SAIL = SAILS + SEPARATOR + SUB_ROUTES.VIEW_SAIL,
  VIEW_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_CHECKLIST,
  VIEW_SAIL_PATH = SAIL_PATHS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_PATH,
  VIEW_SAIL_PEOPLE_MANIFEST = SAIL_PEOPLE_MANIFEST + SEPARATOR + SUB_ROUTES.VIEW_SAIL_PEOPLE_MANIFEST,
  VIEW_SAIL_PER_PERSON = SAILS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_PER_PERSON,
  VIEW_SAIL_PICTURES = SAILS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_PICTURES,
  VIEW_SAIL_REQUEST = SAIL_CHECKLISTS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_REQUEST,
}

export const adminRoute = FULL_ROUTES.ADMIN;
export const arrivalSailChecklistRoute = (id: string) => `${FULL_ROUTES.ARRIVAL_SAIL_CHECKLIST}/${id}`;
export const boatsRoute = FULL_ROUTES.BOATS;
export const cancelSailRoute = (sailId: string) => `${FULL_ROUTES.CANCEL_SAIL}/${sailId}`;
export const challengesRoute = FULL_ROUTES.CHALLENGES;
export const clinicsRoute = FULL_ROUTES.CLINICS;
export const createBoatRoute = FULL_ROUTES.CREATE_BOAT;
export const createChallengeRoute = FULL_ROUTES.CREATE_CHALLENGE;
export const createClinicRoute = FULL_ROUTES.CREATE_CLINIC;
export const createMaintenanceRoute = FULL_ROUTES.CREATE_MAINTENANCE;
export const createSailRequestRoute = FULL_ROUTES.CREATE_SAIL_REQUEST;
export const createSailRoute = FULL_ROUTES.CREATE_SAIL;
export const departureSailChecklistRoute = (id: string) => `${FULL_ROUTES.DEPARTURE_SAIL_CHECKLIST}/${id}`;
export const editBoatInstructionsRoute = (boatId: string) => `${FULL_ROUTES.EDIT_BOAT_INSTRUCTIONS}/${boatId}`;
export const editBoatRoute = (boatId: string) => `${FULL_ROUTES.EDIT_BOAT}/${boatId}`;
export const editChallengeRoute = (challengeId: string) => `${FULL_ROUTES.EDIT_CHALLENGE}/${challengeId}`;
export const editClinicRoute = (clinicId: string) => `${FULL_ROUTES.EDIT_CLINIC}/${clinicId}`;
export const editClinicEnrollmentRoute = (clinicId: string) => `${FULL_ROUTES.EDIT_CLINIC_ENROLLMENT}/${clinicId}`;
export const editMaintenanceRoute = (maintenanceId: string) => `${FULL_ROUTES.EDIT_MAINTENANCE}/${maintenanceId}`;
export const editProfilePrivilegesRoute = (profileId: string) => `${FULL_ROUTES.EDIT_PROFILE_PRIVILEGES}/${profileId}`;
export const editProfileRoute = (profileId: string) => `${FULL_ROUTES.EDIT_PROFILE}/${profileId}`;
export const editSailChecklistRoute = (id: string) => `${FULL_ROUTES.EDIT_SAIL_CHECKLIST}/${id}`;
export const editSailCrewRoute = (sailId: string) => `${FULL_ROUTES.EDIT_SAIL_CREW}/${sailId}`;
export const editSailPassengersRoute = (sailId: string) => `${FULL_ROUTES.EDIT_SAIL_PASSENGERS}/${sailId}`;
export const editSailPathRoute = (sailPathId: string) => `${FULL_ROUTES.EDIT_SAIL_PATH}/${sailPathId}`;
export const editSailPeopleManifestRoute = (sailChecklistId: string) => `${FULL_ROUTES.EDIT_SAIL_PEOPLE_MANIFEST}/${sailChecklistId}`;
export const editSailRequestRoute = (id: string) => `${FULL_ROUTES.EDIT_SAIL_REQUEST}/${id}`;
export const editSailRoute = (sailId: string) => `${FULL_ROUTES.EDIT_SAIL}/${sailId}`;
export const editSailSkipperRoute = (sailId: string) => `${FULL_ROUTES.EDIT_SAIL_SKIPPER}/${sailId}`;
export const listChallengesRoute = `${FULL_ROUTES.LIST_CHALLENGES}`;
export const listClinicsRoute = () => `${FULL_ROUTES.LIST_CLICNICS}`;
export const listFeedbackRoute = (sailId: string) => `${FULL_ROUTES.LIST_FEEDBACK}/${sailId}`;
export const listLogsRoute = `${FULL_ROUTES.LIST_LOGS}`;
export const listSailPathsRoute = (sailId: string) => `${FULL_ROUTES.LIST_SAIL_PATHS}/${sailId}`;
export const maintenanceRoute = FULL_ROUTES.MAINTENACE;
export const recordSailPathRoute = (sailPathId: string) => `${FULL_ROUTES.RECORD_SAIL_PATH}/${sailPathId}`;
export const resolveMaintenanceRoute = (maintenanceId: string) => `${FULL_ROUTES.RESOLVE_MAINTENANCE}/${maintenanceId}`;
export const sailChecklistsRoute = FULL_ROUTES.SAIL_CHECKLISTS;
export const sailRequestsRoute = FULL_ROUTES.SAIL_REQUESTS;
export const sailsRoute = FULL_ROUTES.SAILS;
export const submitFeedbackRoute = (sailId: string) => `${FULL_ROUTES.SUBMIT_FEEDBACK}/${sailId}`;
export const viewBoatInstructionsRoute = (boatId: string) => `${FULL_ROUTES.VIEW_BOAT_INSTRUCTIONS}/${boatId}`;
export const viewBoatRoute = (boatId: string) => `${FULL_ROUTES.VIEW_BOAT}/${boatId}`;
export const viewChallengeRoute = (challengeId: string) => `${FULL_ROUTES.VIEW_CHALLENGE}/${challengeId}`;
export const viewClinicRoute = (clinicId: string) => `${FULL_ROUTES.VIEW_CLINIC}/${clinicId}`;
export const viewFeedbackRoute = (feedbackId: string) => `${FULL_ROUTES.VIEW_FEEDBACK}/${feedbackId}`;
export const viewLogsRoute = (profileId: string) => `${FULL_ROUTES.VIEW_LOGS}/${profileId}`;
export const viewMaintenanceRoute = (maintenanceId: string) => `${FULL_ROUTES.VIEW_MAINTENANCE}/${maintenanceId}`;
export const viewProfileRoute = (profileId: string) => `${FULL_ROUTES.VIEW_PROFILE}/${profileId}`;
export const viewRequiredActionRoute = (requiredActionId: string) => `${FULL_ROUTES.VIEW_REQUIRED_ACTION}/${requiredActionId}`;
export const viewSailChecklistRoute = (id: string) => `${FULL_ROUTES.VIEW_SAIL_CHECKLIST}/${id}`;
export const viewSailPathRoute = (sailPathId: string) => `${FULL_ROUTES.VIEW_SAIL_PATH}/${sailPathId}`;
export const viewSailPeopleManifestRoute = (sailChecklistId: string) => `${FULL_ROUTES.VIEW_SAIL_PEOPLE_MANIFEST}/${sailChecklistId}`;
export const viewSailPicturesRoute = (sailId: string) => `${FULL_ROUTES.VIEW_SAIL_PICTURES}/${sailId}`;
export const viewSailRequestRoute = (id: string) => `${FULL_ROUTES.VIEW_SAIL_REQUEST}/${id}`;
export const viewSailRoute = (sailId: string) => `${FULL_ROUTES.VIEW_SAIL}/${sailId}`;
export const viewUserSailsRoute = (profileId: string) => `${FULL_ROUTES.VIEW_SAIL_PER_PERSON}/${profileId}`;
