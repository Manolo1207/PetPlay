export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  DogProfile: { dogId: string };
  LostDog: { dogId?: string } | undefined;
  Settings: undefined;
  Legal: undefined;
  MatchSuccess: { dogId: string };
  Chat: { chatId: string; otherUserName: string };
};

export type MainTabsParamList = {
  Home: undefined;
  Community: undefined;
  Profile: undefined;
};
