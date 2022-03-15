export default {
  HTTP_SUCCESS_CODE: 200,
  HTTP_ERROR_CODE: 502,
  SERVER_NOT_FOUND: 500,
  UNAUTHORIZED_ACCESS_CODE: 401,
  NO_CONTENT_FOUND: 204,
  API_SUCCESS_STATUS: 'Success',
  NETWORK_ERROR:
    "Sorry, we couldn't complete your request. Please try again in a moment or please check your internet connectivity",
  REQ_FAILED:
    "Sorry, we couldn't complete your request. Please try again in a moment",
  PLACEHOLDER: {
    USERNAME: 'Email or phone number',
    PASSWORD: 'Password',
    FIRST_NAME: 'First name',
    LAST_NAME: 'Last name',
    POST_CODE: 'Home postcode',
    DOB: 'Date of birth',
    PROJECT_CODE: 'Project code',
    VALIDATION_CODE: 'Enter validation code',
    RESET_PASSWORD: 'New password',
  },
  ASYNC_KEYS: {
    USER_DATA: 'USER_DATA',
    LOGGED_IN: 'LOGGED_IN',
    PROJECT_SWITCHER_DATA: 'PROJECT_SWITCHER_DATA',
    USER_DETAILS: 'USER_DETAILS',
    PROJECT_ID: 'PROJECT_ID',
  },
  YOUTUBE_COM: 'youtube.com',
  YOUTUBE_BE: 'youtu.be',
  INVALID_USERNAME: "can't be blank and should have proper email",
  INVALID_PHONE_NUMBER: "can't be blank and should have proper phone number",
  INVALID_USERNAME_PHONE_NUMBER:
    "can't be blank and should have proper email or phone number",
  INVALID_FIRST_NAME: "can't be blank and should have proper first name",
  INVALID_LAST_NAME: "can't be blank and should have proper last name",
  INVALID_POSTAL_CODE: "can't be blank and should have proper home postcode",
  INVALID_PASSWORD_LENGTH:
    "can't be blank and should have minimum 8 characters",
  INVALID_VALIDATION_CODE: 'Invalid Validation code',
  VALIDATION_CODE_ERROR: 'Please provide a validation code',
  SURVEY_SUCCESS: 'You have successfully completed the survey',
  USER_NOT_PASSWORD: 'User not found',
  CAMERA_PERMISSION:
    'Go to Settings to allow access to your camera to take pictures when uploading your photos',
  GALLERY_PERMISSION:
    'Go to Settings to allow access to your photos to choose when uploading your photos',
  EXTERNAL_STORAGE_PERMISSION:
    'Go to Settings to allow access to your Library to save files',
  PHOTO_PERMISSION_TITLE: "Allow 'Brightside' Access Your Photos",
  CAMERA_PERMISSION_TITLE: "Allow 'Brightside' Access Your Camera",
  EXTERNAL_STORAGE_TITLE: "Allow 'Brightside' Access Your Files",
  ENTER_QUESTION: 'Please enter a question',
  NO_EMAIL_FOR_GRADUATE:
    'No email id present to send your question, please contact to your Coordinator',
  QUESTION_SUBMIT_SUCCESS: 'Question submitted successfully',
  FILE_SIZE_VALIDATION: 'Please attach file size upto 10 MB',
  FILE_FORMAT_VALIDATION: 'Please attach JPG, JPEG, PNG, GIF files only',
  PHONE_NUMBER_USED: 'Phone number has already been taken',
  FONTS: {
    regular: {
      weight: '400',
      family: 'OpenSans-Regular',
      style: 'normal',
    },
    bold: {
      weight: '700',
      family: 'OpenSans-Bold',
      style: 'normal',
    },
    semiBold: {
      weight: '600',
      family: 'OpenSans-SemiBold',
      style: 'normal',
    },
    italic: {
      weight: '400',
      family: 'OpenSans-Italic',
      style: 'normal',
    },
  },
  PRIVACY_POLICY_LINK: 'app-privacy',
  TERMS_AND_CONDITION_LINK: 'app-terms',
  NO_RECORDS_FOUND: 'No Records Found',
  FlAGGED_MODERATION_MESSAGE:
    'Your message has been sent into the moderation queue. Once it is approved, it will be sent to the recipient',
  DECLINED_MODERATION_MESSAGE:
    'This message has been declined in moderation. For details please check your Project Support channel or contact your coordinator',
  SMART_MODERATION_MESSAGE: 'You have flagged this message for moderation',
  INVALID_REPORT_MESSAGE: 'Please enter the reason',
  OPEN_SURVEY_INCOMPLETE:
    'You will not be able to access your messaging channel until you complete the survey',
  OPEN_SURVEY_IN_ASSIGNMENT:
    'You will not be able to access your assignment screen until you complete the survey',
  LINK_REMOVED_MESSAGE: 'Link removed from the channel',
  LINK_COPIED_MESSAGE: 'Link copied to the channel',
  ACCOUNT_UPDATE_MESSAGE: 'Account updated successfully',
  EMAIL_PHONE_MESSAGE: 'At least an email or phone number is required',
  SIDE_MENU_ELEMENTS: [
    {
      title: 'Home',
      route: 'LandingPage',
      id: 'home',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'Channels',
      route: 'Channels',
      id: 'channel',
      type: 'label',
      isRequired: true,
    },
    {
      title: 'Resources',
      route: '',
      id: 'resources',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'My Account',
      route: 'Profile',
      id: 'myAccount',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'My Achievements',
      route: 'achievement',
      id: 'myAchievement',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'My Mentor',
      route: 'mentorProfile',
      id: 'mentorAccount',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'Project Materials',
      route: 'ProjectMaterial',
      id: 'projectResourcesScreen',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'Ask the',
      route: 'AskTheGuruScreen',
      id: 'askTheGraduate',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'Activities',
      route: 'Activities',
      id: 'activities',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'Assignments',
      route: 'AssignmentScreen',
      id: 'assignment',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'Communities',
      route: 'CommunitiesScreen',
      id: 'communities',
      type: 'button',
      isRequired: true,
    },
    {
      title: 'Sign Out',
      route: 'LogOut',
      id: 'signOut',
      type: 'button',
      isRequired: true,
    },
  ],
  SURVEY_PAGE_TEXTS: {
    HEADER_TEXT: 'We need some information as part of your mentoring journey.',
    BODY_TEXT: 'Please take a moment to click through and complete the form.',
    FOOTER_TEXT:
      "The form will open in a new tab. When you're finished, the window will close and you will return here. You’ll need to reload the page to access your mentoring.",
  },
  READ_ARTICLE_TEXT: 'Read this article:',
  I_HAVE_COMPLETED: "I've just completed the",
  STAR: '*',
  PROFILE_PICTURE_NEEDS_TO_BE_APPROVED:
    'Your profile picture needs to be approved before it will be updated',
  PROFILE_PICTURE_UPDATED_SUCCESSFULLY:
    'Your profile picture updated successfully',
  NEW_DECLINED_MODERATION_MESSAGE:
    'This message has been declined in moderation. Reason: ',
  UNDERSCORE: '_',
  STATUS_BAR_COLOR: {
    DARK_CONTENT: 'dark-content',
    LIGHT_CONTENT: 'light-content',
  },
  PASSWORD_RESET_LINK_MESSAGE: 'Password reset link is invalid or already used',
  LANDING_PAGE_DEFAULT: {
    TITLE: 'Welcome to mentoring with Brightside',
    INTRO:
      'You’re about to start your mentoring journey. Let’s see what’s waiting for you',
    CHANNEL_BUTTON_TEXT: 'Got it! Take me to my channels',
    CONNECTION_LANDING_BUTTON_TEXT: 'Go to connection landing page',
  },
  FlAGGED_MODERATION_THREAD_MESSAGE:
    'Your post has been sent into the moderation queue. Once it is approved, it will be seen by the recipient.',
  ARCHIVED_USER:
    'You have been archived from this project so you can no longer send messages in this channel but feel free to review your previous conversation or contact your coordinator if you have any questions',
  SESSION_OUT_MESSAGE:
    'Sorry, you are not authorised to access this project. Please contact your coordinator',
  REPORT_MESSAGE_SCREEN_PLACEHOLDER:
    'Please state the reason you wish to flag this message for moderation. Once you press submit, this message will be sent to the coordinator for moderation and be removed from your channel',
  OFFLINE_IMAGE_UPLOAD_MESSAGE: 'Cannot upload image in offline mode',
  NO_DATA_PROJECT_MATERIAL_TITLE: 'No external materials assigned yet',
  NO_DATA_PROJECT_MATERIAL_DESCRIPTION:
    'The materials for your mentoring programme will be displayed here',
  GOOGLE_PDF_VIEWER_URL: 'http://docs.google.com/gview?embedded=true&url=',
  HTTPS: 'https://',
  HTTP: 'http://',
  OPENING_ANGULAR: '<',
  CLOSING_ANGULAR: '>',
  OPENING_BRACKET: '(',
  CLOSING_BRACKET: ')',
  OR: '|',
  UNABLE_TO_OPEN_URL: 'Unable to open url',
  UNABLE_TO_UPLOAD: 'You cannot send the files due to low internet connection.',
  UNABLE_TO_PLAY_VIDEO:
    'You cannot play this video due to low internet connection.',
  OFFLINE: 'You are offline',
  TEXT: 'text',
  LINK: 'link',
  BRIGHTSIDE_ASSETS_URL: 'https://brightside-assets.s3-eu-west-1.amazonaws.com',
  APP_UPDATE_MESSAGE:
    'A new version of application is available, please update the app to use new features',
  ACCESSIBILITY: {
    BRIGHTSIDE_LOGO: {
      accessibilityLabel: 'Brightside Online Mentoring Logo',
      accessibilityRole: 'image',
    },
    HAMBURGER_MENU: {
      accessibilityLabel: 'Hamburger menu',
      accessibilityRole: 'button',
    },
  },
  LETS_GET_STARTED: "LET'S GET STARTED",
  HEADING_TEXT_LETS_GET_STARTED:
    'Before you can get started with your mentoring conversation, you first need to choose the best mentor for you!\n',
  ABOUT_YOURSELF: 'Tell us about yourself',
  HEADING_ABOUT_YOURSELF:
    'Please fill in some information about yourself so that we can show you the most compatible mentors available.',
  CHOOSE_YOUR_MENTOR: 'CHOOSE YOUR MENTOR',
  HEADING_CHOOSE_YOUR_MENTOR:
    "Chose your mentor match based on what's important to you and start your mentoring conversation.",
  SHORT_PROFILE:
    'Please create a short profile about yourself. Tell us about your career, hobbies and interests.',
  COMPLETE_YOUR_PROFILE: 'Complete your profile',
  COMPLETE_YOUR_PROFILE_HEADING:
    'Mentor profiles provide an introduction for mentees, so that they can find the right mentor to support them.',
  START_YOUR_JOURNEY: 'Start your journey',
  START_YOUR_JOURNEY_HEADING:
    "Once your profile is approved, you're ready to be matched to your mentee!",
  USER_ARCHIVED: 'You have been archived',
  ARCHIVED_PROJECT: 'Your project has been archived.',
  MENTOR_TOP_UP:
    "All the mentors on this project have already been snapped up! We'll allocate more amazing mentors very soon and notify you when you can try again!\n",
};
