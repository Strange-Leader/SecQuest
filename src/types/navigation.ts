import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: { challenge: Challenge };
  ChallengeOne: undefined;
  ChallengeTwo: undefined;
  ChallengeThree: undefined;
  ChallengeFour: undefined;
  ChallengeFive: undefined;
  ChallengeSix: undefined;
  ChallengeSeven: undefined;
  ChallengeEight: undefined;
  ChallengeNine: undefined;
  Flag: { flag: string };
  AdminPanel: undefined;
};

export interface Challenge {
  id: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeScreenProps = RootStackScreenProps<'Home'>;
export type ProfileScreenProps = RootStackScreenProps<'Profile'>;
export type ChallengeOneProps = RootStackScreenProps<'ChallengeOne'>;
export type ChallengeTwoProps = RootStackScreenProps<'ChallengeTwo'>;
export type ChallengeThreeProps = RootStackScreenProps<'ChallengeThree'>;
export type ChallengeFourProps = RootStackScreenProps<'ChallengeFour'>;
export type ChallengeFiveProps = RootStackScreenProps<'ChallengeFive'>;
export type ChallengeSixProps = RootStackScreenProps<'ChallengeSix'>;
export type ChallengeSevenProps = RootStackScreenProps<'ChallengeSeven'>;
export type ChallengeEightProps = RootStackScreenProps<'ChallengeEight'>;
export type ChallengeNineProps = RootStackScreenProps<'ChallengeNine'>;
export type FlagScreenProps = RootStackScreenProps<'Flag'>;
export type AdminPanelScreenProps = RootStackScreenProps<'AdminPanel'>; 