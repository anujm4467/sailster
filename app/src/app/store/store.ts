import { appReducer } from './reducers/app.reducer';
import { boatMaintenanceReducer } from './reducers/boat-maintenance.reducer';
import { boatReducer } from './reducers/boat.reducer';
import { cdnReducer } from './reducers/cdn.reducer';
import { challengeReducer } from './reducers/challenge.reducer';
import { clinicsReducer } from './reducers/clinics.reducer';
import { crewReducer } from './reducers/crew.reducer';
import { feedbackReducer } from './reducers/feedback.reducer';
import { instructionsReducer } from './reducers/instructions.reducer';
import { loginReducer } from './reducers/login.reducer';
import { memberReducer } from './reducers/member.reducer';
import { pastSailsReducer } from './reducers/past-sails.reducer';
import { profileReducer } from './reducers/profile.reducer';
import { requiredActionsReducer } from './reducers/required-actions.reducer';
import { sailChecklistReducer } from './reducers/sail-checklist.reducer';
import { sailPathReducer } from './reducers/sail-path.reducer';
import { sailRequestReducer } from './reducers/sail-request.reducer';
import { sailReducer } from './reducers/sail.reducer';
import { skipperReducer } from './reducers/skipper.reducer';
import { snackReducer } from './reducers/snack.reducer';
import { upcomingSailsReducer } from './reducers/upcoming-sails.reducer';
import { userAccessReducer } from './reducers/user-access.reducer';

export enum STORE_SLICES {
  APP = 'app',
  BOATS = 'boats',
  BOAT_MAINTENANCES = 'maintenances',
  CDN = 'cdn',
  CHALLENGES = 'challenges',
  CHECKLISTS = 'checklists',
  CLINICS = 'clinics',
  CREW = 'crew',
  FEEDBACKS = 'feedbacks',
  INSTRUCTIONS = 'instructions',
  LOGIN = 'login',
  MEMBERS = 'members',
  PAST_SAILS = 'pastSails',
  PROFILES = 'profiles',
  REQUIRED_ACTIONS = 'requiredActions',
  SAILS = 'sails',
  SAIL_PATHS = 'sailPaths',
  SAIL_REQUESTS = 'sailRequests',
  SKIPPERS = 'skippers',
  SNACKS = 'snacks',
  UPCOMING_SAILS = 'upcomingSails',
  USER_ACCESS = 'userAccess',
}

export const store = {
  [STORE_SLICES.APP]: appReducer,
  [STORE_SLICES.BOATS]: boatReducer,
  [STORE_SLICES.BOAT_MAINTENANCES]: boatMaintenanceReducer,
  [STORE_SLICES.CDN]: cdnReducer,
  [STORE_SLICES.CHALLENGES]: challengeReducer,
  [STORE_SLICES.CHECKLISTS]: sailChecklistReducer,
  [STORE_SLICES.CLINICS]: clinicsReducer,
  [STORE_SLICES.CREW]: crewReducer,
  [STORE_SLICES.FEEDBACKS]: feedbackReducer,
  [STORE_SLICES.INSTRUCTIONS]: instructionsReducer,
  [STORE_SLICES.LOGIN]: loginReducer,
  [STORE_SLICES.MEMBERS]: memberReducer,
  [STORE_SLICES.PAST_SAILS]: pastSailsReducer,
  [STORE_SLICES.PROFILES]: profileReducer,
  [STORE_SLICES.REQUIRED_ACTIONS]: requiredActionsReducer,
  [STORE_SLICES.SAILS]: sailReducer,
  [STORE_SLICES.SAIL_PATHS]: sailPathReducer,
  [STORE_SLICES.SAIL_REQUESTS]: sailRequestReducer,
  [STORE_SLICES.SKIPPERS]: skipperReducer,
  [STORE_SLICES.SNACKS]: snackReducer,
  [STORE_SLICES.UPCOMING_SAILS]: upcomingSailsReducer,
  [STORE_SLICES.USER_ACCESS]: userAccessReducer,
};
