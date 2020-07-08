export enum PERSON_TYPE {
  CREW = 'CREW',
  GUEST = 'GUEST',
  PASSENGER = 'PASSENGER',
  SKIPPER = 'SKIPPER',
}

export enum PERSON_PROPS {
  GUEST_OF = 'guestOf',
  NAME = 'name',
  PROFILE = 'profile',
  PERSON_TYPE = 'personType',
  PRESENT = 'present',
}

export interface IPerson {
  [PERSON_PROPS.GUEST_OF]?: string;
  [PERSON_PROPS.NAME]: string;
  [PERSON_PROPS.PERSON_TYPE]?: PERSON_TYPE;
  [PERSON_PROPS.PRESENT]?: boolean;
  [PERSON_PROPS.PROFILE]?: string;
}
