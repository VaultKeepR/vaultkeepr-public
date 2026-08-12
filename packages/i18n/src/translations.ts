export type Locale = "en" | "fr";

export interface Translations {
  common: {
    save: string;
    cancel: string;
    loading: string;
    sync: string;
    unlock: string;
    lock: string;
    wallet: string;
    connect: string;
    disconnect: string;
    back: string;
    view: string;
    see: string;
    hide: string;
    details: string;
    error: string;
    errorOccurred: string;
    success: string;
    copy: string;
    copied: string;
    close: string;
    mainNav: string;
    apply: string;
    clear: string;
    import: string;
    export: string;
    search: string;
    add: string;
    more: string;
    ok: string;
    newEntry: string;
    masterPassword: string;
    password: string;
    confirmPassword: string;
    passwordStrength: string;
    weak: string;
    medium: string;
    strong: string;
    generate: string;
    restore: string;
    configure: string;
    walletCaps: string;
    next: string;
    chooseFile: string;
    delete: string;
    edit: string;
    deleteConfirm: string;
    noName: string;
    all: string;
    demoUser: string;
    demoCard: string;
    demoLogin: string;
    demoNote: string;
    hour: string;
    minute: string;
    backupTitle: string;
    demoPasskey: string;
    yearShort: string;
    monthShort: string;
    revoke: string;
    saved: string;
    tapToCopy: string;
    premium: string;
    or: string;
    optional: string;
    recommended: string;
    ipfsSync: string;
    featurePillNoAccount: string;
    featurePillEncryption: string;
    featurePillMultiDevice: string;
    create: string;
    importTitle: string;
    importDesc: string;
    importBtn: string;
    importSuccess: string;
    importSuccessDesc: string;
    importNoEntries: string;
    importFormats: string;
    importModalTitle: string;
    importModalDesc: string;
    importModalBiometric: string;
    importModalPassword: string;
    importVaultDetected: string;
    importEnterOldPassword: string;
    show: string;
    filter: string;
    retry: string;
    hideDetails: string;
    showDetails: string;
  };
  settings: {
    title: string;
    menuAccess: string;
    menuSync: string;
    menuAccount: string;
    menuAdvanced: string;
    language: string;
    theme: string;
    themeDark: string;
    themeLight: string;
    themeSystem: string;
    lockVault: string;
    sessionDuration: string;
    persistSession: string;
    persistSessionDesc: string;
    premium: string;
    sessionDurationClose: string;
    sessionDuration1h: string;
    sessionDuration24h: string;
    sessionDuration7d: string;
    sessionDuration30d: string;
    syncFrequency: string;
    syncFrequencyDesc: string;
    syncFrequencyOff: string;
    syncFrequency1m: string;
    syncFrequency5m: string;
    syncFrequency15m: string;
    syncFrequencyManual: string;
    appearance: string;
    privacy: string;
    privacyDesc: string;
    tosAnalysis: string;
    tosAnalysisDesc: string;
    sessionDescription: string;
    unlockDelegationDuration: string;
    unlockDelegationDescription: string;
    unlockDelegation24h: string;
    unlockDelegation7d: string;
    unlockDelegation14d: string;
    unlockDelegation30d: string;
    unlockDelegationStatusNone: string;
    unlockDelegationStatusExpired: string;
    unlockDelegationStatusUntil: string;
    unlockDelegationStatusOtherWallet: string;
    clearCache: string;
    clearCacheInProgress: string;
    about: string;
    resetVault: string;
    resetVaultDescription: string;
    resetVaultConfirm: string;
    resetVaultInProgress: string;
    dangerZone: string;
    deduplicateVault: string;
    deduplicateDescription: string;
    deduplicateConfirm: string;
    deduplicateResult: string;
    unpinIpfs: string;
    unpinIpfsDescription: string;
    unpinIpfsConfirm: string;
    deleteAllData: string;
    deleteAllDataDescription: string;
    deleteAllDataStep1Title: string;
    deleteAllDataStep1Hint: string;
    deleteAllDataConfirmPhraseFr: string;
    deleteAllDataConfirmPhraseEn: string;
    deleteAllDataStep2Title: string;
    deleteAllDataEmailLabel: string;
    deleteAllDataEmailPlaceholder: string;
    deleteAllDataSendCode: string;
    deleteAllDataCodeSent: string;
    deleteAllDataCodePlaceholder: string;
    deleteAllDataVerify: string;
    deleteAllDataDeleting: string;
    deleteAllDataSuccess: string;
    deleteAllDataError: string;
    deleteAllDataNoWallet: string;
    importLabel: string;
    importDescription: string;
    importFormats: string;
    importPgpHint: string;
    importVaultPasswordHint: string;
    exportLabel: string;
    exportDescription: string;
    exportPlain: string;
    exportEncrypted: string;
    exportPgp: string;
    exportUnlockHint: string;
    exportEncryptedHint: string;
    exportPgpHint: string;
    exportSaved: string;
    emptyFile: string;
    pgpSupport: string;
    pgpSupportBody: string;
    tabGeneral: string;
    tabAccount: string;
    tabSync: string;
    tabData: string;
    tabExportImport: string;
    tabPremium: string;
    tabAlias: string;
    tabWallet: string;
    syncIpfsHint: string;
    syncIpfsSuccess: string;
    syncIpfsErrWallet: string;
    syncIpfsErrNoRemote: string;
    syncIpfsErrPassword: string;
    syncIpfsErrSignature: string;
    syncIpfsErrDecrypt: string;
    syncIpfsErrGeneric: string;
    syncIpfsBusy: string;
    ipfsGatewayLabel: string;
    ipfsGatewayPlaceholder: string;
    ipfsGatewayHint: string;
    ipfsGatewaySaved: string;
    clipboardAutoClear: string;
    clipboardAutoClearHint: string;
    connectedDevices: string;
    deviceLastSeen: string;
    revokeDevice: string;
    revokeDeviceTitle: string;
    revokeDeviceBody: string;
    currentCid: string;
    noCid: string;
    copyCid: string;
    ipfsSync: string;
    ipfsGatewayCustom: string;
    ipfsGatewayCustomHint: string;
    saveGateway: string;
    revokeDeviceConfirm: string;
    clearPremiumConfirm: string;
    device: string;
    licenseStatus: string;
    linkedViaWallet: string;
    currentDevice: string;
    unlinkDevice: string;
    activationError: string;
    manageSubscription: string;
    clearCacheConfirm: string;
    syncSuccess: string;
    alreadyLatest: string;
    saveError: string;
    autofillSetup: string;
    autofillSetupDescription: string;
    autofillSetupAction: string;
    requireBiometricAutofill: string;
    requireBiometricAutofillDesc: string;
    lockedTitle: string;
    lockedBody: string;
    goPasswordlessTitle: string;
    goPasswordlessDesc: string;
  };
  sync: {
    synchronize: string;
    saved: string;
    savedLocally: string;
    connectWallet: string;
    settings: string;
    premium: string;
    premiumActive: string;
    subscribe: string;
    security: string;
    unlockWithFaceId: string;
    unlockWithTouchId: string;
    passkeyUnlock: string;
    passkeyCreate: string;
    biometricEnabled: string;
    biometricDisabled: string;
    wallet: string;
    disconnect: string;
    openWallet: string;
    copyUri: string;
    syncSection: string;
    autosave: string;
    activateAutosaveIpfs: string;
    autosaveIpfsActive: string;
    syncing: string;
    syncedOnIpfs: string;
    synced: string;
    syncError: string;
    syncCrossDevice: string;
    reset: string;
    resetDescription: string;
    clearCache: string;
    clearCacheConfirm: string;
    clearCacheDone: string;
    clearCacheDoneTitle: string;
    loadFromIpfs: string;
    saveToIpfs: string;
    importJson: string;
    hideImport: string;
    pasteJson: string;
    decryptAndOpen: string;
    openVault: string;
    entriesCount: string;
    waitingSignature: string;
    downloading: string;
    deriving: string;
    uploading: string;
    publishing: string;
    inProgress: string;
    syncExpired: string;
    saving: string;
    savedBanner: string;
    saveErrorBanner: string;
    delegationNone: string;
    delegationLoading: string;
    delegationActive: string;
    delegationExpiredLabel: string;
    delegationExpireIn: string;
    delegationRenew: string;
    delegationSetup: string;
    delegationHint: string;
    syncSuccess: string;
    alreadyLatest: string;
    saveError: string;
    scannerBtn: string;
    scannerTitle: string;
    scannerConnectedDevices: string;
    scannerAccessDenied: string;
    scannerFormatError: string;
    scannerSuccessTitle: string;
    scannerSuccessDesc: string;
    scannerBiometricError: string;
    scannerPasswordReadError: string;
    scannerTimeout: string;
    scannerExtBtn: string;
    scannerExtOverlayTitle: string;
    scannerExtOverlayDesc: string;
    scannerExtFormatError: string;
    walletConnectDeprecated: string;
    vaultUpdatedFromIpfs: string;
    transferFailed: string;
    receiveFailed: string;
  };
  tabs: {
    vault: string;
    totp: string;
    generator: string;
    sync: string;
    settings: string;
    tools: string;
    share: string;
    secureDocs: string;
    cloud: string;
  };
  unlock: {
    title: string;
    subtitle: string;
    createVaultTitle: string;
    unlockVault: string;
    loadFromIpfs: string;
    loadFromIpfsSubtitle: string;
    unlock: string;
    createVault: string;
    newVault: string;
    alreadyHaveVault: string;
    enterPassword: string;
    passwordsMismatch: string;
    minPasswordLength: string;
    biometricUnlock: string;
    biometricPromptTitle: string;
    biometricSyncPromptTitle: string;
    biometricHint: string;
    nfcChipRecognizedNoSecret: string;
    cameraPermissionRequired: string;
    authRequired: string;
    noVaultStored: string;
    invalidVaultFormat: string;
    noCachedKey: string;
    iapSyncFailed: string;
    iapNetworkError: string;
    noLicenseLinked: string;
    discoverApp: string;
    nfcUnlockBtn: string;
    nfcConnectBtn: string;
    nfcPromptScan: string;
    nfcFormatInvalid: string;
    nfcPromptAuth: string;
    nfcFallback: string;
    nfcAuthFailedTitle: string;
    nfcAuthFailedDesc: string;
    nfcNotConfiguredTitle: string;
    nfcNotConfiguredDesc: string;
    nfcDeviceSecretMissing: string;
    nfcPinMissing: string;
    nfcUpgradeTitle: string;
    nfcUpgradeDesc: string;
    nfcReadError: string;
    passkeyNotSupported: string;
    passkeyError: string;
    noBiometricKey: string;
    bioEnrollTitle: string;
    bioEnrollDesc: string;
    passkeyUnlock: string;
    passkeyCreate: string;
    passkeyPrfNotSupported: string;
    passkeyReady: string;
    passkeyGenerated: string;
    biometricChecking: string;
    authCancelled: string;
    biometricSuccess: string;
    encryptingInProgress: string;
    passKeyMigrationTitle: string;
    passKeyMigrationDesc: string;
    passKeyMigrationOldPw: string;
    passKeyMigrationConfirm: string;
    passKeyMigrationSuccess: string;
  };
  postSyncPrf: {
    title: string;
    body: string;
    unsupported: string;
    enable: string;
    skipFirst: string;
    skipWarningTitle: string;
    skipWarningBody: string;
    skipConfirm: string;
  };
  locked: {
    title: string;
    subtitle: string;
    wallet: string;
    unlock: string;
    unlockButton: string;
    localBackupAvailable: string;
    restoreLocalBackup: string;
    restore: string;
    preparing: string;
    scanWithWallet: string;
    copyUri: string;
    signInWallet: string;
    signInWalletIpfs: string;
    enterPassword: string;
    loadingFromIpfs: string;
    noVaultFound: string;
    checkingIpfs: string;
    extensionInactive: string;
    restoring: string;
    createVaultTitle: string;
    createVaultHint: string;
    createVaultButton: string;
    createVaultWarning: string;
    createVaultChoose: string;
    passkeyCreateSubtitle: string;
    passkeyCreateSubtitlePin: string;
    masterPasswordLocal: string;
    masterPasswordDesc: string;
    passwordMismatch: string;
    passwordTooShort: string;
    existingVaultPrompt: string;
    openFromIpfs: string;
    passwordStrengthLabel: string;
    passwordStrengthWeak: string;
    passwordStrengthMedium: string;
    passwordStrengthStrong: string;
    overwriteWarningTitle: string;
    overwriteWarningBody: string;
    exportAndOverwrite: string;
    overwriteOnly: string;
    cancel: string;
    active: string;
    on: string;
    off: string;
    thisDevice: string;
    version: string;
    revoke: string;
    revokeConfirm: string;
    revokeSuccess: string;
    connectedDevices: string;
    unlinkDevice: string;
    unlinkConfirm: string;
    manageSubscription: string;
    loggedWith: string;
    security: string;
    passwordHealth: string;
    passwordHealthDesc: string;
    analyze: string;
    breachScanner: string;
    breachScannerDesc: string;
    scan: string;
    autoFill: string;
    autoFillDesc: string;
    clipboardTimeout: string;
    clipboardTimeoutDesc: string;
    clearCacheConfirm: string;
    syncSuccess: string;
    tabSync: string;
    tabGeneral: string;
    tabAccount: string;
    tabData: string;
    tabExportImport: string;
    syncIpfsHint: string;
    syncIpfsBusy: string;
    ipfsGatewayLabel: string;
    ipfsGatewayPlaceholder: string;
    alreadyLatest: string;
    saveError: string;
    deviceSyncRemovedHint: string;
  };
  header: {
    searchPlaceholder: string;
    settings: string;
    newEntry: string;
    newLogin: string;
    newIdentity: string;
    identities: string;
    logins: string;
    saveToIpfs: string;
    syncIpfs: string;
    syncWebApp: string;
    sync: string;
    export: string;
    lockVault: string;
    exportJson: string;
    exportEncrypted: string;
    import: string;
    premium: string;
    premiumAccount: string;
    premiumAccountPlaceholder: string;
    link: string;
    unlink: string;
    licenseKey: string;
    activateKey: string;
    subscribeAnnual: string;
    activeUntil: string;
    saveToIpfsPlaceholder: string;
    saveToIpfsPlaceholderConnected: string;
    saving: string;
    savedOnIpfs: string;
    uploadFailed: string;
    enterPassword: string;
    signInWallet: string;
    signFailed: string;
    signOverlayHint: string;
    openMetaMask: string;
  };
  vault: {
    unlockTitle: string;
    unlockDescription: string;
    vaultSaved: string;
    setMasterPassword: string;
    continue: string;
    newVault: string;
    signatureRequired: string;
    unlockRequired: string;
    loading: string;
    saveToIpfs: string;
    syncIpfs: string;
    syncWebApp: string;
    add: string;
    save: string;
    saveInProgress: string;
    sync: string;
    syncing: string;
    importBitwarden: string;
    importCsv: string;
    importPgp: string;
    exportJson: string;
    exportEncrypted: string;
    import: string;
    newEntry: string;
    group: string;
    site: string;
    username: string;
    password: string;
    totp: string;
    notes: string;
    notesMasked: string;
    saveEntry: string;
    savedSuccess: string;
    savedLocally: string;
    savedLocallyShort: string;
    savedViaIpfs: string;
    noResult: string;
    unnamedEntry: string;
    noEntries: string;
    addFirstEntry: string;
    searchPlaceholder: string;
    newVersionAvailable: string;
    reload: string;
    later: string;
    close: string;
    syncPasswordPrompt: string;
    syncPasswordDescription: string;
    autosaveReunlockHint: string;
    backToLanding: string;
    tags: string;
    navigation: string;
    favorites: string;
    allEntries: string;
    categories: string;
    settings: string;
    noEntrySelected: string;
    search: string;
    securityTools: string;
    generator: string;
    securityHealth: string;
    breachScanner: string;
    newEntryShort: string;
    groups: string;
    group_identifiants: string;
    group_cartes: string;
    group_notes: string;
    group_identites: string;
    group_seeds: string;
    entryAdded: string;
    entryUpdated: string;
    tagsPlaceholder: string;
    favoriteLabel: string;
    favoriteYes: string;
    favoriteNo: string;
    subscribe: string;
    reveal: string;
    totpCode: string;
    premiumRequiredTotp: string;
    sort: string;
    sortLastModified: string;
    sortLastAdded: string;
    sortBy: string;
    backupExportSuccess: string;
    exportFilename: string;
    sortAz: string;
    sortZa: string;
  };
  entry: {
    username: string;
    url: string;
    notes: string;
    totp: string;
    unknownTitle: string;
    noEntriesFound: string;
    type: {
      identity: string;
      password: string;
      unknown: string;
    };
  };
  card: {
    number: string;
    expiry: string;
    cvv: string;
    holder: string;
    holderPlaceholder: string;
    defaultName: string;
  };
  note: {
    title: string;
    titlePlaceholder: string;
    content: string;
    contentPlaceholder: string;
    defaultName: string;
  };
  identity: {
    firstName: string;
    lastName: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    birthDate: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    defaultName: string;
    noIdentityFound: string;
    createFirstIdentityHint: string;
  };
  favorite: {
    toggle: string;
  };
  addForm: {
    title: string;
    group: string;
    site: string;
    username: string;
    password: string;
    totp: string;
    totpSecretPlaceholder: string;
    totpEditPlaceholder: string;
    totpPremiumOnly: string;
    notes: string;
    notesPlaceholder: string;
    notesMasked: string;
    cardNumber: string;
    cardNumberPlaceholder: string;
    expiry: string;
    expiryPlaceholder: string;
    cvv: string;
    cvvPlaceholder: string;
    cardholder: string;
    cardholderPlaceholder: string;
    cardTitle: string;
    cardTitlePlaceholder: string;
    noteTitle: string;
    noteTitlePlaceholder: string;
    content: string;
    contentPlaceholder: string;
    save: string;
    customGroupLabel: string;
    newGroup: string;
    groupNamePlaceholder: string;
    groupNameRequired: string;
    groupExists: string;
    fillAtLeastOne: string;
    invalidCardNumber: string;
    invalidExpiry: string;
    noteContentRequired: string;
    noteContentEmpty: string;
    groupIdentifiants: string;
    groupCartes: string;
    groupNotes: string;
    groupIdentites: string;
    groupSeeds: string;
    favorite: string;
    masked: string;
    usernamePlaceholder: string;
    sitePlaceholder: string;
    addUri: string;
    uriPlaceholder: string;
    matchType: string;
    matchExact: string;
    matchHostname: string;
    matchBaseDomain: string;
    matchNever: string;
    removeUri: string;
  };
  editForm: {
    title: string;
  };
  identityForm: {
    title: string;
    newTitle: string;
    firstName: string;
    lastName: string;
    civility: string;
    email: string;
    phone: string;
    birthDate: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    save: string;
    saveError: string;
    civilityMr: string;
    civilityMrs: string;
    civilityNone: string;
  };
  detailPane: {
    selectEntry: string;
    identity: string;
    credentials: string;
    card: string;
    note: string;
    site: string;
    siteUrl: string;
    fillForm: string;
    fill: string;
    filled: string;
    filling: string;
    openSite: string;
    edit: string;
    delete: string;
    deleteIdentity: string;
    deleteCard: string;
    deleteNote: string;
    noTotp: string;
    addTotpHelp: string;
    deleteLogin: string;
    copyUsername: string;
    copyPassword: string;
    copyTotp: string;
    copySite: string;
    noName: string;
    noTitle: string;
    premiumRequired: string;
    totpInPremium: string;
    number: string;
    expiration: string;
    cardholder: string;
    code: string;
    content: string;
    passwordHistory: string;
    previousPasswords: string;
    changedOn: string;
    noPasswordHistory: string;
  };
  seed: {
    walletName: string;
    walletNamePlaceholder: string;
    derivationPath: string;
    derivedAddress: string;
    bip39Phrase: string;
    wordsCount: string;
    invalidPhrase: string;
    appPasswordPlaceholder: string;
    bip39Alert: string;
    deleteConfirm: string;
    cryptoSeedTitle: string;
  };
  listPane: {
    noCredentialsForSite: string;
    viewAll: string;
    favorites: string;
    noResult: string;
    thisSite: string;
    thisSiteOnly: string;
    sortDefault: string;
    sortMostUsed: string;
    sortRecentlyUsed: string;
    sortLastSaved: string;
    customGroup: string;
    allGroups: string;
    selectEntry: string;
  };
  generator: {
    desc: string;
    length: string;
    chars: string;
    options: string;
    uppercase: string;
    lowercase: string;
    numbers: string;
    symbols: string;
    generate: string;
    result: string;
    char: string;
    charsPlural: string;
    title: string;
    subtitle: string;
    history: string;
    clearHistory: string;
    clearHistoryConfirm: string;
    noHistory: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    strength: string;
    veryStrong: string;
    strong: string;
    fair: string;
    weak: string;
    veryWeak: string;
    generateNew: string;
    medium: string;
    passphraseMode: string;
    passwordMode: string;
    wordCount: string;
    separator: string;
    capitalize: string;
    passphrase: string;
  };
  securityHealthDetails: {
    title: string;
    subtitle: string;
    score: string;
    vaultStatus: string;
    statusExcellent: string;
    statusGood: string;
    statusWarning: string;
    statusCritical: string;
    critical: string;
    weak: string;
    reused: string;
    strong: string;
    fair: string;
    all: string;
    noIssues: string;
    noData: string;
    noDataHint: string;
    issueEmpty: string;
    issueTooShort: string;
    issueDiversity: string;
    issueNoDigitSymbol: string;
    issueRepeated: string;
    issueCommon: string;
    issuePattern: string;
    issueReused: string;
    issueOld: string;
    issueExpired: string;
    expired: string;
  };
  autosave: {
    savedToast: string;
    edit: string;
  };
  breachScanner: {
    title: string;
    subtitle: string;
    dataSecurity: string;
    hibpNotice: string;
    hibpNoticeNoPassword: string;
    startScan: string;
    scanning: string;
    stopScan: string;
    scanComplete: string;
    scanError: string;
    breachedCount: string;
    noBreaches: string;
    changeImmediately: string;
    resultsTitle: string;
    foundBreaches: string;
    safeEntries: string;
    startHint: string;
    retry: string;
    emailSection: string;
    emailSectionDesc: string;
    emailPlaceholder: string;
    emailAdd: string;
    emailNoemails: string;
    emailScan: string;
    emailScanning: string;
    emailConsentTitle: string;
    emailConsentBody: string;
    emailConsentAgree: string;
    emailBreachedCount: string;
    emailNoBreaches: string;
    emailRemove: string;
  };
  tools: {
    servicesTitle: string;
    servicesSubtitle: string;
    shareHint: string;
    docsHint: string;
  };
  totp: {
    title: string;
    previous: string;
    next: string;
    lockedText: string;
    viewPremium: string;
    noCodes: string;
    addHint: string;
    premiumDesc: string;
    showAll: string;
    showMatching: string;
  };
  premium: {
    back: string;
    title: string;
    badgeTitle: string;
    badgeSub: string;
    activeUntil: string;
    status: string;
    connectedDevices: string;
    lastSeen: string;
    thisDevice: string;
    yourLicenseKey: string;
    licenseCrossPlatformDesc: string;
    revokeDeviceTitle: string;
    revokeDeviceConfirm: string;
    syncLicense: string;
    subscribe: string;
    subscribePrice: string;
    subscribePriceMonthly: string;
    planYearly: string;
    planMonthly: string;
    bestValue: string;
    productUnavailable: string;
    restorePurchases: string;
    licenseTitle: string;
    licenseDesc: string;
    licensePlaceholder: string;
    activateLicense: string;
    planPremiumName: string;
    planProName: string;
    planUltimateName: string;
    planPremiumDesc: string;
    planProDesc: string;
    planUltimateDesc: string;
    planPremiumPrice: string;
    planPremiumPriceYearly: string;
    planProPrice: string;
    planProPriceYearly: string;
    planUltimatePrice: string;
    planUltimatePriceYearly: string;
    choosePlan: string;
    cloudStorage: string;
    perFile: string;
    allPremiumFeatures: string;
    unlimitedStorage: string;
    termsOfUse: string;
    privacyPolicy: string;
    legalFooter: string;

    successTitle: string;
    successDesc: string;
    successContinue: string;
    googlePlayActive: string;
    googlePlayActiveDesc: string;
    appStoreActive: string;
    appStoreActiveDesc: string;
  };
  errorBoundary: {
    title: string;
  };
  mainTabs: {
    newVersionTitle: string;
    newVersionMessage: string;
    newVersionMessageAlt: string;
    later: string;
    sync: string;
  };
  syncAlerts: {
    connectWallet: string;
    remoteNewer: string;
    remoteOlder: string;
    enterPassword: string;
    faceIdRequired: string;
    noRemoteVault: string;
    noRecord: string;
    timeout: string;
    signatureTimeout: string;
    vaultUnlockedWalletRequired: string;
    faceIdOrPassword: string;
    pasteJson: string;
    enterMasterPassword: string;
    enterPgpPassphrase: string;
    chooseMasterPassword: string;
    formatUnknown: string;
    encryptedExportDetected: string;
    entriesCountChoosePassword: string;
    faceIdOrPasswordBelow: string;
    uriCopied: string;
    syncSuccess: string;



    syncConflictTitle: string;
    syncConflictBody: string;



    syncConflictPullRemote: string;
    syncConflictDismiss: string;
    vaultLoaded: string;
    saveSuccess: string;
    saveSuccessWebapp: string;
    sessionExpired: string;
    reconnectWallet: string;
    sessionExpiredInvalid: string;
    openWalletRetry: string;
    biometricEnabledTitle: string;
    biometricDisabledTitle: string;
    biometricEnabled: string;
    biometricDisabled: string;
    autosaveActivated: string;
  };
  fragmented: {
    title: string;
    setupTitle: string;
    setupDesc: string;
    recoveryTitle: string;
    recoveryDesc: string;
    recoveryIdLabel: string;
    generateRecoveryId: string;
    saveRecoveryId: string;
    devicePartSaved: string;
    partsUploaded: string;
    contactPartExport: string;
    scanContactPart: string;
    pasteContactPart: string;
    recoverVault: string;
    needThreeParts: string;
    activate3of5: string;
    placeholderGenerateOrPaste: string;
    copyRecoveryId: string;
    recoveryIdPlaceholder: string;
    passwordPlaceholder: string;
    contactPartLabel: string;
    contactPartPlaceholder: string;
    errorRecoveryIdRequired: string;
    errorPasswordRequired: string;
    errorRecoveryIdInvalid: string;
    errorContactPartInvalid: string;
    errorPartsInsufficient: string;
    errorPersistence: string;
    recoverLink: string;
    storeOnChain: string;
    storeOnChainDone: string;
    storeOnChainConfigHint: string;
    viewTransaction: string;
    connectWalletToStore: string;
    errorWcReconnectBase: string;
    storeOnChainQrHint: string;
    storeOnChainSecondPrompt: string;
    storeOnChainTimeout: string;
    storeOnChainNoUri: string;
    errorFragmentWcApproveBase: string;
    tooltipRecoveryIdSetup: string;
    tooltipRecoveryIdAfterSetup: string;
    tooltipContactPart: string;
    tooltipStoreOnChain: string;
    tooltipActivate3of5: string;
    tooltipRecoveryIdRecover: string;
    tooltipMasterPasswordRecover: string;
    tooltipContactPartRecover: string;
    recoverySuccessBody: string;
    recoveryIdCopiedAlert: string;
    contactPartCopiedAlert: string;
    onChainDeprecated: string;
  };
  nfcSetup: {
    title: string;
    notSupportedTitle: string;
    notSupportedDesc: string;
    pinDesc: string;
    pinPlaceholder: string;
    btnContinue: string;
    writeDesc: string;
    btnWrite: string;
    errorTitle: string;
    errorPinShort: string;
    errorNoPassword: string;
    errorWriteFailed: string;
    successTitle: string;
    successDesc: string;
    promptFaceId: string;
    promptFallback: string;
    promptNfcScan: string;
    errorAnonymousSignature: string;
  };
  vaultAlerts: {
    authCancelled: string;
    saveError: string;
    autoSaveError: string;
  };
  walletAlerts: {
    connectToSign: string;
    walletNotDetectedSave: string;
    walletNotDetectedSync: string;
    connectWalletSync: string;
  };
  premiumAlerts: {
    iapOnlyNative: string;
    noRestore: string;
    purchaseError: string;
    needWalletForLicense: string;
    licenseApiUnavailable: string;
    licenseEmpty: string;
    licenseInvalid: string;
    licenseActivated: string;
    keyCopied: string;
  };
  listScreen: {
    all: string;
    login: string;
    cards: string;
    notes: string;
    identities: string;
    searchPlaceholder: string;
    entry: string;
    entries: string;
    sortAz: string;
    sortZa: string;
    noResult: string;
    emptyHint: string;
    quickSearchTitle: string;
    noResults: string;
    noRecentEntries: string;
    recent: string;
  };
  detailScreen: {
    back: string;
    edit: string;
    delete: string;
    deleteShort: string;
    deleteConfirm: string;
    show: string;
    hide: string;
    credentials: string;
    civility: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    cardNumber: string;
    expiration: string;
    cardholder: string;
    content: string;
    site: string;
    username: string;
    premiumRequired: string;
    subscribe: string;
    noName: string;
    card: string;
  };
  addEntryScreen: {
    cancel: string;
    edit: string;
    newEntry: string;
    save: string;
    site: string;
    sitePlaceholder: string;
    username: string;
    usernamePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    totp: string;
    totpPlaceholder: string;
    totpPremiumRequired: string;
    notes: string;
    notesPlaceholder: string;
    tags: string;
    tagsPlaceholder: string;
    cardNumber: string;
    cardNumberPlaceholder: string;
    expiry: string;
    expiryPlaceholder: string;
    cvv: string;
    cvvPlaceholder: string;
    cardholder: string;
    cardholderPlaceholder: string;
    cardTitle: string;
    cardTitlePlaceholder: string;
    noteTitle: string;
    noteTitlePlaceholder: string;
    noteContent: string;
    noteContentPlaceholder: string;
    maskedByDefault: string;
    civility: string;
    firstName: string;
    lastName: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    birthDate: string;
    birthDatePlaceholder: string;
    address: string;
    addressPlaceholder: string;
    postalCode: string;
    postalCodePlaceholder: string;
    city: string;
    cityPlaceholder: string;
    country: string;
    countryPlaceholder: string;
    login: string;
    card: string;
    note: string;
    identity: string;
    favorite: string;
    favoriteYes: string;
    favoriteNo: string;
    newGroup: string;
    groupNamePlaceholder: string;
  };
  settingsPage: {
    back: string;
    loading: string;
    premiumDescription: string;
    premiumFeaturesTitle: string;
    activateKeyHint: string;
    keyActivated: string;
    buyLicense: string;
    connectWalletPremium: string;
    syncCidDescription: string;
    connectWallet: string;
    aboutDescription: string;
    langEn: string;
    langFr: string;
    import: string;
    importDescription: string;
    importFormats: string;
    importSuccess: string;
    importPgpHint: string;
    importVaultPasswordHint: string;
    export: string;
    exportDescription: string;
    exportPlain: string;
    exportEncrypted: string;
    exportPgp: string;
    exportUnlockHint: string;
    exportEncryptedHint: string;
    exportPgpHint: string;
    exportSaved: string;
    premiumLegacyHint: string;
    manageOnWeb: string;
    migrateHint: string;
    migrateButton: string;
  };
  walletConnect: {
    wallet: string;
    disconnect: string;
    scanWithWallet: string;
    copyUri: string;
    connect: string;
    connecting: string;
    openExtensions: string;
    lastVaultCid: string;
    viewOnIpfs: string;
    noVaultCid: string;
  };
  autosaveDelegation: {
    autosaveIpfs: string;
    syncDays: string;
    autosaveActive: string;
    renew: string;
    activate: string;
    connectAndActivate: string;
    orViaApp: string;
  };
  autosaveQr: {
    title: string;
    preparing: string;
    scanWithWallet: string;
    copyUri: string;
    activated: string;
    close: string;
    cancel: string;
    openWalletRetry: string;
    signatureRejected: string;
    unknownError: string;
    walletSign: string;
    walletSignHint: string;
  };

  alias: {
    title: string;
    description: string;
    destinationEmail: string;
    destinationPlaceholder: string;
    create: string;
    mainAddress: string;
    empty: string;
    enable: string;
    disable: string;
    inactive: string;
    premiumRequired: string;
    walletRequired: string;
    deleteConfirm: string;
  };
  vaultContext: {
    saveToIpfsConfirm: string;
    masterPasswordPrompt: string;
    vaultSavedIpfs: string;
    saveFailed: string;
    openAppUnlock: string;
    deleteError: string;
    saveError: string;
    noLoginForm: string;
    fillErrorPrefix: string;
    reloadRetry: string;
    exportEncryptedPrompt: string;
    exportDownloaded: string;
    importEncryptedPrompt: string;
    importPgpPrompt: string;
    entriesImported: string;
    unknownFormat: string;
    noEntriesFound: string;
    entriesImportedOpenApp: string;
    importAdded: string;
    importSkipped: string;
    importEnriched: string;
    savedIpfs: string;
    savedLocally: string;
    remoteNewerForce: string;
    fillDemo: string;
    fillIdentityDemo: string;
    zeroDuplicates: string;
    licenseKeyCopied: string;
    deviceRevoked: string;
    cidUnpinned: string;
  };
  passwordGenerator: {
    placeholder: string;
    generate: string;
    length: string;
    uppercase: string;
    lowercase: string;
    numbers: string;
    symbols: string;
    char: string;
    chars: string;
  };

  pwnedPassword: {
    found: string;
    checkFailed: string;
    attribution: string;
  };

  productGuide: {
    webWalletCalloutTitle: string;
    webWalletCalloutBody: string;
    tooltipWhyWallet: string;
    tooltipLocalFirst: string;
    tooltipIpfsEncrypted: string;
    hintLinkWallet: string;
    hintLinkLocal: string;
    hintLinkIpfs: string;
    importBlockTitle: string;
    importBlockBody: string;
    tooltipImportFormats: string;
    importStep1: string;
    importStep2: string;
    importStep3: string;
    importStep4: string;
    importPrivacyTip: string;
    tooltipImportFileButton: string;
    autofillTitle: string;
    autofillBody: string;
    tooltipAutofillFields: string;
    tooltipAutofillTotp: string;
    autofillQualityNote: string;
    hintAutofillFields: string;
    hintAutofillTotp: string;
    tooltipExtTabIpfs: string;
    tooltipExtTabLocalVault: string;
    extLockedAutofillHint: string;
  };
  downloadPage: {
    title: string;
    subtitle: string;
    extensionTitle: string;
    extensionDesc: string;
    extensionCta: string;
    iosTitle: string;
    iosDesc: string;
    iosCta: string;
    webTitle: string;
    webDesc: string;
    webCta: string;
    privacyTitle: string;
    privacyDesc: string;
    recommended: string;
    backHome: string;
  };
  landing: {
    shopBanner: string;
    navHow: string;
    navFeatures: string;
    navTerms: string;
    navPrivacy: string;
    chromeExtension: string;
    firefoxAddon: string;
    appStore: string;
    navPremium: string;
    navDownload: string;
    navTurboTest: string;
    navOpenApp: string;
    heroSubtitle: string;
    heroCta: string;
    trustBadge: string;
    trustTitle: string;
    trustSubtitle: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    howTitle: string;
    howSubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    featuresTitle: string;
    featuresSubtitle: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
    feat4Title: string;
    feat4Desc: string;
    feat5Title: string;
    feat5Desc: string;
    feat6Title: string;
    feat6Desc: string;
    feat7Title: string;
    feat7Desc: string;
    feat8Title: string;
    feat8Desc: string;
    feat9Title: string;
    feat9Desc: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    techTitle: string;
    techSubtitle: string;
    tech1Name: string;
    tech1Desc: string;
    tech2Name: string;
    tech2Desc: string;
    tech3Name: string;
    tech3Desc: string;
    tech4Name: string;
    tech4Desc: string;
    privacyBadgeLabel: string;
    privacyBadgeTitle: string;
    privacyBadgeSubtitle: string;
    privacyBadge1Title: string;
    privacyBadge1Desc: string;
    privacyBadge2Title: string;
    privacyBadge2Desc: string;
    privacyBadge3Title: string;
    privacyBadge3Desc: string;
    footerTerms: string;
    footerPrivacy: string;
    footerDocs: string;
    footerSecurity: string;
    footerChangelog: string;
    footerGithub: string;
    footerSocialGithubAria: string;
    footerSocialXAria: string;
    footerContact: string;
    contactTitle: string;
    contactIntro: string;
    contactName: string;
    contactEmail: string;
    contactMessage: string;
    contactSubmit: string;
    contactSending: string;
    contactSuccess: string;
    contactError: string;
    contactClose: string;
    contactRequired: string;
    contactInvalidEmail: string;
    contactResendError: string;
    contactInboxError: string;
    contactConfigError: string;
    footerCopyright: string;
    loading: string;
    comingSoonTitle: string;
    comingSoonSubtitle: string;
    comingSoonCountdownTitle: string;
    comingSoonUnitDays: string;
    comingSoonUnitHours: string;
    comingSoonUnitMinutes: string;
    comingSoonUnitSeconds: string;
    comingSoonLive: string;
    comingSoonEmailPlaceholder: string;
    comingSoonEmailCta: string;
    comingSoonEmailSuccess: string;
    comingSoonFeat1Title: string;
    comingSoonFeat1Desc: string;
    comingSoonFeat2Title: string;
    comingSoonFeat2Desc: string;
    comingSoonFeat3Title: string;
    comingSoonFeat3Desc: string;
    comingSoonFeat4Title: string;
    comingSoonFeat4Desc: string;
    heroTagIpfs: string;
    heroTagWallet: string;
    heroTagE2e: string;
    langSwitchToEn: string;
    langSwitchToFr: string;
    feat10Title: string;
    feat10Desc: string;
    feat11Title: string;
    feat11Desc: string;
    feat12Title: string;
    feat12Desc: string;
    feat13Title: string;
    feat13Desc: string;
    feat14Title: string;
    feat14Desc: string;
    feat15Title: string;
    feat15Desc: string;
    feat16Title: string;
    feat16Desc: string;
    feat17Title: string;
    feat17Desc: string;
    feat18Title: string;
    feat18Desc: string;
    feat19Title: string;
    feat19Desc: string;
    playStore: string;
    heroTagCloud: string;
    heroTagAndroid: string;
    tech5Name: string;
    tech5Desc: string;
    heroH1Prefix: string;
    heroH1Main: string;
    heroH1Suffix: string;
    heroCtaDetailed: string;
    heroReassurance: string;
    heroSecondaryCta: string;
    heroGitHubStars: string;
    trustSignalNoEmail: string;
    trustSignalOpenSource: string;
    trustSignalAuditable: string;
    trustSignalFreeForever: string;
    miniPricingTitle: string;
    miniPricingSubtitle: string;
    miniPricingFreeTitle: string;
    miniPricingFreePrice: string;
    miniPricingFreePeriod: string;
    miniPricingFreeCta: string;
    miniPricingFreeFeat1: string;
    miniPricingFreeFeat2: string;
    miniPricingFreeFeat3: string;
    miniPricingFreeFeat4: string;
    miniPricingFreeFeat5: string;
    miniPricingPremiumTitle: string;
    miniPricingPremiumPrice: string;
    miniPricingPremiumPeriod: string;
    miniPricingPremiumCta: string;
    miniPricingPremiumFeat1: string;
    miniPricingPremiumFeat2: string;
    miniPricingPremiumFeat3: string;
    miniPricingPremiumFeat4: string;
    miniPricingPremiumFeat5: string;
    miniPricingPremiumFeat6: string;
    miniPricingCompareAll: string;
    stickyNavFeatures: string;
    stickyNavHowItWorks: string;
    stickyNavSecurity: string;
    stickyNavCompare: string;
    stickyNavPricing: string;
    stickyNavFaq: string;
    comparePreviewTitle: string;
    comparePreviewSubtitle: string;
    bannerCloseAria: string;
  };
  vaultAppEntry: {
    subtitle: string;
    backToMarketing: string;
  };
  premiumPage: {
    title: string;
    subtitle: string;
    featureCol: string;
    freeCol: string;
    premiumCol: string;
    ultimateCol: string;
    proCol: string;
    featPrice: string;
    priceFree: string;
    pricePremium: string;
    priceUltimate: string;
    pricePro: string;
    billingLabel: string;
    billingYearly: string;
    billingMonthly: string;
    featLogins: string;
    featCards: string;
    featIdentities: string;
    featIpfs: string;
    featExtension: string;
    featIos: string;
    featAndroid: string;
    featExport: string;
    featBreachScanner: string;
    featQuickShare: string;
    featTosAi: string;
    featNoEmail: string;
    featTotp: string;
    featAlias: string;
    featEarlyAccess: string;
    featDocuments: string;
    featDocumentsFree: string;
    featDocumentsPremium: string;
    featDocumentsPro: string;
    featDocumentsUltimate: string;
    featCloudQuota: string;
    featCloudQuotaFree: string;
    featCloudQuotaPremium: string;
    featCloudQuotaPro: string;
    featCloudQuotaUltimate: string;
    featCloudFileSize: string;
    featCloudFileSizeFree: string;
    featCloudFileSizePremium: string;
    featCloudFileSizePro: string;
    featCloudFileSizeUltimate: string;
    featStorage: string;
    featFragmented: string;
    featSupport: string;
    successTitle: string;
    successMessage: string;
    successSpam: string;
    activateKey: string;
    canceled: string;
    retry: string;
    licenceTitle: string;
    licenceDesc: string;
    emailLabel: string;
    emailPlaceholder: string;
    buyBtn: string;
    getStarted: string;
    redirecting: string;
    paymentNote: string;
    backHome: string;
    emailRequired: string;
    paymentError: string;
    serverError: string;
    networkError: string;
    proAddon: string;
    proAddonDesc: string;
    ultimateBundle: string;
    ultimateBundleDesc: string;
    ultimateSaving: string;
    planPremium: string;
    planPremiumPrice: string;
    planPremiumPriceYearly: string;
    planPro: string;
    planProPrice: string;
    planProPriceYearly: string;
    planProRequires: string;
    planUltimate: string;
    planUltimatePrice: string;
    planUltimatePriceYearly: string;
    planUltimateIncludes: string;
    cryptoTitle: string;
    cryptoSubtitle: string;
    cryptoLifetime: string;
    cryptoAnnual: string;
    cryptoMonthly: string;
    cryptoDiscount: string;
    cryptoLifetimeExclusive: string;
  };
  onboarding: {
    welcomeTitle: string;
    welcomeBody: string;
    vaultTitle: string;
    vaultBody: string;
    vaultLocal: string;
    vaultLocalDesc: string;
    vaultIpfs: string;
    vaultIpfsDesc: string;
    saveTitle: string;
    saveBody: string;
    skip: string;
    next: string;
    done: string;
    replaySettings: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    start: string;
    connectCta: string;
    doNotShowAgain: string;
    lockTabsTitle: string;
    lockTabsDesc: string;
    lockPasskeyTitle: string;
    lockPasskeyDesc: string;
    lockPasswordTitle: string;
    lockPasswordDesc: string;
    lockOption1Title: string;
    lockOption1Desc: string;
    lockOption2Title: string;
    lockOption2Desc: string;
    lockNewVaultTitle: string;
    lockNewVaultDesc: string;
    landingCreateBtn: string;
    landingUnlockBtn: string;
    landingSubtitle: string;
    landingDeviceSync: string;
    loadingVault: string;
    loadingVaultDesc: string;
    welcomeBack: string;
    welcomeBackDesc: string;
    firstTime: string;
    advancedOptions: string;
    hideAdvanced: string;
    methodsDivider: string;
    noVaultYet: string;
    noVaultYetDesc: string;
    createVaultIntro: string;
    tabBarTitle: string;
    tabBarDesc: string;
    searchTitle: string;
    searchDesc: string;
    primerTitle: string;
    primerSubtitle: string;
    primerSlide1Title: string;
    primerSlide1Desc: string;
    primerSlide2Title: string;
    primerSlide2Desc: string;
    primerSlide3Title: string;
    primerSlide3Desc: string;
    primerQuizTitle: string;
    primerQ1: string;
    primerQ1a1: string;
    primerQ1a2: string;
    primerQ1Wrong: string;
    primerQ2: string;
    primerQ2a1: string;
    primerQ2a2: string;
    primerQ2Wrong: string;
    primerQ3: string;
    primerQ3a1: string;
    primerQ3a2: string;
    primerQ3Wrong: string;
    primerQ4: string;
    primerQ4a1: string;
    primerQ4a2: string;
    primerQ4Wrong: string;
    primerAllCorrect: string;
    primerContinue: string;
    primerIUnderstand: string;
  };
  saveBanner: {
    loginFormDetected: string;
    saveCredentials: string;
    fillFormFirst: string;
    cannotCollect: string;
  };
  passwordFeedback: {
    tooShort: string;
    addUppercase: string;
    addLowercase: string;
    addNumbers: string;
    addSpecialChars: string;
    avoidRepeated: string;
    useMultipleTypes: string;
    veryWeak: string;
  };
  passwordHealth: {
    noEntries: string;
    noEntriesHint: string;
    vaultHealth: string;
    scoreGood: string;
    scoreFair: string;
    scoreWeak: string;
    scoreCritical: string;
    statCritical: string;
    statWeak: string;
    statFair: string;
    statStrong: string;
    statReused: string;
    filterAll: string;
    filterReused: string;
    showAll: string;
    issueEmpty: string;
    issueTooShort: string;
    issueNoCharTypes: string;
    issueNoDigitSymbol: string;
    issueRepeated: string;
    issueCommon: string;
    issueSingleChar: string;
    issueSequence: string;
    issueReused: string;
    issueOld: string;
    statExpired: string;
    filterExpired: string;
    statTwoFactorMissing: string;
    filterTwoFactorMissing: string;
    statUnsecureWebsites: string;
    filterUnsecureWebsites: string;
    issueTwoFactorMissing: string;
    issueUnsecureUrl: string;
  };
  commandPalette: {
    searchPlaceholder: string;
    noResults: string;
    open: string;
    navigateWith: string;
    selectWith: string;
    results: string;
    bankCard: string;
    noteLabel: string;
    untitled: string;
    noResultsFound: string;
    typeToSearch: string;
    resultsCount: string;
    resultsCountPlural: string;
    copyPassword: string;
    copyUsername: string;
    openUrl: string;
    shortcutNavigate: string;
    shortcutOpen: string;
    shortcutClose: string;
  };
  syncBanner: {
    unlockExpired: string;
    expired: string;
    expiringSoon: string;
    renew: string;
  };
  socialProof: {
    sectionBadge: string;
    sectionTitle: string;
    sectionSubtitle: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    stat4Value: string;
    stat4Label: string;
    techTitle: string;
    testimonialTitle: string;
    testimonial1Text: string;
    testimonial1Author: string;
    testimonial1Role: string;
    testimonial2Text: string;
    testimonial2Author: string;
    testimonial2Role: string;
    testimonial3Text: string;
    testimonial3Author: string;
    testimonial3Role: string;
  };
  passkey: {
    folder: string;
    savePromptTitle: string;
    savePromptBody: string;
    saveButton: string;
    useNative: string;
    authPromptTitle: string;
    authPromptBody: string;
    noPasskeys: string;
    counter: string;
    credentialId: string;
    rpId: string;
    created: string;
    lastUsed: string;
    deleteConfirm: string;
    vaultLocked: string;
    providerActive: string;
    providerDescription: string;
    noEnrollment: string;
    unlockFailed: string;
    biometricFailed: string;
    fingerprint: string;
    touchId: string;
    faceId: string;
    windowsHello: string;
    securityKey: string;
    notSupported: string;
    enrollmentCancelled: string;
    cancelledByUser: string;
    enrollmentFailed: string;
    label: string;
    syncPrompt: string;
    notFoundOrCancelled: string;
    creating: string;
    createdToast: string;
    passkeyCreateSuccess: string;
    passkeyPrfError: string;
    goPasswordlessTitle: string;
    goPasswordlessDesc: string;
  };
  backupPassword: {
    title: string;
    description: string;
    recommended: string;
    warning: string;
    set: string;
    change: string;
    remove: string;
    setSuccess: string;
    removed: string;
    recover: string;
    incorrect: string;
    notConfigured: string;
    unlockHint: string;
  };
  reUnlock: {
    title: string;
    body: string;
    biometric: string;
    usePassword: string;
    later: string;
    unlock: string;
    passwordPlaceholder: string;
  };
  securityBadge: {
    title: string;
  };
  dapps: {
    title: string;
    settingsDesc: string;
    dappsTracked: string;
    totalVisits: string;
    noVisits: string;
    noVisitsHint: string;
    visits: string;
    refresh: string;
    revokeApprovals: string;
    clearHistory: string;
    confirmClear: string;
    connectWallet: string;
    connectWalletHint: string;
    scanning: string;
    scanningHint: string;
    retry: string;
    noApprovals: string;
    noApprovalsHint: string;
    rescan: string;
    unlimitedApprovals: string;
    allSafe: string;
    totalApprovals: string;
    revokeAdvice: string;
    revoke: string;
  };
  secureDocuments: {
    title: string;
    subtitle: string;
    addDocument: string;
    limitReached: string;
    typeCni: string;
    typePassport: string;
    typePermit: string;
    typeRib: string;
    typeInsurance: string;
    typeOther: string;
    reveal: string;
    revealed: string;
    revealHint: string;
    autoHide: string;
    encrypting: string;
    fragmenting: string;
    saved: string;
    deleteConfirm: string;
    deleteWarning: string;
    deleted: string;
    ocrProcessing: string;
    ocrName: string;
    ocrNumber: string;
    ocrExpiry: string;
    premiumRequired: string;
    captureCamera: string;
    captureCameraSub: string;
    captureImport: string;
    captureFiles: string;
    chooseType: string;
    chooseTypeDesc: string;
    emptyState: string;
    emptyStateHint: string;
    fileTooLarge: string;
    saveError: string;
    revealImage: string;
    view: string;
    metadata: string;
    size: string;
    added: string;
    chunks: string;
    backToTypes: string;
    labelPlaceholder: string;
    documentName: string;
    manualInfo: string;
    saveSecure: string;
    premiumFeature: string;
    premiumDesc: string;
    documentCount: string;
    downloading: string;
    noInternet: string;
    maxSizeHint: string;
    formatPrompt: string;
    formatNew: string;
    formatNewSub: string;
    formatOld: string;
    formatOldSub: string;
    captureVersoHint: string;
    mrzTargetHint: string;
    nfcScanFirst: string;
    nfcScanLoading: string;
    nfcScanVerify: string;
    ocrBirthDateReq: string;
    ocrPhotoExtracted: string;
    encryptingNfcPhoto: string;
    uploadNfcPhoto: string;
    nfcSuccessTitle: string;
    nfcSuccessMsg: string;
    nfcErrorTitle: string;
    nfcErrorMsgNoChip: string;
    nfcErrorMsgKeep: string;
    decrypting: string;
  };
  cloud: {
    title: string;
    emptyTitle: string;
    emptySub: string;
    unlockRequired: string;
    errorTooLarge: string;
    sending: string;
    uploadingProgress: string;
    uploadError: string;
    fileDetail: string;
    share: string;
    shareFile: string;
    security: string;
    modePrivate: string;
    modePrivateSub: string;
    modePublic: string;
    modePublicSub: string;
    folders: string;
    createFolder: string;
    createFolderHint: string;
    allFiles: string;
    upload: string;
    download: string;
    downloading: string;
    downloadingProgress: string;
    viewDocument: string;
    shareSecureLink: string;
    fileNotFound: string;
    decrypting: string;
    deleteConfirm: string;
    sortBy: string;
    sortByDate: string;
    sortByName: string;
    sortBySize: string;
    files: string;
    photos: string;
    documents: string;
    empty: string;
    emptyStateHint: string;
    originalSize: string;
    addedAt: string;
    description: string;
    uploading: string;
    zeroKnowledge: string;
    encryptingData: string;
    ipfsTransfer: string;
    expiration: string;
    privacy: string;
    private: string;
    public: string;
    fileName: string;
    fileSize: string;
    premiumRequired: string;
  };
  share: {
    title: string;
    createTitle: string;
    pinLabel: string;
    pinHint: string;
    ttl1h: string;
    ttl24h: string;
    ttl7d: string;
    ttlEphemeral: string;
    ttlStandard: string;
    ttlLongTerm: string;
    maxViews: string;
    unlimited: string;
    includeTotp: string;
    generating: string;
    linkReady: string;
    copyLink: string;
    copyPin: string;
    shareVia: string;
    receiveTitle: string;
    receiveEnterPin: string;
    receiveDecrypting: string;
    receiveExpired: string;
    receiveMaxViewsReached: string;
    receiveInvalidPin: string;
    receiveAddToVault: string;
    receiveDownload: string;
    receiveAutoClearing: string;
    fileLabel: string;
    fileDragDrop: string;
    fileMaxSize: string;
    noteLabel: string;
    credentialsLabel: string;
    zkBadge: string;
    zkHint: string;
    pinChannelHint: string;
    successTitle: string;
    successSub: string;
    expiration: string;
    maxViewsLabel: string;
    generateLink: string;
    shareViaNative: string;
    paramError: string;
    decryptContent: string;
    hasPinQuestion: string;
    hasPinBody: string;
    decryptedSuccess: string;
    decryptedZkSub: string;
    decryptedZkHint: string;
    autoDestructed: string;
    unsupportedType: string;
    viewCountLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    quickShareTitle: string;
    contentType: string;
    typeLink: string;
    typeNote: string;
    typeFile: string;
    generate: string;
    premiumOnly: string;
    premiumOnlyDesc: string;
    linkRequired: string;
    noteRequired: string;
    fileRequired: string;
    linkTitlePlaceholder: string;
    noteTitlePlaceholder: string;
    noteContentPlaceholder: string;
    fileDropHint: string;
    createAnother: string;
    messageSender: string;
    openLink: string;
    fieldUrl: string;
    fieldUsername: string;
    fieldPassword: string;
    fieldTotp: string;
    fieldFileName: string;
    receiveInvalidLink: string;
    receiveFileNotFound: string;
    receiveUnsupportedType: string;
    receiveLoadError: string;
    receiveDownloadError: string;
    receiveLoadingPublic: string;
    receiveDownloadingIpfs: string;
    receiveZkFooter: string;
    fileTooLarge: string;
  };
  pair: {
    title: string;
    receive: string;
    send: string;
    sendTitle: string;
    sendScanInstructions: string;
    sendSuccess: string;
    receiveFromPhone: string;
    sendToDevice: string;
    scanInstructions: string;
    waitingForDevice: string;
    expiresIn: string;
    confirmSend: string;
    confirmSendDesc: string;
    sendVault: string;
    transferring: string;
    success: string;
    expired: string;
    retry: string;
    error: string;
    openQr: string;
    scanHint: string;
    sendInstructions: string;
    receiveTitle: string;
    receiveScanInstructions: string;
    accepting: string;
    waitingForVault: string;
    importing: string;
    encrypting: string;
  };
  security: {
    passwordHealth: string;
    passwordHealthDesc: string;
    breachScanner: string;
    breachScannerDesc: string;
  };
  legacy: {
    title: string;
    description: string;
    setup: string;
    setupDescription: string;
    status: string;
    beneficiaries: string;
    addBeneficiary: string;
    removeBeneficiary: string;
    beneficiaryAddress: string;
    beneficiaryLabel: string;
    delay: string;
    delayDescription: string;
    gracePeriod: string;
    gracePeriodDescription: string;
    heartbeat: string;
    lastHeartbeat: string;
    sendHeartbeat: string;
    daysRemaining: string;
    expired: string;
    claimable: string;
    claimed: string;
    active: string;
    inactive: string;
    revoke: string;
    revokeConfirm: string;
    revokeDescription: string;
    qrScan: string;
    pasteAddress: string;
    inviteLink: string;
    inviteLinkCopied: string;
    incomingTitle: string;
    incomingDescription: string;
    claimButton: string;
    claimSuccess: string;
    premiumRequired: string;
    premiumRequiredDescription: string;
    days: string;
    activate: string;
    activateConfirm: string;
    errorTooManyBeneficiaries: string;
    errorInvalidDelay: string;
    errorAlreadyActive: string;
    errorNotClaimable: string;
    errorNotBeneficiary: string;
    errorAlreadyClaimed: string;
    statusGreen: string;
    statusYellow: string;
    statusRed: string;
    contactEmail: string;
    contactTelegram: string;
    contactAddress: string;
    contactRequired: string;
    statusPending: string;
    statusConfirmed: string;
    inviteSent: string;
    inviteEmailSubject: string;
    telegramBotRequired: string;
    errorSmartAccountNotReady: string;
    errorActivation: string;
    errorRevocation: string;
    heartbeatCooldown: string;
  };







  contentScript: {
    card: {
      title: string;
      empty: string;
    };
    passkey: {
      title: string;
      subtitle: string;
      empty: string;
      use: string;
    };
    changePassword: {
      title: string;
      current: string;
      generate: string;
    };
    generator: {
      title: string;
      generatedPassword: string;
      length: string;
      regenerate: string;
      fill: string;
      copy: string;
      copied: string;
      show: string;
      hide: string;
      uppercase: string;
      lowercase: string;
      numbers: string;
      symbols: string;
      strength: {
        weak: string;
        medium: string;
        strong: string;
      };
      noFocusedField: string;
    };
    identity: {
      title: string;
      analyzing: string;
      empty: string;
    };
    locked: {
      title: string;
      body: string;
    };
    login: {
      title: string;
      generate: string;
      noMatch: string;
      noName: string;
      update: string;
      alias: string;
      aliasPremium: string;
      aliasLocked: string;
      aliasError: string;
      aliasAddLicenseKey: string;
      search: string;
    };
    phishing: {
      title: string;
      understood: string;
    };
    savePrompt: {
      newTitle: string;
      save: string;
      generate: string;
      update: string;
      updateTitle: string;
      username: string;
      password: string;
      chooseEntry: string;
      neverForSite: string;
    };
    signup: {
      title: string;
      generate: string;
      alias: string;
      aliasPremium: string;
      aliasLocked: string;
      aliasError: string;
      aliasAddLicenseKey: string;
    };
    toast: {
      generated: string;
      saved: string;
      updated: string;
      filled: string;
      saveError: string;
    };
    tos: {
      title: string;
      loading: string;
      error: string;
      resultHeader: string;
      dataSharingSafe: string;
      dataSharingDanger: string;
      deletionSafe: string;
      deletionWarning: string;
      riskLabel: string;
      basicModeHint: string;
      closeClause: string;
      trackingSafe: string;
      trackingDanger: string;
      arbitrSafe: string;
      arbitrDanger: string;
      unilateralSafe: string;
      unilateralDanger: string;
      liabilitySafe: string;
      liabilityDanger: string;
    };
    totp: {
      title: string;
      fill: string;
      copy: string;
      noCode: string;
      hintBody: string;
    };
  };

  enterprise: {
    espacePersonal: string;
    espaceOrg: string;
    leaveOrgMode: string;
    leaveOrgModeTitle: string;
    sharedVaults: string;
    noVaults: string;
    entries: string;
    entryCount: string;
    refresh: string;
    loading: string;
    joinOrg: {
      title: string;
      subtitle: string;
      emailLabel: string;
      submit: string;
      submitting: string;
      successTitle: string;
      successBody: string;
      successBody2: string;
      errorEmail: string;
      errorSign: string;
      noIdentity: string;
      createVaultBtn: string;
      zkNote: string;
    };
    team: {
      title: string;
      noTasks: string;
      execute: string;
      executing: string;
      done: string;
      invite: string;
      rekey: string;
      resign: string;
      consoleLink: string;
      zkNote: string;
    };
  };
}

export const en: Translations = {
  common: {
    save: "Save",
    cancel: "Cancel",
    loading: "Loading",
    sync: "Sync",
    unlock: "Unlock",
    lock: "Lock",
    wallet: "Wallet",
    walletCaps: "WALLET",
    connect: "Connect",
    disconnect: "Disconnect",
    back: "Back",
    view: "View",
    see: "See",
    hide: "Hide",
    details: "Details",
    error: "Error",
    errorOccurred: "Something went wrong. Please try again.",
    success: "Success",
    copy: "Copy",
    copied: "Copied!",
    close: "Close",
    mainNav: "Main navigation",
    apply: "Apply",
    clear: "Clear",
    import: "Import",
    export: "Export",
    search: "Search",
    add: "Add",
    more: "More",
    newEntry: "New entry",
    masterPassword: "Master password",
    password: "Password",
    confirmPassword: "Confirm password",
    passwordStrength: "Strength",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    generate: "Generate",
    restore: "Restore",
    configure: "Configure",
    next: "Next",
    chooseFile: "Choose file",
    delete: "Delete",
    edit: "Edit",
    deleteConfirm: "Are you sure you want to delete this?",
    noName: "Unnamed",
    all: "All",
    demoUser: "Demo User",
    demoCard: "Demo Card",
    demoLogin: "Demo Login",
    demoNote: "Demo Note",
    demoPasskey: "Demo Passkey",
    hour: "h",
    minute: "min",
    backupTitle: "VaultKeepR Backup",
    yearShort: "yr",
    monthShort: "mo",
    revoke: "Revoke",
    saved: "Saved",
    tapToCopy: "Tap to copy",
    ok: "OK",
    premium: "Premium",
    or: "OR",
    optional: "Optional",
    recommended: "Recommended",
    ipfsSync: "IPFS Sync",
    featurePillNoAccount: "No account needed",
    featurePillEncryption: "Military-grade encryption",
    featurePillMultiDevice: "Multi-device sync",
    create: "Create",
    importTitle: "Import from another manager",
    importDesc: "Bitwarden, Chrome, 1Password, LastPass, ProtonPass, Dashlane...",
    importBtn: "Select file (.csv / .json)",
    importSuccess: "Import successful",
    importSuccessDesc: "{count} entries imported into your vault.",
    importNoEntries: "No entries found in this file.",
    importFormats: "Supports CSV, JSON, 1Password PIF, encrypted PGP",
    importModalTitle: "{count} entries detected",
    importModalDesc: "Choose how to protect your new vault:",
    importModalBiometric: "Create with biometrics",
    importModalPassword: "Create with password",
    importVaultDetected: "VaultKeepR backup detected",
    importEnterOldPassword: "Enter the master password used for this backup:",
    show: "Show",
    filter: "Filter",
    retry: "Retry",
    hideDetails: "Hide details",
    showDetails: "Show details"
  },
  settings: {
    title: "Settings",
    menuAccess: "Access & Security",
    menuSync: "Sync & Data",
    menuAccount: "Account & Premium",
    menuAdvanced: "Advanced & Tools",
    language: "Language",
    theme: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    themeSystem: "System",
    lockVault: "Lock the Vault",
    sessionDuration: "Session duration",
    persistSession: "Keep session across background restarts",
    persistSessionDesc: "Mirror your master password to Extension session storage so identity / account abstraction keep working when the background restarts. Disable for stricter in-memory-only security.",
    premium: "Premium",
    sessionDurationClose: "Until tab close",
    sessionDuration1h: "1 hour",
    sessionDuration24h: "24 hours",
    sessionDuration7d: "7 days",
    sessionDuration30d: "30 days",
    syncFrequency: "Background sync frequency",
    syncFrequencyDesc: "How often the extension checks for cross-device changes. Off/manual disables background contact.",
    syncFrequencyOff: "Off",
    syncFrequency1m: "Every 1 minute",
    syncFrequency5m: "Every 5 minutes",
    syncFrequency15m: "Every 15 minutes",
    syncFrequencyManual: "Manual only",
    appearance: "Appearance",
    privacy: "Privacy",
    privacyDesc: "Control data exposure and consent",
    tosAnalysis: "Terms of Service analysis",
    tosAnalysisDesc: "Analyze Terms of Service / privacy pages on sites you visit. Runs locally on your device. Off by default.",
    sessionDescription: "How long you stay unlocked after page reload. Session is always cleared when tab closes.",
    unlockDelegationDuration: "Wallet signature cache",
    unlockDelegationDescription: "How long the unlock signature is kept. No re-signing needed until expiry.",
    unlockDelegation24h: "24 hours",
    unlockDelegation7d: "7 days",
    unlockDelegation14d: "14 days",
    unlockDelegation30d: "30 days",
    unlockDelegationStatusNone:
    "No unlock signature cached yet — your wallet may be prompted for the next v3 encrypt/sync action.",
    unlockDelegationStatusExpired: "Unlock signature cache has expired — the wallet may ask you to sign again.",
    unlockDelegationStatusUntil: "Unlock signature valid until",
    unlockDelegationStatusOtherWallet:
    "A signature is cached for a different wallet address — connect the matching wallet or unlock again from IPFS.",
    clearCache: "Clear CID cache",
    clearCacheInProgress: "In progress…",
    about: "About",
    resetVault: "Reset vault",
    resetVaultDescription: "Deletes all local vault data (backup, session, delegations). You will need to unlock again or load from IPFS.",
    resetVaultConfirm: "All local vault data will be permanently deleted. Continue?",
    resetVaultInProgress: "Resetting…",
    dangerZone: "Danger Zone",
    deduplicateVault: "Remove duplicates",
    deduplicateDescription: "Scans all entries and removes exact duplicates. Original entries are preserved.",
    deduplicateConfirm: "Remove all duplicate entries from the vault?",
    deduplicateResult: "{count} duplicate(s) removed.",
    unpinIpfs: "Unpin from IPFS",
    unpinIpfsDescription: "Removes the vault CID from the IPFS registry. Your local vault is not affected.",
    unpinIpfsConfirm: "Unpin the vault from IPFS? Your local data will remain intact.",
    deleteAllData: "Delete all data",
    deleteAllDataDescription: "Permanently deletes all local data AND your encrypted vault from IPFS. This action is irreversible.",
    deleteAllDataStep1Title: "Type the confirmation phrase",
    deleteAllDataStep1Hint: "Type the following phrase exactly to continue:",
    deleteAllDataConfirmPhraseFr: "Je confirme vouloir supprimer toutes mes données",
    deleteAllDataConfirmPhraseEn: "I confirm I want to delete all my data",
    deleteAllDataStep2Title: "Email verification",
    deleteAllDataEmailLabel: "Verification email",
    deleteAllDataEmailPlaceholder: "your@email.com",
    deleteAllDataSendCode: "Send code",
    deleteAllDataCodeSent: "Code sent to {email}",
    deleteAllDataCodePlaceholder: "6-digit code",
    deleteAllDataVerify: "Delete everything",
    deleteAllDataDeleting: "Deleting…",
    deleteAllDataSuccess: "All data has been permanently deleted.",
    deleteAllDataError: "An error occurred. Please try again.",
    deleteAllDataNoWallet: "Connect your wallet first.",
    importLabel: "Import",
    importDescription:
    "Import your vault from another app. Supported: Bitwarden JSON, Proton Pass JSON, VaultKeepR, 1Password 1PIF, CSV (many vendors), or PGP. Not supported: encrypted Bitwarden export, 1Password .1pux.",
    importFormats:
    "Bitwarden JSON, Proton Pass JSON, VaultKeepR JSON, CSV (LastPass, Chrome, 1Password, …), 1PIF (1Password), PGP",
    importPgpHint: "PGP passphrase to decrypt the file:",
    importVaultPasswordHint: "Vault Keeper master password:",
    exportLabel: "Export",
    exportDescription: "Export your vault. Unlock the vault first, then return here to export.",
    exportPlain: "JSON (plain)",
    exportEncrypted: "JSON (encrypted)",
    exportPgp: "PGP",
    exportUnlockHint: "Unlock the vault first, then return to Settings to export.",
    exportEncryptedHint: "Master password to encrypt the export:",
    exportPgpHint: "PGP passphrase to encrypt the export:",
    exportSaved: "File saved successfully.",
    emptyFile: "Empty file.",
    pgpSupport: "PGP Support",
    pgpSupportBody: "PGP import is handled via separate flow. Please use the Desktop app for complex PGP imports.",
    tabGeneral: "General",
    tabAccount: "Account",
    tabSync: "Sync",
    tabData: "Data & Advanced",
    tabExportImport: "Export / Import",
    tabPremium: "Premium",
    tabAlias: "Alias",
    tabWallet: "Wallet",
    syncIpfsHint:
    "Pull the latest encrypted vault from IPFS (wallet connected, master password in session, unlock signature or delegation). Use after changes on another device. « Save to IPFS » uploads from this device.",
    syncIpfsSuccess: "Vault updated from IPFS.",
    syncIpfsErrWallet: "Connect your wallet (Settings → Wallet) to sync from IPFS.",
    syncIpfsErrNoRemote: "No vault CID found for this wallet on the server.",
    syncIpfsErrPassword: "Unlock the extension first (master password in session).",
    syncIpfsErrSignature: "Wallet signature or unlock delegation required — unlock from IPFS once or accept the sign request.",
    syncIpfsErrDecrypt: "Could not decrypt the remote vault (wrong password or corrupted data).",
    syncIpfsErrGeneric: "Sync from IPFS failed. Try again or check the service worker console.",
    syncIpfsBusy: "Syncing…",
    ipfsGatewayLabel: "Custom IPFS gateway",
    ipfsGatewayPlaceholder: "https://ipfs.example.com/ipfs",
    ipfsGatewayHint: "Optional. Use your own IPFS gateway to read your vault instead of public gateways (ipfs.io, dweb.link). Leave empty to use the defaults.",
    ipfsGatewaySaved: "Gateway saved ✓",
    clipboardAutoClear: "Auto-clear clipboard",
    clipboardAutoClearHint: "Clears clipboard 30s after copy",
    connectedDevices: "Connected devices ({count}/5)",
    deviceLastSeen: "Last seen on",
    revokeDevice: "Revoke",
    revokeDeviceTitle: "Revoke device",
    revokeDeviceBody: "This device will no longer be able to access the vault.",
    currentCid: "Current CID",
    noCid: "No CID stored",
    copyCid: "Copy CID",
    ipfsSync: "IPFS Sync",
    ipfsGatewayCustom: "Custom IPFS gateway",
    ipfsGatewayCustomHint: "Leave empty to use default gateways.",
    saveGateway: "Save",
    revokeDeviceConfirm: "Revoke this device?",
    clearPremiumConfirm: "Clear Premium status from this device?",
    device: "Device",
    licenseStatus: "License Status",
    linkedViaWallet: "Linked via Wallet",
    currentDevice: "Current",
    manageSubscription: "Manage Subscription",
    unlinkDevice: "Unlink Device",
    activationError: "Activation error",
    clearCacheConfirm: "Clear sync cache for this wallet?",
    syncSuccess: "Sync successful!",
    alreadyLatest: "Vault is already up to date",
    saveError: "Save error",
    autofillSetup: "Autofill Setup",
    autofillSetupDescription: "Enable VaultKeepR as the system-wide autofill service on your Android device.",
    autofillSetupAction: "Open Autofill Settings",
    requireBiometricAutofill: "Require biometric for autofill",
    requireBiometricAutofillDesc: "Ask for Face ID / Touch ID before filling credentials, instead of silent autofill.",
    lockedTitle: "Vault locked",
    lockedBody: "Unlock your vault to access settings.",
    goPasswordlessTitle: "Go Passwordless",
    goPasswordlessDesc: "Secure your account with a Passkey (Account Abstraction) and say goodbye to passwords."
  },
  sync: {
    synchronize: "Synchronize",
    saved: "Saved",
    savedLocally: "Saved locally",
    connectWallet: "Connect wallet",
    settings: "Settings",
    premium: "Premium",
    premiumActive: "Active subscription",
    subscribe: "Subscribe",
    security: "Security",
    unlockWithFaceId: "Unlock with Face ID",
    unlockWithTouchId: "Unlock with Touch ID",
    biometricEnabled: "Unlock vault without password.",
    biometricDisabled: "Master password required.",
    wallet: "Wallet",
    disconnect: "Disconnect",
    openWallet: "Open wallet",
    copyUri: "Copy URI",
    syncSection: "Synchronization",
    autosave: "Automatic save",
    activateAutosaveIpfs: "Activate Vault Sync",
    autosaveIpfsActive: "Vault Sync active",
    syncing: "Saving…",
    syncedOnIpfs: "Saved on IPFS",
    synced: "Synced",
    passkeyUnlock: "Unlock with Biometrics",
    passkeyCreate: "Create with Biometrics",
    syncError: "Error",
    syncCrossDevice: "Cross-device sync active",
    reset: "Reset",
    resetDescription: "Clears local cache (vault, sync, biometrics). After reset, you can recover vault from IPFS if needed.",
    clearCache: "Clear cache",
    clearCacheConfirm: "All local data will be deleted. You can recover vault from IPFS. Continue?",
    clearCacheDone: "App has been reset.",
    clearCacheDoneTitle: "Cache cleared",
    loadFromIpfs: "Load from IPFS",
    saveToIpfs: "Save",
    importJson: "Import JSON",
    hideImport: "Hide import",
    pasteJson: "Paste JSON here",
    decryptAndOpen: "Decrypt and open",
    openVault: "Open vault",
    entriesCount: "entry(ies)",
    waitingSignature: "Waiting for signature…",
    downloading: "Downloading…",
    deriving: "Deriving key…",
    uploading: "Uploading…",
    publishing: "Publishing…",
    inProgress: "In progress…",
    syncExpired: "Sync expired — reconnect your wallet",
    saving: "Saving…",
    savedBanner: "✓ Saved",
    saveErrorBanner: "Save error",
    delegationNone: "Not configured",
    delegationLoading: "Loading…",
    delegationActive: "✓ Active",
    delegationExpiredLabel: "Expired",
    delegationExpireIn: "Expires in {d}d {h}h",
    delegationRenew: "Renew",
    delegationSetup: "Set up autosave",
    delegationHint: "Autosave requires a wallet signature delegation.",
    syncSuccess: "Sync successful!",
    alreadyLatest: "Vault is already up to date",
    saveError: "Save error",
    scannerBtn: "Scan a sync QR Code",
    scannerTitle: "Sync a device",
    scannerConnectedDevices: "Device Sync",
    scannerAccessDenied: "Camera access denied",
    scannerFormatError: "Unrecognized QR Code (not a vaultkeepr:sync namespace).",
    scannerSuccessTitle: "Connection successful",
    scannerSuccessDesc: "Approve the request on the other device.",
    scannerBiometricError: "Authentication failed or no master password saved.",
    scannerPasswordReadError: "Error reading password.",
    scannerTimeout: "Connection timeout.",
    scannerExtBtn: "Synchronize from another device",
    scannerExtOverlayTitle: "Synchronization",
    scannerExtOverlayDesc: "Scan this QR Code with the VaultKeepR mobile app",
    scannerExtFormatError: "Invalid key format received.",
    walletConnectDeprecated: "WalletConnect is no longer supported. Please use a VaultKeepR QR code.",
    vaultUpdatedFromIpfs: "Vault updated from IPFS.",
    transferFailed: "Transfer failed",
    receiveFailed: "Receive failed"
  },
  tabs: {
    vault: "Vault",
    totp: "2FA",
    generator: "Generator",
    sync: "Sync",
    settings: "Settings",
    tools: "Tools",
    share: "Share",
    secureDocs: "Secure Docs",
    cloud: "Cloud"
  },
  unlock: {
    title: "Unlock your vault",
    subtitle: "Unlock your vault",
    createVaultTitle: "Create your vault",
    unlockVault: "Unlock your vault",
    loadFromIpfs: "Load your vault from IPFS",
    loadFromIpfsSubtitle: "Password, wallet, then load.",
    unlock: "Unlock",
    createVault: "Create vault",
    newVault: "New vault",
    alreadyHaveVault: "I already have a vault on IPFS",
    enterPassword: "Enter your master password.",
    passwordsMismatch: "Passwords do not match.",
    minPasswordLength: "Minimum 8 characters.",
    biometricUnlock: "Unlock with biometric",
    biometricPromptTitle: "Unlock VaultKeepR",
    biometricSyncPromptTitle: "Authentication for sync",
    biometricHint: "Use biometrics to unlock",
    nfcChipRecognizedNoSecret: "Chip recognized (UID: {uid}), but no VaultKeepR secret (NDEF) is present.",
    cameraPermissionRequired: "Camera permission required",
    authRequired: "Authentication required",
    noVaultStored: "No vault stored.",
    invalidVaultFormat: "Invalid vault format.",
    noCachedKey: "No cached key. Unlock with your password first.",
    iapSyncFailed: "IAP Sync Failed",
    iapNetworkError: "IAP Network Error",
    noLicenseLinked: "No license linked",
    discoverApp: "Discover the app",
    nfcUnlockBtn: "Unlock via NFC",
    nfcConnectBtn: "Connect with NFC",
    nfcPromptScan: "Hold your VaultKeepR NFC chip near",
    nfcFormatInvalid: "Invalid NFC format",
    nfcPromptAuth: "Authenticate to use this NFC chip",
    nfcFallback: "Use PIN",
    nfcAuthFailedTitle: "Failed",
    nfcAuthFailedDesc: "Authentication failed. The vault remains locked.",
    nfcNotConfiguredTitle: "Error",
    nfcNotConfiguredDesc: "The scanned chip is not configured for VaultKeepR.",
    nfcDeviceSecretMissing: "No device key found. Please reconfigure the NFC chip from Settings.",
    nfcPinMissing: "No PIN found. Please reconfigure the NFC chip from Settings.",
    nfcUpgradeTitle: "Security Upgrade Required",
    nfcUpgradeDesc: "Your NFC chip uses an outdated format. Please reconfigure it from Settings > NFC Chip for improved security.",
    nfcReadError: "NFC read error",
    passkeyNotSupported: "Passkeys not supported by this browser.",
    passkeyError: "Passkey Error",
    noBiometricKey: "No biometric key found. Create a vault with Biometrics first.",
    bioEnrollTitle: "Enable Biometrics",
    bioEnrollDesc: "Enter your master password once to enable biometric unlock for future sessions.",
    passkeyUnlock: "Unlock with Passkey",
    passkeyCreate: "Create a Passkey (Passwordless)",
    passkeyPrfNotSupported: "PRF not supported. This browser doesn't support Passkey encryption.",
    passkeyReady: "Passkey vault ready!",
    passkeyGenerated: "Passkey created",
    biometricChecking: "Biometric verification...",
    authCancelled: "Authentication cancelled",
    biometricSuccess: "Biometrics validated!",
    encryptingInProgress: "Encrypting...",
    passKeyMigrationTitle: "Migrate vault to Passkey",
    passKeyMigrationDesc: "Your vault is encrypted with your old password. Enter it to re-encrypt with your Passkey (one-time operation).",
    passKeyMigrationOldPw: "Current master password",
    passKeyMigrationConfirm: "Migrate & unlock",
    passKeyMigrationSuccess: "Vault successfully migrated to Passkey!"
  },
  postSyncPrf: {
    title: "Enable Face ID / Touch ID",
    body: "Your vault is passwordless. Enroll a passkey now so you can unlock this device with your fingerprint or face — otherwise you will need your master password every time.",
    unsupported: "Passkeys are not supported in this browser. You will need your master password to unlock.",
    enable: "Enable Face ID / Touch ID",
    skipFirst: "Skip for this session",
    skipWarningTitle: "You will need your master password next time",
    skipWarningBody: "Without a passkey, the only way to unlock this device is your master password. If you forget it, your vault cannot be recovered.",
    skipConfirm: "I understand, skip"
  },
  locked: {
    title: "Vault locked",
    subtitle: "Connect wallet then unlock.",
    wallet: "Wallet",
    unlock: "Unlock",
    unlockButton: "Unlock",
    localBackupAvailable: "Local backup available",
    restoreLocalBackup: "Restore local backup",
    restore: "Restore",
    preparing: "Preparing…",
    scanWithWallet: "Scan with your wallet",
    copyUri: "Copy URI",
    signInWallet: "Sign in your wallet.",
    signInWalletIpfs: "Sign in your wallet (IPFS Recovery)",
    enterPassword: "Enter your password.",
    loadingFromIpfs: "Loading from IPFS…",
    extensionInactive: "Extension inactive. Wake it up.",
    restoring: "Restoring…",
    createVaultTitle: "New vault",
    createVaultHint: "Local vault on this device. Connect your wallet in Settings to sync to IPFS later.",
    createVaultButton: "Create vault",
    createVaultWarning: "This password will encrypt your vault locally. It can never be reset by VaultKeepR.",
    createVaultChoose: "Choose how to protect your vault.",
    passkeyCreateSubtitle: "Face ID / Touch ID / Device PIN",
    passkeyCreateSubtitlePin: "Device PIN",
    masterPasswordLocal: "Encrypted with your password",
    masterPasswordDesc: "Your vault is protected by a password you choose. IPFS sync available.",
    noVaultFound: "No vault found for this address. Please create one.",
    checkingIpfs: "Checking cloud sync (IPFS)…",
    passwordMismatch: "Passwords do not match.",
    passwordTooShort: "Use at least 8 characters.",
    existingVaultPrompt: "Already have a vault on IPFS?",
    openFromIpfs: "From IPFS",
    passwordStrengthLabel: "Master password strength",
    passwordStrengthWeak: "Weak",
    passwordStrengthMedium: "Medium",
    passwordStrengthStrong: "Strong",
    overwriteWarningTitle: "Warning: Existing Vault",
    overwriteWarningBody: "A local vault already exists. Creating a new one will permanently overwrite your current data. Do you want to export an encrypted backup before proceeding?",
    exportAndOverwrite: "Export Backup (.json)",
    overwriteOnly: "Overwrite Anyway",
    cancel: "Cancel",
    active: "Active",
    on: "ON",
    off: "OFF",
    thisDevice: "This Device",
    version: "Version",
    revoke: "Revoke",
    revokeConfirm: "Revoke this device?",
    revokeSuccess: "Device revoked",
    connectedDevices: "Connected Devices",
    unlinkDevice: "Unlink Device",
    unlinkConfirm: "Clear Premium status from this device?",
    manageSubscription: "Manage Subscription",
    loggedWith: "Logged in with:",
    security: "Security",
    passwordHealth: "Password Health",
    passwordHealthDesc: "Analyze strength, reuse & age",
    analyze: "Analyze",
    breachScanner: "Breach Scanner",
    breachScannerDesc: "Check passwords against HIBP",
    scan: "Scan",
    autoFill: "Auto-fill",
    autoFillDesc: "Fill credentials on page load",
    clipboardTimeout: "Clipboard timeout",
    clipboardTimeoutDesc: "Clear after 30 seconds",
    tabSync: "Storage & Sync",
    tabGeneral: "General",
    tabAccount: "Account",
    tabData: "Data & Advanced",
    tabExportImport: "Export / Import",
    syncIpfsHint: "Save & pull from IPFS",
    syncIpfsBusy: "Syncing…",
    ipfsGatewayLabel: "IPFS Gateway",
    ipfsGatewayPlaceholder: "https://ipfs.io",
    clearCacheConfirm: "Clear sync cache for this wallet?",
    syncSuccess: "Sync successful!",
    alreadyLatest: "Vault is already up to date",
    saveError: "Save error",
    deviceSyncRemovedHint: "Use VaultKeepR QR pairing from Settings > Pair New Device"
  },
  header: {
    searchPlaceholder: "Search…",
    settings: "Settings",
    newEntry: "New entry",
    newLogin: "New login",
    newIdentity: "New identity",
    identities: "Identities",
    logins: "Logins",
    saveToIpfs: "Save to IPFS",
    syncIpfs: "Sync (IPFS)",
    syncWebApp: "Sync (web app)",
    sync: "Synchronization",
    export: "Export",
    lockVault: "Lock vault",
    exportJson: "Export (JSON)",
    exportEncrypted: "Export (encrypted)",
    import: "Import",
    premium: "Premium",
    premiumAccount: "Premium account",
    premiumAccountPlaceholder: "email or 0x...",
    link: "Link",
    unlink: "Unlink",
    licenseKey: "License key",
    activateKey: "Activate key",
    subscribeAnnual: "Subscribe (annual)",
    activeUntil: "Active until",
    saveToIpfsPlaceholder: "Vault password",
    saveToIpfsPlaceholderConnected: "Empty = cached password",
    saving: "Saving…",
    savedOnIpfs: "Saved on IPFS. ID:",
    uploadFailed: "Upload failed.",
    enterPassword: "Enter your master password.",
    signInWallet: "Approve the signature request in your wallet app.",
    signFailed: "Wallet signature failed or timed out. Open your wallet and try again.",
    signOverlayHint: "Open your wallet app and approve the signature request to encrypt and save your vault.",
    openMetaMask: "Open MetaMask"
  },
  vault: {
    unlockTitle: "Unlock vault",
    unlockDescription: "Password + wallet signature",
    vaultSaved: "Vault saved for this address",
    setMasterPassword: "Set master password",
    continue: "Continue",
    newVault: "New vault",
    signatureRequired: "Signature required",
    unlockRequired: "Please unlock your vault first",
    loading: "Loading…",
    saveToIpfs: "Save",
    syncIpfs: "Sync",
    syncWebApp: "Sync (web app)",
    add: "Add",
    save: "Save",
    saveInProgress: "Saving…",
    sync: "Sync",
    syncing: "Syncing…",
    importBitwarden: "Import Bitwarden",
    importCsv: "Import CSV",
    importPgp: "Import PGP",
    exportJson: "Export (JSON)",
    exportEncrypted: "Export (encrypted)",
    import: "Import",
    newEntry: "New entry",
    group: "Group",
    site: "Site",
    username: "Username",
    password: "Password",
    totp: "2FA",
    notes: "Notes",
    notesMasked: "Hide note by default",
    saveEntry: "Save",
    savedSuccess: "Vault saved",
    savedLocally: "locally (IPFS unavailable)",
    savedLocallyShort: "locally",
    savedViaIpfs: "via IPFS",
    noResult: "No results",
    unnamedEntry: "Unnamed account",
    noEntries: "No entries",
    addFirstEntry: "Add your first entries (e.g. github.com, gmail.com) with credentials.",
    searchPlaceholder: "Search site or username…",
    newVersionAvailable: "New version available (other device)",
    reload: "Reload",
    later: "Later",
    close: "Close",
    syncPasswordPrompt: "Sync",
    syncPasswordDescription: "Master password",
    autosaveReunlockHint: "Vault Sync disabled. Lock then unlock the vault to enable automatic sync.",
    backToLanding: "Website & presentation",
    tags: "Tags",
    navigation: "Navigation",
    favorites: "Favorites",
    allEntries: "All entries",
    categories: "Categories",
    settings: "Settings",
    noEntrySelected: "Select an entry to view details",
    search: "Search...",
    securityTools: "Security Tools",
    generator: "Generator",
    securityHealth: "Security Health",
    breachScanner: "Breach Scanner",
    newEntryShort: "New",
    groups: "Groups",
    group_identifiants: "Credentials",
    group_cartes: "Cards",
    group_notes: "Notes",
    group_identites: "Identities",
    group_seeds: "Crypto Seed",
    entryAdded: "Entry added!",
    entryUpdated: "Entry updated!",
    tagsPlaceholder: "e.g. work, personal, banking",
    favoriteLabel: "Favorite",
    favoriteYes: "Yes",
    favoriteNo: "No",
    subscribe: "Subscribe",
    reveal: "Reveal",
    totpCode: "2FA Code (TOTP)",
    premiumRequiredTotp: "Premium plan is required to use TOTP codes.",
    sort: "Sort",
    sortLastModified: "Recently modified",
    sortLastAdded: "Recently added",
    sortBy: "Sort: ",
    backupExportSuccess: "Backup exported successfully!",
    exportFilename: "vault-backup",
    sortAz: "A → Z",
    sortZa: "Z → A"
  },
  entry: {
    username: "Username",
    url: "URL",
    notes: "Notes",
    totp: "2FA",
    unknownTitle: "Untitled entry",
    noEntriesFound: "No entries found",
    type: {
      identity: "Identity",
      password: "Password",
      unknown: "Unknown"
    }
  },
  card: {
    number: "Card Number",
    expiry: "Expiry",
    cvv: "CVV",
    holder: "Cardholder",
    holderPlaceholder: "FULL NAME",
    defaultName: "Card"
  },
  note: {
    title: "Title",
    titlePlaceholder: "My secret note",
    content: "Content",
    contentPlaceholder: "...",
    defaultName: "Note"
  },
  identity: {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    emailPlaceholder: "email@example.com",
    phone: "Phone",
    birthDate: "Birth Date",
    address: "Address",
    postalCode: "Postal Code",
    city: "City",
    country: "Country",
    defaultName: "New identity",
    noIdentityFound: "No identities yet.",
    createFirstIdentityHint: "Create an identity via the + menu."
  },
  favorite: {
    toggle: "Toggle favorite"
  },
  addForm: {
    title: "New entry",
    group: "Group",
    site: "Site",
    username: "Username",
    password: "Password",
    totp: "2FA",
    totpSecretPlaceholder: "Secret from site",
    totpEditPlaceholder: "Leave empty to keep unchanged",
    totpPremiumOnly: "Premium subscribers only",
    notes: "Notes",
    notesPlaceholder: "Notes or remarks",
    notesMasked: "Mask note by default",
    cardNumber: "Card number",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiry: "Expiration",
    expiryPlaceholder: "12/28",
    cvv: "CVV",
    cvvPlaceholder: "123",
    cardholder: "Cardholder",
    cardholderPlaceholder: "LASTNAME Firstname",
    cardTitle: "Title (optional)",
    cardTitlePlaceholder: "e.g. Monabanq, N26...",
    noteTitle: "Title",
    noteTitlePlaceholder: "Note title",
    content: "Content",
    contentPlaceholder: "Note content…",
    save: "Save",
    customGroupLabel: "Custom group",
    newGroup: "New group",
    groupNamePlaceholder: "Group name",
    groupNameRequired: "Enter a group name",
    groupExists: "This group already exists",
    fillAtLeastOne: "Fill at least one field.",
    invalidCardNumber: "Invalid card number (13–19 digits).",
    invalidExpiry: "Invalid expiry format.",
    noteContentRequired: "Enter at least the note content.",
    noteContentEmpty: "Note content cannot be empty.",
    groupIdentifiants: "Credentials",
    groupCartes: "Cards",
    groupNotes: "Notes",
    groupIdentites: "Identities",
    groupSeeds: "Crypto Seeds",
    favorite: "Favorite",
    masked: "Mask by default",
    usernamePlaceholder: "user@example.com",
    sitePlaceholder: "example.com",
    addUri: "Add URI",
    uriPlaceholder: "https://example.com",
    matchType: "Match type",
    matchExact: "Exact",
    matchHostname: "Hostname",
    matchBaseDomain: "Base domain",
    matchNever: "Never",
    removeUri: "Remove URI"
  },
  editForm: { title: "Edit entry" },
  identityForm: {
    title: "Edit identity",
    newTitle: "New identity",
    firstName: "First name",
    lastName: "Last name",
    civility: "Civility",
    email: "Email",
    phone: "Phone",
    birthDate: "Date of birth",
    address: "Address",
    postalCode: "Postal code",
    city: "City",
    country: "Country",
    save: "Save identity",
    saveError: "Unable to save. Open the app and try again.",
    civilityMr: "Mr.",
    civilityMrs: "Mrs.",
    civilityNone: "—"
  },
  detailPane: {
    selectEntry: "Select an entry from the list",
    identity: "Identity",
    credentials: "Credentials",
    card: "Card",
    note: "Note",
    site: "Site",
    siteUrl: "Site URL",
    fillForm: "Fill form",
    fill: "Fill",
    filled: "Filled",
    filling: "Filling…",
    openSite: "Open site",
    edit: "Edit",
    delete: "Delete",
    deleteIdentity: "Delete this identity?",
    deleteCard: "Delete this card?",
    deleteNote: "Delete this note?",
    noTotp: "No TOTP code available",
    addTotpHelp: "Add a TOTP secret to an entry to see it here.",
    deleteLogin: "Delete this credential?",
    copyUsername: "Copy username",
    copyPassword: "Copy password",
    copyTotp: "Copy TOTP code",
    copySite: "Copy site",
    noName: "No name",
    noTitle: "No title",
    premiumRequired: "Premium required",
    totpInPremium: "2FA codes included in Premium.",
    number: "Number",
    expiration: "Expiration",
    cardholder: "Cardholder",
    code: "Code",
    content: "Content",
    passwordHistory: "Password History",
    previousPasswords: "Previous passwords",
    changedOn: "Changed on {date}",
    noPasswordHistory: "No password changes recorded"
  },
  seed: {
    walletName: "Wallet Identity",
    walletNamePlaceholder: "e.g. Ledger Nano S, MetaMask...",
    derivationPath: "Derivation Path",
    derivedAddress: "Derived Address",
    bip39Phrase: "BIP-39 Phrase",
    wordsCount: "{count} words",
    invalidPhrase: "Invalid phrase (incorrect word or checksum)",
    appPasswordPlaceholder: "App password...",
    bip39Alert: "BIP-39 verification complete.",
    deleteConfirm: "Delete this seed phrase?",
    cryptoSeedTitle: "Crypto Seed Phrase"
  },
  listPane: {
    noCredentialsForSite: "No credentials for this site",
    viewAll: "View all credentials",
    favorites: "Favorites",
    noResult: "No results",
    thisSite: "This site",
    thisSiteOnly: "This site only",
    sortDefault: "Default",
    sortMostUsed: "Most used",
    sortRecentlyUsed: "Recently used",
    sortLastSaved: "Last saved",
    customGroup: "Custom group",
    allGroups: "All groups",
    selectEntry: "Select an entry"
  },
  generator: {
    desc: "Generate strong and personalized passwords",
    length: "Length",
    chars: "characters",
    options: "Options",
    uppercase: "Uppercase (A–Z)",
    lowercase: "Lowercase (a–z)",
    numbers: "Numbers (0–9)",
    symbols: "Symbols (!@#$…)",
    generate: "Generate password",
    result: "Result",
    char: "character",
    charsPlural: "characters",
    title: "Password generation",
    subtitle: "Create strong and secure passwords",
    history: "History",
    clearHistory: "Clear history",
    clearHistoryConfirm: "Clear all generated password history?",
    noHistory: "No generated passwords yet.",
    justNow: "Just now",
    minutesAgo: "{n} min ago",
    hoursAgo: "{n} h ago",
    strength: "Strength",
    veryStrong: "Very Strong",
    strong: "Strong",
    medium: "Medium",
    fair: "Fair",
    weak: "Weak",
    veryWeak: "Very Weak",
    generateNew: "Generate New",
    passphraseMode: "Passphrase",
    passwordMode: "Password",
    wordCount: "Words",
    separator: "Separator",
    capitalize: "Capitalize",
    passphrase: "Passphrase"
  },
  securityHealthDetails: {
    title: "Security Health",
    subtitle: "Comprehensive analysis of your credentials' strength",
    score: "Score",
    vaultStatus: "Vault Status",
    statusExcellent: "Congratulations! Your passwords are overall excellent.",
    statusGood: "Good result, but some optimizations are recommended.",
    statusWarning: "Warning: several passwords present risks.",
    statusCritical: "Critical danger: your overall security is compromised!",
    critical: "Critical",
    weak: "Weak",
    reused: "Reused",
    strong: "Strong",
    fair: "Fair",
    all: "All",
    noIssues: "No problems detected in this category",
    noData: "No entries to analyze",
    noDataHint: "Add credentials with passwords to see the health analysis.",
    issueEmpty: "Empty password",
    issueTooShort: "Too short (< 8 characters)",
    issueDiversity: "Not enough character types",
    issueNoDigitSymbol: "No digit or symbol",
    issueRepeated: "Too many repeated characters",
    issueCommon: "Common password (known leak)",
    issuePattern: "Single repeated character",
    issueReused: "Reused on {count} other site(s)",
    issueOld: "Old password ({months} months)",
    issueExpired: "Password expired ({months} months old, max {days} days)",
    expired: "Expired"
  },
  autosave: {
    savedToast: "Credentials saved to VaultKeepR",
    edit: "Edit"
  },
  breachScanner: {
    title: "Breach Scanner",
    subtitle: "Check if your credentials appear in leaked databases",
    dataSecurity: "Data Security",
    hibpNotice: "We use the Have I Been Pwned service via a secure hashing system (k-anonymity).",
    hibpNoticeNoPassword: "No password ever leaves your device.",
    startScan: "Start Analysis",
    scanning: "Scan in progress...",
    stopScan: "Stop",
    scanComplete: "Scan complete!",
    scanError: "An error occurred during the scan.",
    breachedCount: "{count} compromised credentials",
    noBreaches: "No breaches detected",
    changeImmediately: "Change these passwords immediately.",
    resultsTitle: "Analysis Results",
    foundBreaches: "Breaches",
    safeEntries: "Safe",
    startHint: "Start the scan to see results",
    retry: "Rerun Analysis",
    emailSection: "Email Monitoring",
    emailSectionDesc: "Check your email addresses against known data breaches.",
    emailPlaceholder: "Add an email address",
    emailAdd: "Add",
    emailNoemails: "No monitored emails yet.",
    emailScan: "Scan Emails",
    emailScanning: "Scanning emails...",
    emailConsentTitle: "Privacy notice",
    emailConsentBody: "To check for breaches, your full email addresses are sent to leakcheck.io (a third-party service). No other data is transmitted.",
    emailConsentAgree: "I agree",
    emailBreachedCount: "{count} email(s) breached",
    emailNoBreaches: "No emails breached",
    emailRemove: "Remove"
  },
  tools: {
    servicesTitle: "Services",
    servicesSubtitle: "Secure sharing and storage",
    shareHint: "Share links, notes and files encrypted with PIN",
    docsHint: "Store your sensitive documents encrypted"
  },
  totp: {
    title: "2FA (TOTP)",
    lockedText: "Upgrade to Premium to view and use your 2FA codes here.",
    viewPremium: "View Premium",
    noCodes: "No 2FA codes.",
    addHint: "Add a TOTP secret to an entry (detail → TOTP) to see it here.",
    premiumDesc: "TOTP authentication is reserved for Premium members.",
    showAll: "All",
    showMatching: "This site",
    previous: "Previous account",
    next: "Next account"
  },
  premium: {
    back: "Back",
    title: "Premium",
    badgeTitle: "VaultKeepR Premium",
    badgeSub: "2FA included",
    activeUntil: "Premium active until",
    status: "Subscription",
    connectedDevices: "Connected devices",
    lastSeen: "Last seen",
    thisDevice: "This device",
    yourLicenseKey: "Your license key",
    licenseCrossPlatformDesc: "Use this key to activate Premium on the web app and extension.",
    revokeDeviceTitle: "Remove device",
    revokeDeviceConfirm: "This device will lose access to Premium. Continue?",
    syncLicense: "Sync license from IAP",
    subscribe: "Subscribe",
    subscribePrice: "Subscribe — {price}/yr",
    subscribePriceMonthly: "Subscribe — {price}/mo",
    planYearly: "Yearly",
    planMonthly: "Monthly",
    bestValue: "Best value",
    productUnavailable: "Product unavailable. Try again later.",
    restorePurchases: "Restore purchases",
    licenseTitle: "Web license (email)",
    licenseDesc:
    "Purchased on the site? Enter your VK-… key here. Use the same wallet as on web and in the extension.",
    licensePlaceholder: "VK-XXXX-XXXX-XXXX-XXXX",
    activateLicense: "Activate license",
    planPremiumName: "Premium",
    planProName: "Pro",
    planUltimateName: "Ultimate",
    planPremiumDesc: "TOTP, Alias, Shamir + 1 GB cloud",
    planProDesc: "50 GB encrypted cloud, 25 MB/file",
    planUltimateDesc: "Unlimited* storage, all features",
    planPremiumPrice: "2.49\u20ac/mo",
    planPremiumPriceYearly: "17.99\u20ac/yr",
    planProPrice: "3.99\u20ac/mo",
    planProPriceYearly: "39.99\u20ac/yr",
    planUltimatePrice: "6.99\u20ac/mo",
    planUltimatePriceYearly: "69.99\u20ac/yr",
    choosePlan: "Choose plan",
    cloudStorage: "cloud",
    perFile: "/file",
    allPremiumFeatures: "All Premium features",
    unlimitedStorage: "Unlimited* storage",
    termsOfUse: "Terms of Use",
    privacyPolicy: "Privacy Policy",
    legalFooter: "By subscribing, you agree to our Terms of Use and Privacy Policy. Subscriptions are managed by Apple and auto-renew unless cancelled at least 24h before the end of the current period.",

    successTitle: "Welcome to Premium",
    successDesc: "All premium features are now unlocked. Thank you for your support.",
    successContinue: "Continue",
    googlePlayActive: "Google Play Subscription",
    googlePlayActiveDesc: "Your Premium access is managed by Google Play. You can manage or cancel your subscription from the Play Store.",
    appStoreActive: "App Store Subscription",
    appStoreActiveDesc: "Your Premium access is managed by the App Store. You can manage or cancel your subscription from Settings > Subscriptions."
  },
  errorBoundary: { title: "Error" },
  mainTabs: {
    newVersionTitle: "New version available",
    newVersionMessage: "Vault has been updated. Sync?",
    newVersionMessageAlt: "Vault has been updated on another device. Sync?",
    later: "Later",
    sync: "Sync"
  },
  syncAlerts: {
    connectWallet: "Connect wallet.",
    remoteNewer: "A newer version exists on another device. Reload the page to sync.",
    remoteOlder: "Remote version is older than your local data. No sync needed.",
    enterPassword: "Enter your master password.",
    faceIdRequired: "Face ID authentication required or cancelled.",
    noRemoteVault: "No remote vault for this wallet. Save from another device first.",
    noRecord: "No record.",
    timeout: "Timeout. Try again.",
    signatureTimeout: "Signature not received. Open wallet and try again.",
    vaultUnlockedWalletRequired: "Unlocked vault and connected wallet required.",
    faceIdOrPassword: "Face ID or master password required.",
    pasteJson: "Paste export JSON.",
    enterMasterPassword: "Enter password.",
    enterPgpPassphrase: "PGP passphrase:",
    chooseMasterPassword: "Choose a master password.",
    formatUnknown: "Unknown format.",
    encryptedExportDetected: "Encrypted export detected.",
    entriesCountChoosePassword: "{count} entry(ies). Choose a password.",
    faceIdOrPasswordBelow: "Face ID or password below.",
    uriCopied: "URI copied. Paste into your wallet.",
    syncSuccess: "Synced. Vault updated.",

    syncConflictTitle: "Sync conflict",
    syncConflictBody: "A newer version of your vault exists on another device. Your local changes have NOT been overwritten. Click below to pull the remote and 3-way-merge with your local changes.",
    syncConflictPullRemote: "Pull remote (3-way merge)",
    syncConflictDismiss: "Keep local for now",
    vaultLoaded: "Vault loaded from IPFS.",
    saveSuccess: "Success. Saved on IPFS.",
    saveSuccessWebapp: "Saved on IPFS. Web app and extension can retrieve this version.",
    sessionExpired: "Wallet session expired",
    reconnectWallet: "Reconnect wallet then try again.",
    sessionExpiredInvalid: "Wallet session expired or invalid. Reconnect wallet (Connect button), then try Save again.",
    openWalletRetry: "Open wallet and try again.",
    biometricEnabledTitle: "Face ID enabled",
    biometricDisabledTitle: "Face ID disabled",
    biometricEnabled: "Face ID enabled. You can unlock the vault with Face ID.",
    biometricDisabled: "Master password will be required each time.",
    autosaveActivated: "Vault Sync enabled. Changes will be saved automatically to IPFS."
  },
  fragmented: {
    title: "Fragmented vault",
    setupTitle: "Fragmented vault",
    setupDesc: "Split your vault into 5 parts (3 required). Recovery ID independent of wallet.",
    recoveryTitle: "Recover fragmented vault",
    recoveryDesc: "Recover your vault with Recovery ID and at least 3 parts (device, contact or IPFS).",
    recoveryIdLabel: "Recovery ID (32 hex)",
    generateRecoveryId: "Generate",
    saveRecoveryId: "Save Recovery ID",
    devicePartSaved: "Device part saved",
    partsUploaded: "Parts uploaded to IPFS",
    contactPartExport: "Give this part to a trusted contact for recovery",
    scanContactPart: "Scan with contact to transmit the part",
    pasteContactPart: "Copy contact part",
    recoverVault: "Recover vault",
    needThreeParts: "Need 3 parts to recover",
    activate3of5: "Activate 3-of-5",
    placeholderGenerateOrPaste: "Generate or paste",
    copyRecoveryId: "Copy Recovery ID",
    recoveryIdPlaceholder: "e.g. a1b2c3d4...",
    passwordPlaceholder: "Master password to unlock",
    contactPartLabel: "Contact part (base64, optional)",
    contactPartPlaceholder: "Paste the part received from your contact",
    errorRecoveryIdRequired: "Enter the Recovery ID (32 hex).",
    recoveryIdCopiedAlert: "Recovery ID copied. Keep it in a safe place.",
    contactPartCopiedAlert: "Contact part copied. Send it to a trusted person.",
    errorPasswordRequired: "Enter the master password.",
    errorRecoveryIdInvalid: "Invalid Recovery ID (32 hex characters).",
    errorContactPartInvalid: "Invalid contact part (base64).",
    errorPartsInsufficient: "Not enough parts: {have}/{need}. Provide the contact part.",
    errorPersistence: "Save error",
    recoverLink: "Recover fragmented vault",
    storeOnChain: "Store part on-chain (Base)",
    storeOnChainDone: "Part stored on-chain",
    storeOnChainConfigHint: "To enable on-chain storage, deploy the contract and add fragmentContractAddress to config.json.",
    viewTransaction: "View transaction",
    connectWalletToStore: "Connect wallet to store on-chain",
    errorWcReconnectBase:
    "This wallet session does not include Base (chain 8453). Disconnect WalletConnect in Settings → Wallet, then connect again and approve Ethereum + Base.",
    storeOnChainQrHint:
    "Scan with your wallet to pair for this transaction only. Approve Ethereum and Base, then confirm the transaction on your device.",
    storeOnChainSecondPrompt:
    "After connecting: keep the wallet app open — a second prompt should appear to sign the transaction on Base (not only the connection).",
    storeOnChainTimeout: "Timed out waiting for the wallet. Try again.",
    storeOnChainNoUri: "WalletConnect URI unavailable.",
    errorFragmentWcApproveBase:
    "This pairing must include the Base network (chain 8453). Scan the QR again and approve Base in the WalletConnect screen. If your wallet refuses a Base-only connection, update the app.",
    tooltipRecoveryIdSetup:
    "Keep this Recovery ID secret and backed up (paper or trusted password manager). You need it to recover on another device. It is not your wallet address or master password. It derives keys that decrypt stored shares—losing it can make recovery impossible even if some shares still exist.",
    tooltipRecoveryIdAfterSetup:
    "Copy or write down this exact Recovery ID and store it safely offline. Without it, you cannot recover this fragmented vault, even with contact or on-chain shares. The master password alone is not enough.",
    tooltipContactPart:
    "This QR is one Shamir share (3-of-5). Only give it to someone you trust for recovery. It does not reveal your master password or full vault without other shares and your Recovery ID.",
    tooltipStoreOnChain:
    "Stores one encrypted share on Base via your wallet. You still need this Recovery ID and your master password to open the vault later; this only adds another place where one share can be fetched.",
    tooltipActivate3of5:
    "Creates 5 encrypted shares; any 3 rebuild the vault key. Shares go to IPFS, this device, your contact, optionally Base, and the API channel. Start only when your Recovery ID is saved—you cannot change it without redoing setup.",
    tooltipRecoveryIdRecover:
    "Must match exactly the 32-character Recovery ID from fragmented setup (same spelling and case). It derives the lookup key for your manifest and decrypts stored shares. One wrong character and recovery will fail.",
    tooltipMasterPasswordRecover:
    "The master password of the vault you are recovering—not the Recovery ID. After enough shares are combined, it decrypts the vault contents.",
    tooltipContactPartRecover:
    "Optional if you already have enough shares from this device, IPFS, or on-chain. Paste the base64 share from your trusted contact when you need one more share to reach the threshold (e.g. 3-of-5).",
    recoverySuccessBody: "Your fragmented vault has been restored.",
    onChainDeprecated: "On-chain fragment storage via WalletConnect is deprecated. Fragments are stored on the API relay."
  },
  nfcSetup: {
    title: "Configure NFC Chip",
    notSupportedTitle: "NFC Not Supported",
    notSupportedDesc: "Your device does not support NFC hardware.",
    pinDesc: "Choose a security PIN (4-6 digits). It will be required if biometrics (FaceID) fails.",
    pinPlaceholder: "PIN Code",
    btnContinue: "Continue",
    writeDesc: "PIN is secured. Let's generate cryptography and write it to your physical chip.",
    btnWrite: "Write to NFC Chip",
    errorTitle: "Error",
    errorPinShort: "The PIN code must be at least 4 digits.",
    errorNoPassword: "Unable to retrieve local key for encoding.",
    errorWriteFailed: "Unable to write to the chip.",
    successTitle: "Success",
    successDesc: "NFC chip successfully configured! You can now use it to log in.",
    promptFaceId: "Authorize FaceID for this NFC chip",
    promptFallback: "Use PIN",
    promptNfcScan: "Hold your NTAG213 chip near to link it",
    errorAnonymousSignature: "Vault password not found for anonymous signature."
  },
  vaultAlerts: {
    authCancelled: "Authentication cancelled or unavailable.",
    saveError: "Save error",
    autoSaveError: "Automatic save error"
  },
  walletAlerts: {
    connectToSign: "Connect your wallet to sign (WalletConnect).",
    walletNotDetectedSave: "Wallet not detected. Connect a wallet to save.",
    walletNotDetectedSync: "Wallet not detected. Connect a wallet to sync.",
    connectWalletSync: "Connect your wallet to sync."
  },
  premiumAlerts: {
    iapOnlyNative: "In-app purchases available only in the native app (not in Expo Go).",
    noRestore: "No purchases to restore.",
    purchaseError: "Purchase error",
    needWalletForLicense: "Connect your wallet first (same address as on web / extension).",
    licenseApiUnavailable: "Premium server URL is not configured in the app build.",
    licenseEmpty: "Enter your license key.",
    licenseInvalid: "Invalid or already used key.",
    licenseActivated: "License activated. Premium synced across your devices.",
    keyCopied: "License key copied to clipboard."
  },
  listScreen: {
    all: "All",
    login: "Login",
    cards: "Cards",
    notes: "Notes",
    identities: "Identities",
    searchPlaceholder: "Search…",
    entry: "entry",
    entries: "entries",
    sortAz: "Sort: A→Z",
    sortZa: "Sort: Z→A",
    noResult: "No results",
    emptyHint: "No entries.\nPress + to add.",
    quickSearchTitle: "⌘ Quick search",
    noResults: "No results",
    noRecentEntries: "No recent entries",
    recent: "Recent"
  },
  detailScreen: {
    back: "Back",
    edit: "Edit",
    delete: "Delete",
    deleteShort: "Delete",
    deleteConfirm: "Delete « {title} »?",
    show: "Show",
    hide: "Hide",
    credentials: "Credentials",
    civility: "Civility",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    birthDate: "Date of birth",
    address: "Address",
    postalCode: "Postal code",
    city: "City",
    country: "Country",
    cardNumber: "Card number",
    expiration: "Expiration",
    cardholder: "Cardholder",
    content: "Content",
    site: "Site",
    username: "Username",
    premiumRequired: "Premium required",
    subscribe: "Subscribe",
    noName: "No name",
    card: "Card"
  },
  addEntryScreen: {
    cancel: "Cancel",
    edit: "Edit",
    newEntry: "New entry",
    save: "Save",
    site: "Site",
    sitePlaceholder: "e.g. github.com",
    username: "Username",
    usernamePlaceholder: "email or username",
    password: "Password",
    passwordPlaceholder: "Enter or generate",
    totp: "2FA",
    totpPlaceholder: "Secret",
    totpPremiumRequired: "Premium required to add 2FA — Subscribe",
    notes: "Notes",
    notesPlaceholder: "Notes",
    tags: "Tags",
    tagsPlaceholder: "e.g. work, personal, banking",
    cardNumber: "Card number",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiry: "Expiration",
    expiryPlaceholder: "12/28",
    cvv: "CVV",
    cvvPlaceholder: "123",
    cardholder: "Cardholder",
    cardholderPlaceholder: "LASTNAME Firstname",
    cardTitle: "Title (optional)",
    cardTitlePlaceholder: "e.g. Monabanq, N26...",
    noteTitle: "Title",
    noteTitlePlaceholder: "Note title",
    noteContent: "Content",
    noteContentPlaceholder: "Note content…",
    maskedByDefault: "Mask by default",
    civility: "Civility",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    emailPlaceholder: "email@example.com",
    phone: "Phone",
    phonePlaceholder: "+33 6 12 34 56 78",
    birthDate: "Date of birth",
    birthDatePlaceholder: "DD/MM/YYYY",
    address: "Address",
    addressPlaceholder: "Street number and name",
    postalCode: "Postal code",
    postalCodePlaceholder: "75001",
    city: "City",
    cityPlaceholder: "Paris",
    country: "Country",
    countryPlaceholder: "France",
    login: "Login",
    card: "Card",
    note: "Note",
    identity: "Identity",
    favorite: "Favorite",
    favoriteYes: "Yes",
    favoriteNo: "☆ No",
    newGroup: "New Group",
    groupNamePlaceholder: "Group name"
  },
  settingsPage: {
    back: "Back",
    loading: "Loading",
    premiumDescription: "An active Premium subscription on iOS, extension or web app is valid on all devices (same wallet or email account).",
    premiumFeaturesTitle: "Included with Premium:",
    activateKeyHint: "Activate a key received by email or after purchase.",
    buyLicense: "Buy license",
    keyActivated: "Key activated. Reload the vault page to see Premium.",
    connectWalletPremium: "Connect your wallet to see Premium status or activate a key.",
    syncCidDescription: "Clear the CID cache to force a fresh fetch from the API.",
    connectWallet: "Connect your wallet.",
    aboutDescription: "Vault Keeper stores your passwords in a decentralized way. No data is sent to our servers. Your encrypted vault is stored on IPFS.",
    langEn: "English",
    langFr: "French",
    import: "Import",
    importDescription:
    "Import your vault from another app. Supported: Bitwarden JSON, Proton Pass JSON, VaultKeepR, 1Password 1PIF, CSV (many vendors), or PGP. Not supported: encrypted Bitwarden export, 1Password .1pux.",
    importFormats:
    "Bitwarden JSON, Proton Pass JSON, VaultKeepR JSON, CSV (LastPass, Chrome, 1Password, …), 1PIF (1Password), PGP",
    importSuccess: "{count} entries imported. Return to the vault to see them.",
    importPgpHint: "PGP passphrase to decrypt the file:",
    importVaultPasswordHint: "Vault Keeper master password:",
    export: "Export",
    exportDescription: "Export your vault. Unlock the vault first, then return here to export.",
    exportPlain: "JSON (plain)",
    exportEncrypted: "JSON (encrypted)",
    exportPgp: "PGP",
    exportUnlockHint: "Unlock the vault first, then return to Settings to export.",
    exportEncryptedHint: "Master password to encrypt the export:",
    exportPgpHint: "PGP passphrase to encrypt the export:",
    exportSaved: "File saved successfully.",
    premiumLegacyHint: "You are using Premium via your Wallet. To use Premium on other devices (iOS, Firefox), generate a license key on the Web App.",
    manageOnWeb: "Manage on Web",
    migrateHint: "Migrate your existing mobile subscription to VaultKeepR.",
    migrateButton: "Migrate VaultKeepR Go"
  },
  walletConnect: {
    wallet: "Wallet",
    disconnect: "Disconnect",
    scanWithWallet: "Scan with your mobile wallet",
    copyUri: "Copy URI",
    connect: "Connect wallet",
    connecting: "Connecting…",
    openExtensions: "Open Extensions",
    lastVaultCid: "Last vault CID",
    viewOnIpfs: "Open on ipfs.io",
    noVaultCid: "No CID yet. Save to IPFS from the header or enable Vault Sync."
  },
  autosaveDelegation: {
    autosaveIpfs: "Vault Sync",
    syncDays: "Signed delegation ~7 days",
    autosaveActive: "Vault Sync active",
    renew: "Renew",
    activate: "Activate",
    connectAndActivate: "Connect & activate",
    orViaApp: "Or via app"
  },
  autosaveQr: {
    title: "Vault Sync",
    preparing: "Preparing…",
    scanWithWallet: "Scan with your wallet",
    copyUri: "Copy URI",
    activated: "Activated",
    close: "Close",
    cancel: "Cancel",
    openWalletRetry: "Open wallet on your phone, accept the signature request, then try again.",
    signatureRejected: "Signature rejected in wallet.",
    unknownError: "Unknown error",
    walletSign: "Open your wallet and approve the signature",
    walletSignHint: "A notification has been sent to your connected wallet"
  },
  alias: {
    title: "Email alias",
    description: "Create xxx@vaultkeepr.xyz aliases that forward to your email. Disable anytime.",
    destinationEmail: "Forward to",
    destinationPlaceholder: "you@example.com",
    create: "Create alias",
    mainAddress: "Main address",
    empty: "No aliases yet.",
    enable: "Enable",
    disable: "Disable",
    inactive: "Disabled",
    premiumRequired: "Email alias requires Premium.",
    walletRequired: "Unlock your vault to manage aliases.",
    deleteConfirm: "Delete this alias? Mail to this address will stop forwarding."
  },
  vaultContext: {
    saveToIpfsConfirm: "Save to IPFS now?",
    masterPasswordPrompt: "Master password:",
    vaultSavedIpfs: "Vault saved to IPFS.",
    saveFailed: "Failed.",
    openAppUnlock: "Open the app, unlock the vault, then try again.",
    deleteError: "Error: unable to delete",
    saveError: "Error: unable to save",
    noLoginForm: "No login form detected on this page.",
    fillErrorPrefix: "Unable to fill: ",
    reloadRetry: "Reload the page then try again.",
    exportEncryptedPrompt: "Master password to encrypt export (remember for import elsewhere):",
    exportDownloaded: "Encrypted export downloaded.",
    importEncryptedPrompt: "Master password of encrypted export:",
    importPgpPrompt: "PGP passphrase to decrypt file:",
    entriesImported: "{count} entry(ies) imported.",
    unknownFormat: "Unknown JSON format.",
    noEntriesFound: "No entries found.",
    entriesImportedOpenApp: "{count} entry(ies) imported. Open the app and save to add them to the vault.",
    importAdded: "added",
    importSkipped: "duplicates skipped",
    importEnriched: "enriched (2FA added)",
    savedIpfs: "Saved to IPFS (cross-device sync)",
    savedLocally: "Saved locally",
    remoteNewerForce: "Force overwrite",
    fillDemo: "[Demo] Fill: {username}",
    fillIdentityDemo: "[Demo] Fill identity: {name}",
    zeroDuplicates: "0 duplicates",
    licenseKeyCopied: "License key copied",
    deviceRevoked: "Device revoked",
    cidUnpinned: "IPFS CID unpinned"
  },
  passwordGenerator: {
    placeholder: "Enter or generate",
    generate: "Generate",
    length: "Length",
    uppercase: "Uppercase",
    lowercase: "Lowercase",
    numbers: "Numbers",
    symbols: "Special chars",
    char: "character",
    chars: "characters"
  },

  pwnedPassword: {
    found: "This password appeared {{count}} times in known data breaches (Have I Been Pwned).",
    checkFailed: "Could not check the breach database (network).",
    attribution: "Breach check: Have I Been Pwned (k-anonymity)"
  },

  productGuide: {
    webWalletCalloutTitle: "NFC Hardware Key or Wallet for Sync",
    webWalletCalloutBody:
    "Your vault is encrypted on this device with your master password. Scanning an NFC tag or connecting a wallet links an encrypted backup to your address and enables IPFS sync. You can connect whenever you’re ready.",
    tooltipWhyWallet:
    "Your NFC tag or Web3 wallet securely signs messages to tie backups to your address. We never receive your master password, NFC seed, or decrypted vault.",
    tooltipLocalFirst:
    "You can create a new vault and use it entirely locally. Later, use NFC or connect a wallet to save an encrypted copy to IPFS.",
    tooltipIpfsEncrypted:
    "Only ciphertext is stored on IPFS. Decryption requires your master password and your NFC/Wallet signature as part of key derivation.",
    hintLinkWallet: "NFC & Wallet",
    hintLinkLocal: "Local first",
    hintLinkIpfs: "IPFS & encryption",
    importBlockTitle: "Migrate from another password manager",
    importBlockBody:
    "Import Bitwarden JSON, Proton Pass JSON, VaultKeepR JSON, 1Password 1PIF (one JSON object per line), CSV from LastPass, Chrome, 1Password, Dashlane-style columns, or PGP-wrapped exports. Parsing runs locally; nothing is sent to our servers as plaintext. 1Password .1pux (encrypted ZIP) is not supported — export as CSV or 1PIF from 1Password instead.",
    tooltipImportFormats:
    "Bitwarden (unencrypted JSON), Proton Pass JSON, VaultKeepR JSON/encrypted JSON, 1Password 1PIF, CSV with url/username/password-style headers, OpenPGP files. Encrypted Bitwarden exports are not supported. .1pux is not supported.",
    importStep1: "Export from your old app (JSON, 1PIF, CSV, or PGP-wrapped file).",
    importStep2: "Choose the file below. Decryption happens locally in the browser.",
    importStep3: "Unlock with your VaultKeepR master password if the import is encrypted.",
    importStep4: "Save the vault — your entries merge into the open vault.",
    importPrivacyTip: "After a successful import, delete the export file from your device.",
    tooltipImportFileButton: "Select Bitwarden, Proton Pass, VaultKeepR, CSV, .1pif, or PGP export from your computer.",
    autofillTitle: "Autofill in the browser",
    autofillBody:
    "On websites, open this extension to fill username and password fields. With Premium, TOTP codes are generated locally from the secret stored on the entry.",
    tooltipAutofillFields:
    "Detection depends on each site’s HTML. If no suggestion appears, copy the password from the vault.",
    tooltipAutofillTotp:
    "Time-based one-time passwords are computed on your device from the TOTP secret; nothing is sent to us.",
    autofillQualityNote: "Non-standard login forms may need copy-paste — that’s normal.",
    hintAutofillFields: "Field detection",
    hintAutofillTotp: "2FA / TOTP",
    tooltipExtTabIpfs:
    "Load a vault already backed up to IPFS: connect the same wallet, enter your master password, then unlock.",
    tooltipExtTabLocalVault:
    "Create a vault stored only on this browser first. Connect a wallet in Settings later to sync encrypted backups to IPFS.",
    extLockedAutofillHint:
    "Tip: after unlock, use the extension on login pages to autofill — or copy from an entry if the site is unusual."
  },
  downloadPage: {
    title: "Get VaultKeepR",
    subtitle: "Available on Chrome and iOS. Same vault, same encryption, everywhere.",
    extensionTitle: "Chrome Extension",
    extensionDesc: "Autofill passwords, generate TOTP codes, and sync your vault—directly in your browser.",
    extensionCta: "Add to Chrome",
    iosTitle: "iOS App",
    iosDesc: "Face ID, AutoFill, Account Abstraction—your vault always in your pocket.",
    iosCta: "App Store",
    webTitle: "Web App",
    webDesc: "Full-featured vault in your browser. No install required—connect your wallet and go.",
    webCta: "Open Web App",
    privacyTitle: "Zero tracking. Zero logs.",
    privacyDesc: "VaultKeepR collects no analytics, no telemetry, no user data. Your vault is encrypted end-to-end and only you hold the keys.",
    recommended: "Recommended",
    backHome: "Back to home"
  },
  landing: {
    shopBanner: "New: Secure your vault with our exclusive <a href='/shop' class='underline underline-offset-2 font-bold hover:text-white/80 transition-colors'>VaultKeepR NFC Keychain</a>!",
    navHow: "How it works",
    navFeatures: "Features",
    navTerms: "Terms",
    navPrivacy: "Privacy",
    chromeExtension: "Chrome Extension",
    firefoxAddon: "Firefox Add-on",
    appStore: "App Store",
    navPremium: "Premium",
    navDownload: "Download",
    navTurboTest: "Turbo Test",
    navOpenApp: "Open app",
    heroSubtitle: "Protect your passwords, identities and documents without ever sharing them with us. Log in with your fingerprint, your face, or a secure method you already own. Extension, iOS, Android.",
    heroCta: "Try free",
    trustBadge: "Privacy by design",
    trustTitle: "Nobody sees your passwords. Not even us.",
    trustSubtitle: "Your passwords are locked on your device before they ever leave it. The encrypted vault is stored on decentralized IPFS, unreadable without your key.",
    pillar1Title: "Your data stays with you",
    pillar1Desc: "Your passwords are locked on your device before being stored. Even if gateways are down, decentralized P2P storage keeps your vault safe.",
    pillar2Title: "No account, no email",
    pillar2Desc: "Log in with your fingerprint or face. We don't ask for a name, email, or password. Nobody can hack an account that doesn't exist.",
    pillar3Title: "You are never locked in",
    pillar3Desc: "Your data is not locked inside our servers. If our service disappears tomorrow, your passwords remain accessible. You can leave whenever you want.",
    howTitle: "How it works",
    howSubtitle: "From setup to encrypted backup, in a few simple steps.",
    step1Title: "Create your vault",
    step1Desc: "A secure on-chain identity is created automatically via your Smart Account. No signup, no external app, no wallet required.",
    step2Title: "Choose your lock",
    step2Desc: "Pick a master password, use your fingerprint, or a Passkey. Your vault key is derived from it and never stored anywhere.",
    step3Title: "Automatic backup",
    step3Desc: "Your encrypted vault is backed up to IPFS automatically. No single point of failure, no central database.",
    step4Title: "Use everywhere",
    step4Desc: "Mobile app, browser extension with autofill, Face ID, biometrics. Same vault, all your devices.",
    featuresTitle: "Built for real use",
    featuresSubtitle: "Sync, recover, and protect credentials across devices—without trusting us with your passwords.",
    feat1Title: "Invisible to us",
    feat1Desc: "Your passwords are decrypted only on your device. We never see your passwords, cards, or notes — by design.",
    feat2Title: "No account needed",
    feat2Desc: "No email, no registration form. Your Smart Account is your identity. One fewer thing that can be hacked.",
    feat3Title: "Sovereign identity",
    feat3Desc: "Your identity is a Smart Account on-chain. No centralized server keeps a database of who you are.",
    feat4Title: "IPFS backup",
    feat4Desc: "Encrypted vault stored on IPFS. Nothing in clear text on our side, ever. You control your CID.",
    feat5Title: "Biometrics + PRF",
    feat5Desc: "WebAuthn PRF derives the key from your fingerprint or face. True passwordless encryption without external wallets.",
    feat6Title: "Modern encryption",
    feat6Desc: "Argon2id key derivation and XChaCha20-Poly1305 encryption. Industry-leading defaults for your vault.",
    feat7Title: "Extension, iOS, Android",
    feat7Desc: "Autofill in the browser, AutoFill on iOS and Android, full vault UI — including groups, identities, and TOTP.",
    feat8Title: "Import & export",
    feat8Desc: "Bitwarden, CSV, JSON, PGP. Export plain, encrypted, or PGP-wrapped for your own backups.",
    feat9Title: "No ads, no tracking",
    feat9Desc: "No advertising, no behavioral profiling. Premium and aliases use standard payment and email flows only where you opt in.",
    feat10Title: "Vault Sync",
    feat10Desc: "After unlocking, changes sync to IPFS automatically and update the smart contract registry in the background.",
    feat11Title: "Fragmented recovery (Premium)",
    feat11Desc: "Split your vault into 5 shares (Shamir 3-of-5). Recovery is independent of your device for disaster recovery.",
    feat12Title: "Email aliases (Premium)",
    feat12Desc: "Create forwarding addresses on your domain to hide your real inbox from signups and leaks.",
    feat13Title: "Multi-modal auth",
    feat13Desc: "Unlock with biometric passkeys, master password, or physical NFC backup keys.",
    feat14Title: "Secure Documents",
    feat14Desc: "Store sensitive documents like ID cards, fragmented and encrypted before IPFS sync.",
    feat15Title: "Security monitoring",
    feat15Desc: "Track DApps approvals, scan for breaches, and get alerts when something needs attention.",
    feat16Title: "Encrypted Cloud",
    feat16Desc: "Store files in encrypted cloud storage (S3). From 10 MB (free) to Unlimited depending on your plan.",
    feat17Title: "Quick Share",
    feat17Desc: "Share credentials securely with zero-knowledge ephemeral links. The recipient needs no account.",
    feat18Title: "TOS AI Analysis",
    feat18Desc: "AI scans Terms of Service for data sharing and deletion rights, and detects phishing pages.",
    feat19Title: "Password Health",
    feat19Desc: "Breach scanner, strength audit, and reuse detection. Identify weak passwords before attackers do.",
    ctaTitle: "Ready to protect what matters?",
    ctaSubtitle: "Start in seconds. No account needed, no data collected.",
    ctaButton: "Try free",
    techTitle: "Under the hood",
    techSubtitle: "For developers and security auditors: the technologies behind VaultKeepR.",
    tech1Name: "IPFS",
    tech1Desc: "Content-addressed, distributed storage for encrypted vault blobs",
    tech2Name: "Open source",
    tech2Desc: "Core and clients auditable by the community",
    tech3Name: "Smart Wallet",
    tech3Desc: "Standard wallet signing (EIP-191), no custodian",
    tech4Name: "Argon2id",
    tech4Desc: "Memory-hard key derivation",
    tech5Name: "S3 Cloud",
    tech5Desc: "Zero-knowledge encrypted file storage",
    privacyBadgeLabel: "Zero data collected",
    privacyBadgeTitle: "Your privacy is not a setting. It's our foundation.",
    privacyBadgeSubtitle: "VaultKeepR does not collect analytics, telemetry, or user data. We literally cannot see what you store.",
    privacyBadge1Title: "Zero tracking",
    privacyBadge1Desc: "No analytics, no cookies, no fingerprinting. We don't know who you are and we never will.",
    privacyBadge2Title: "Nothing to steal",
    privacyBadge2Desc: "Your passwords are encrypted on your device before storage. We only hold sealed vaults — there is nothing to breach.",
    privacyBadge3Title: "Locked before it leaves",
    privacyBadge3Desc: "End-to-end encrypted with military-grade algorithms. Your master password never leaves your device.",
    heroH1Prefix: "The",
    heroH1Main: "Zero-Knowledge Password Manager",
    heroH1Suffix: "that doesn't need your email.",
    heroCtaDetailed: "Try VaultKeepR Free — No Email Required",
    heroReassurance: "Free forever  •  Open source  •  2-minute setup",
    heroSecondaryCta: "or see how it works",
    heroGitHubStars: "stars on GitHub",
    trustSignalNoEmail: "No email required",
    trustSignalOpenSource: "Open source",
    trustSignalAuditable: "100% auditable",
    trustSignalFreeForever: "Free forever",
    miniPricingTitle: "Free for everyone. Premium for convenience.",
    miniPricingSubtitle: "Every security feature is free, forever. Premium adds encrypted cloud backup, TOTP authenticator, and Shamir recovery.",
    miniPricingFreeTitle: "Free",
    miniPricingFreePrice: "$0",
    miniPricingFreePeriod: "forever",
    miniPricingFreeCta: "Get Started",
    miniPricingFreeFeat1: "Unlimited passwords & cards",
    miniPricingFreeFeat2: "XChaCha20 + Argon2id encryption",
    miniPricingFreeFeat3: "Chrome, Firefox, iOS, Android",
    miniPricingFreeFeat4: "IPFS decentralized sync",
    miniPricingFreeFeat5: "No email, no account",
    miniPricingPremiumTitle: "Premium",
    miniPricingPremiumPrice: "€2.49",
    miniPricingPremiumPeriod: "/month",
    miniPricingPremiumCta: "Get Premium",
    miniPricingPremiumFeat1: "Everything in Free",
    miniPricingPremiumFeat2: "Encrypted cloud backup (1 GB)",
    miniPricingPremiumFeat3: "TOTP authenticator",
    miniPricingPremiumFeat4: "Shamir recovery (3-of-5)",
    miniPricingPremiumFeat5: "Priority support",
    miniPricingPremiumFeat6: "Anonymous crypto payment",
    miniPricingCompareAll: "Compare all plans",
    stickyNavFeatures: "Features",
    stickyNavHowItWorks: "How it works",
    stickyNavSecurity: "Security",
    stickyNavCompare: "Compare",
    stickyNavPricing: "Pricing",
    stickyNavFaq: "FAQ",
    comparePreviewTitle: "How does VaultKeepR compare?",
    comparePreviewSubtitle: "Side-by-side with the most popular password managers. Same features, different philosophy.",
    bannerCloseAria: "Close announcement",
    footerTerms: "Terms",
    footerPrivacy: "Privacy policy",
    footerDocs: "Documentation",
    footerSecurity: "Security",
    footerChangelog: "Changelog",
    footerGithub: "GitHub",
    footerSocialGithubAria: "vaultkeepr-core repository on GitHub",
    footerSocialXAria: "VaultKeepR on X (@vaultkeepr_xyz)",
    footerContact: "Contact",
    contactTitle: "Contact us",
    contactIntro:
    "We read every message. Never send your master password or vault contents here.",
    contactName: "Name",
    contactEmail: "Email",
    contactMessage: "Message",
    contactSubmit: "Send",
    contactSending: "Sending…",
    contactSuccess: "Thank you. We will get back to you as soon as we can.",
    contactError: "Something went wrong. Please try again later.",
    contactClose: "Close",
    contactRequired: "Please fill in all fields.",
    contactInvalidEmail: "Please enter a valid email address.",
    contactResendError: "We can’t send mail from this form right now. Please try again later or use another channel from our Privacy Policy.",
    contactInboxError:
    "We can’t receive messages through this form yet. Try the Security page, or the contact options in our Privacy Policy.",
    contactConfigError: "The contact form is not available on this deployment.",
    footerCopyright: "All rights reserved.",
    loading: "Loading…",
    comingSoonTitle: "Your passwords deserve better",
    comingSoonSubtitle:
    "VaultKeepR is the first zero-knowledge, decentralized password manager powered by your Ethereum wallet. No email. No servers. No compromise.",
    comingSoonCountdownTitle: "Launch countdown",
    comingSoonUnitDays: "Days",
    comingSoonUnitHours: "Hours",
    comingSoonUnitMinutes: "Minutes",
    comingSoonUnitSeconds: "Seconds",
    comingSoonLive: "The countdown has ended — public access is opening very soon.",
    comingSoonEmailPlaceholder: "Enter your email for early access",
    comingSoonEmailCta: "Join the waitlist",
    comingSoonEmailSuccess: "You're on the list! We'll notify you at launch.",
    comingSoonFeat1Title: "Zero-Knowledge",
    comingSoonFeat1Desc: "Encrypted on your device with Argon2id + XChaCha20. We can't read your data — by design.",
    comingSoonFeat2Title: "Wallet Login",
    comingSoonFeat2Desc: "Connect securely with an embedded Smart Wallet via Account Abstraction. No email, no account password.",
    comingSoonFeat3Title: "IPFS Backup",
    comingSoonFeat3Desc: "Your encrypted vault is synced across devices via IPFS. Decentralized and resilient.",
    comingSoonFeat4Title: "Cross-Platform",
    comingSoonFeat4Desc: "Web app, Chrome extension, and iOS. One vault, everywhere.",
    heroTagIpfs: "IPFS backup",
    heroTagWallet: "No account needed",
    heroTagE2e: "End-to-end encrypted",
    heroTagCloud: "Encrypted cloud",
    heroTagAndroid: "Android & iOS",
    playStore: "Play Store",
    langSwitchToEn: "Switch to English",
    langSwitchToFr: "Passer en français"
  },
  vaultAppEntry: {
    subtitle: "Connect your wallet to unlock your vault on this domain.",
    backToMarketing: "Website & presentation"
  },
  premiumPage: {
    title: "Choose Your Plan",
    subtitle: "From free essentials to unlimited cloud — pick the plan that fits your needs.",
    featureCol: "Feature",
    freeCol: "Free",
    premiumCol: "Premium",
    ultimateCol: "Ultimate",
    proCol: "Pro",
    featPrice: "Price",
    priceFree: "€0",
    pricePremium: "€14.99 / yr · €2.49 / mo",
    priceUltimate: "€69.99 / yr · €6.99 / mo",
    pricePro: "€39.99 / yr · €3.99 / mo",
    billingLabel: "Plan",
    billingYearly: "Yearly — save up to 40%",
    billingMonthly: "Monthly — cancel anytime",
    featLogins: "Logins & passwords (unlimited)",
    featCards: "Cards & notes",
    featIdentities: "Identities & autofill",
    featIpfs: "IPFS encrypted backup",
    featExtension: "Browser extension",
    featIos: "iOS & Android apps",
    featAndroid: "Android App",
    featExport: "Export (JSON, PGP)",
    featBreachScanner: "Breach scanner & password health",
    featQuickShare: "Quick Share (Zero-Knowledge)",
    featTosAi: "TOS AI analysis & anti-phishing",
    featNoEmail: "No email, no account, no tracking",
    featTotp: "TOTP codes (2FA authenticator)",
    featAlias: "Email alias with forwarding",
    featEarlyAccess: "Early access to new features",
    featDocuments: "Secure documents",
    featDocumentsFree: "1 document",
    featDocumentsPremium: "2 documents",
    featDocumentsPro: "5 documents",
    featDocumentsUltimate: "Unlimited",
    featCloudQuota: "Encrypted cloud storage",
    featCloudQuotaFree: "10 MB",
    featCloudQuotaPremium: "1 GB",
    featCloudQuotaPro: "50 GB",
    featCloudQuotaUltimate: "Unlimited*",
    featCloudFileSize: "Max file size",
    featCloudFileSizeFree: "5 MB",
    featCloudFileSizePremium: "25 MB",
    featCloudFileSizePro: "25 MB",
    featCloudFileSizeUltimate: "50 MB",
    featFragmented: "Fragmented vault (3-of-5 Shamir)",
    featSupport: "Priority support",
    featStorage: "Unlimited encrypted storage",
    successTitle: "Payment successful",
    successMessage: "Your license key has been sent to the email address provided.",
    successSpam: "Check your spam folder if you don't see it.",
    activateKey: "Activate key in Settings",
    canceled: "Payment canceled.",
    retry: "Retry",
    licenceTitle: "Subscribe now",
    licenceDesc:
    "Yearly or monthly billing. Encrypted card payment via Stripe. Your license key is emailed after checkout; renewals extend the same key.",
    emailLabel: "Email to receive the key",
    emailPlaceholder: "you@example.com",
    buyBtn: "Subscribe — Secure payment",
    getStarted: "Get started",
    redirecting: "Redirecting to payment…",
    paymentNote: "Stripe subscription. Key sent after payment; renewals update your license end date.",
    backHome: "Back to home",
    emailRequired: "Email required",
    paymentError: "Payment error",
    serverError: "Invalid server response",
    networkError: "Network error",
    proAddon: "VaultKeepR Pro",
    proAddonDesc: "Upgrade to 50 GB of encrypted IPFS cloud storage.",
    ultimateBundle: "VaultKeepR Ultimate",
    ultimateBundleDesc: "Premium + Cloud Unlimited in one bundle. Save €0.49/mo vs buying separately.",
    ultimateSaving: "Save 17%",
    planPremium: "Premium",
    planPremiumPrice: "€2.49/mo",
    planPremiumPriceYearly: "€17.99/yr",
    planPro: "Pro",
    planProPrice: "€3.99/mo",
    planProPriceYearly: "€39.99/yr",
    planProRequires: "Most popular",
    planUltimate: "Ultimate",
    planUltimatePrice: "€6.99/mo",
    planUltimatePriceYearly: "€69.99/yr",
    planUltimateIncludes: "Includes Premium + Cloud Unlimited",
    cryptoTitle: "Pay with crypto",
    cryptoSubtitle: "10% discount with USDC on Polygon",
    cryptoLifetime: "Lifetime",
    cryptoAnnual: "Annual",
    cryptoMonthly: "Monthly",
    cryptoDiscount: "−10%",
    cryptoLifetimeExclusive: "Crypto exclusive"
  },
  onboarding: {
    welcomeTitle: "Welcome to VaultKeepR",
    welcomeBody: "Your zero-knowledge password vault. Everything is encrypted locally — no server ever sees your data.",
    vaultTitle: "Create your vault",
    vaultBody: "Choose how you want to store your passwords:",
    vaultLocal: "Local vault — encrypted on this device only",
    vaultLocalDesc: "Quick access, local storage",
    vaultIpfs: "IPFS sync — encrypted & synced across devices via your wallet",
    vaultIpfsDesc: "Decentralized, access everywhere",
    saveTitle: "Save your first password",
    saveBody: "Log in to any website — VaultKeepR will offer to save your credentials automatically.",
    skip: "Skip",
    next: "Next",
    done: "Let's go!",
    replaySettings: "Replay onboarding",
    step1Title: "Zero Knowledge",
    step1Desc: "Your passwords are encrypted on your device before any sync. No server ever sees your data in plain text.",
    step2Title: "Wallet Login",
    step2Desc: "Access your vault via an embedded Smart Wallet. No email or account password needed.",
    step3Title: "Add your credentials",
    step3Desc: "Click the + button to save a login, identity, or generate a strong password. VaultKeepR also detects forms and offers to save them automatically.",
    step4Title: "IPFS Sync",
    step4Desc: "Your vault is auto-saved after every change. Use this button anytime to force a manual sync to IPFS — your encrypted backup, decentralized and always accessible.",
    step5Title: "Your Vault is Ready",
    step5Desc: "Explore the password generator, breach scanner, and secure sharing. Everything is at your fingertips.",
    start: "Get Started",
    connectCta: "Connect my wallet",
    doNotShowAgain: "Don't show again",
    lockTabsTitle: "Two storage modes",
    lockTabsDesc: "IPFS syncs your encrypted vault across all devices via your wallet. Local keeps it on this device only.",
    lockPasskeyTitle: "One-tap unlock",
    lockPasskeyDesc: "Create your vault in seconds with Face ID, Touch ID, or your device PIN. No password to remember.",
    lockPasswordTitle: "Master password",
    lockPasswordDesc: "Prefer full control? Set a master password — the only key to your vault. Choose it carefully: it cannot be recovered.",
    lockOption1Title: "Option 1 — Passkey (recommended)",
    lockOption1Desc: "One tap with Face ID, Touch ID or your device PIN. No password to remember. Tap the button above to continue.",
    lockOption2Title: "Option 2 — Master password",
    lockOption2Desc: "You keep full control. Set a strong password — it\'s the only key to your vault and cannot be recovered. Fill in the fields above.",
    lockNewVaultTitle: "Create your encrypted vault",
    lockNewVaultDesc: "Your passwords are encrypted locally and never sent anywhere unprotected. Tap the button to get started.",
    landingCreateBtn: "Create my vault",
    landingUnlockBtn: "I already have a vault",
    landingSubtitle: "Your zero-knowledge password vault.",
    landingDeviceSync: "Sync from another device",
    loadingVault: "Loading your vault…",
    loadingVaultDesc: "Checking your encrypted storage",
    welcomeBack: "Welcome back",
    welcomeBackDesc: "Unlock your vault to continue.",
    firstTime: "First time here?",
    advancedOptions: "Advanced options",
    hideAdvanced: "Hide advanced options",
    methodsDivider: "Or use your master password",
    noVaultYet: "No vault on this device yet",
    noVaultYetDesc: "Create one in 30 seconds, or restore an existing one.",
    createVaultIntro: "Pick a method — you can always change later.",
    tabBarTitle: "Your command center",
    tabBarDesc: "Switch between your vault, TOTP codes, tools, secure share, cloud storage, and documents.",
    searchTitle: "Quick Search",
    searchDesc: "Find any credential instantly. Search by name, URL, username, or tag — your vault at your fingertips.",
    primerTitle: "Before you begin",
    primerSubtitle: "VaultKeepR works differently from other password managers. Here are 3 things to know.",
    primerSlide1Title: "No one can recover your data",
    primerSlide1Desc: "There is no server, no 'forgot my password' button. Your passkey or master password is the only key that exists. If you lose it, your data is gone -- unless you set up a recovery method (NFC backup or Shamir Secret Sharing) beforehand.",
    primerSlide2Title: "Your data never leaves your device",
    primerSlide2Desc: "Everything is encrypted right here, on this device. Even the optional IPFS backup is encrypted before it leaves — no one can read it, not even us.",
    primerSlide3Title: "No account. Just you.",
    primerSlide3Desc: "No email, no sign-up. Your identity is your passkey (biometric) or your Ethereum wallet. That's the only thing needed to access your vault.",
    primerQuizTitle: "Let's make sure you got it",
    primerQ1: "If you lose your master password, what happens?",
    primerQ1a1: "VaultKeepR can reset it by email",
    primerQ1a2: "My data is lost permanently",
    primerQ1Wrong: "Incorrect. There is no server or email on VaultKeepR. Your master password or passkey is the ONLY way to decrypt your vault. No one can recover it for you.",
    primerQ2: "Where are your passwords stored?",
    primerQ2a1: "On VaultKeepR's servers",
    primerQ2a2: "Encrypted on my device only",
    primerQ2Wrong: "Incorrect. VaultKeepR has no servers. Your passwords are encrypted and stored locally on your device. The IPFS backup is also encrypted before leaving.",
    primerQ3: "Is the IPFS backup readable by others?",
    primerQ3a1: "Yes, anyone with the link can read it",
    primerQ3a2: "No, it is encrypted before leaving my device",
    primerQ3Wrong: "Incorrect. Your IPFS backup is fully encrypted on your device before it is uploaded. Even if someone finds it, they cannot read it without your key.",
    primerQ4: "How do you create an account on VaultKeepR?",
    primerQ4a1: "With an email and password like any other app",
    primerQ4a2: "There is no account -- just a passkey or wallet",
    primerQ4Wrong: "Incorrect. VaultKeepR has no accounts, no emails, no sign-up. Your identity is your passkey (biometric) or your Ethereum wallet.",
    primerAllCorrect: "You're all set.",
    primerContinue: "Create my vault",
    primerIUnderstand: "I understand the risks, continue"
  },
  saveBanner: {
    loginFormDetected: "Login form detected",
    saveCredentials: "Save these credentials",
    fillFormFirst: "Fill the login form first.",
    cannotCollect: "Unable to collect credentials"
  },
  passwordFeedback: {
    tooShort: "Password is too short",
    addUppercase: "Add uppercase letters",
    addLowercase: "Add lowercase letters",
    addNumbers: "Add numbers",
    addSpecialChars: "Add special characters",
    avoidRepeated: "Avoid repeated characters",
    useMultipleTypes: "Use multiple character types",
    veryWeak: "Very weak password"
  },
  passwordHealth: {
    noEntries: "No credentials to analyze.",
    noEntriesHint: "Add entries to your vault to see the health report.",
    vaultHealth: "Vault Health",
    scoreGood: "Good security level! A few improvements are still possible.",
    scoreFair: "Fair security level. Strengthen your weak passwords.",
    scoreWeak: "Insufficient security. Several passwords need to be changed.",
    scoreCritical: "Critical security. Change your weakest passwords immediately.",
    statCritical: "Critical",
    statWeak: "Weak",
    statFair: "Fair",
    statStrong: "Strong",
    statReused: "Reused",
    filterAll: "All",
    filterReused: "Reused",
    showAll: "Show all",
    issueEmpty: "Empty password",
    issueTooShort: "Too short (< 8 characters)",
    issueNoCharTypes: "Not enough character types",
    issueNoDigitSymbol: "No digit or symbol",
    issueRepeated: "Too many repeated characters",
    issueCommon: "Common password (known leak)",
    issueSingleChar: "Single repeated character",
    issueSequence: "Predictable sequence",
    issueReused: "Reused on {count} other site(s)",
    issueOld: "Old password ({months} months)",
    statExpired: "Expired",
    filterExpired: "Expired",
    statTwoFactorMissing: "2FA Missing",
    filterTwoFactorMissing: "2FA Missing",
    statUnsecureWebsites: "Unsecure",
    filterUnsecureWebsites: "Unsecure",
    issueTwoFactorMissing: "Two-factor authentication not set up",
    issueUnsecureUrl: "Site does not use HTTPS"
  },
  commandPalette: {
    searchPlaceholder: "Search a site, login, note... (Ctrl+K)",
    noResults: "No results for",
    open: "Open",
    navigateWith: "Navigate with",
    selectWith: "Select with",
    results: "results",
    bankCard: "Credit Card",
    noteLabel: "Note",
    untitled: "Untitled",
    noResultsFound: "No results for \"{query}\"",
    typeToSearch: "Type to search…",
    resultsCount: "{count} result",
    resultsCountPlural: "{count} results",
    copyPassword: "Copy password",
    copyUsername: "Copy username",
    openUrl: "Open URL",
    shortcutNavigate: "navigate",
    shortcutOpen: "open",
    shortcutClose: "close"
  },
  socialProof: {
    sectionBadge: "Proven Security",
    sectionTitle: "Built for people who take security seriously",
    sectionSubtitle: "Enterprise-grade encryption with zero complexity. Your credentials, your keys, your rules.",
    stat1Value: "496",
    stat1Label: "Cryptographic tests passed (0 failures)",
    stat2Value: "0 B",
    stat2Label: "Personal metadata collected on servers",
    stat3Value: "XChaCha20",
    stat3Label: "Constant-time AEAD client-side encryption",
    stat4Value: "ERC-4337",
    stat4Label: "Smart accounts with no external wallet needed",
    techTitle: "Built with proven, audited technologies",
    testimonialTitle: "Open source, built to be verified",
    testimonial1Text: "The source code is fully open and auditable on GitHub — no claim we make is hidden behind a proprietary build.",
    testimonial1Author: "VaultKeepR Team",
    testimonial1Role: "Public source repository",
    testimonial2Text: "Cryptography runs entirely on your device with Argon2id key derivation and XChaCha20-Poly1305 — no server ever sees your master secret.",
    testimonial2Author: "VaultKeepR Team",
    testimonial2Role: "Client-side cryptography",
    testimonial3Text: "No email, no account, no central database. Your vault is encrypted locally and synchronized peer-to-peer, so there is no honeypot to breach.",
    testimonial3Author: "VaultKeepR Team",
    testimonial3Role: "Zero-knowledge architecture"
  },
  passkey: {
    folder: "Passkeys",
    savePromptTitle: "Save this passkey?",
    savePromptBody: "Store this passkey for {{rpName}} ({{userName}}) in VaultKeepR",
    saveButton: "Save Passkey",
    useNative: "Use browser instead",
    authPromptTitle: "Sign in with passkey",
    authPromptBody: "Choose a passkey for {{rpName}}",
    noPasskeys: "No passkeys stored for this site",
    counter: "Usage count",
    credentialId: "Credential ID",
    rpId: "Site",
    created: "Created",
    lastUsed: "Last used",
    deleteConfirm: "Delete this passkey? You won't be able to sign in with it anymore.",
    vaultLocked: "Unlock VaultKeepR to use passkeys",
    providerActive: "Passkey Provider Active",
    providerDescription: "VaultKeepR can store and use passkeys for compatible websites.",
    noEnrollment: "No passkey enrolled",
    unlockFailed: "Passkey unlock failed",
    biometricFailed: "Biometric verification failed",
    fingerprint: "Fingerprint",
    touchId: "Touch ID",
    faceId: "Face ID",
    windowsHello: "Windows Hello",
    securityKey: "Security Key",
    notSupported: "WebAuthn not supported",
    enrollmentCancelled: "Enrollment cancelled",
    cancelledByUser: "Cancelled by user",
    enrollmentFailed: "Enrollment Failed",
    label: "Passkey",
    syncPrompt: "Do you already have a Passkey account (e.g. synced via iCloud/Google)?\n\n- OK: Login to existing account\n- Cancel: Create new Passkey account",
    notFoundOrCancelled: "No Passkey found or cancelled.",
    creating: "Creating Passkey...",
    createdToast: "Passkey created!",
    passkeyCreateSuccess: "Passkey configured successfully! Migrating vault...",
    passkeyPrfError: "Your device does not support the PRF extension required to secure the vault.",
    goPasswordlessTitle: "Go Passwordless (Account Abstraction)",
    goPasswordlessDesc: "Secure your account with a Passkey (FaceID / TouchID). You will never need to type your password again, and your Web3 identity will be managed by a Smart Contract."
  },
  backupPassword: {
    title: "Backup Password",
    description: "Recover your vault if Touch ID / Face ID is lost",
    recommended: "Recommended",
    warning: "Without a backup password, losing your authenticator (Touch ID / Face ID) will make your vault unrecoverable.",
    set: "Set a backup password",
    change: "Change backup password",
    remove: "Remove backup password",
    setSuccess: "Backup password configured",
    removed: "Backup password removed",
    recover: "Backup password",
    incorrect: "Backup password incorrect.",
    notConfigured: "No backup password configured.",
    unlockHint: "Enter your backup password to recover the vault"
  },
  reUnlock: {
    title: "Re-authenticate",
    body: "Your background session was reset. Re-authenticate to restore your identity and account abstraction.",
    biometric: "Use biometric",
    usePassword: "Use password",
    later: "Later",
    unlock: "Unlock",
    passwordPlaceholder: "Master password"
  },
  syncBanner: {
    unlockExpired: "Session expired. Please unlock again to sync.",
    expired: "IPFS Sync expired. Turn it back on to keep devices synced.",
    expiringSoon: "Sync expires in {time}",
    renew: "Renew"
  },
  securityBadge: {
    title: "Security Badge"
  },
  dapps: {
    title: "dApps & Approvals",
    settingsDesc: "Track your dApp connections and token approvals",
    dappsTracked: "dApps tracked",
    totalVisits: "total visits",
    noVisits: "No dApp visits recorded",
    noVisitsHint: "Browse crypto dApps and they'll appear here automatically",
    visits: "visits",
    refresh: "Refresh",
    revokeApprovals: "Revoke approvals on revoke.cash",
    clearHistory: "Clear history",
    confirmClear: "Confirm",
    connectWallet: "Connect a wallet first",
    connectWalletHint: "Link your wallet in Settings to scan on-chain approvals",
    scanning: "Scanning on-chain approvals…",
    scanningHint: "Checking Ethereum mainnet via Etherscan",
    retry: "Retry",
    noApprovals: "No active approvals found",
    noApprovalsHint: "Your wallet has no token approvals on Ethereum mainnet",
    rescan: "Scan again",
    unlimitedApprovals: "unlimited approval(s)",
    allSafe: "All approvals are limited",
    totalApprovals: "active approval(s)",
    revokeAdvice: "Consider revoking unused ones",
    revoke: "Revoke"
  },
  secureDocuments: {
    title: "Secure Documents",
    subtitle: "Encrypted & fragmented storage",
    addDocument: "Add document",
    limitReached: "Maximum 10 documents reached",
    typeCni: "National ID Card",
    typePassport: "Passport",
    typePermit: "Driver's License",
    typeRib: "Bank Details (RIB)",
    typeInsurance: "Insurance Card",
    typeOther: "Other Document",
    reveal: "Reveal",
    revealed: "Revealed",
    revealHint: "Authenticate to view this document",
    autoHide: "Auto-hides in {seconds}s",
    encrypting: "Encrypting…",
    fragmenting: "Uploading fragment {n}/{total}…",
    saved: "Document saved securely",
    deleteConfirm: "Delete this document permanently?",
    deleteWarning: "Encrypted fragments will be removed from IPFS.",
    deleted: "Document deleted",
    ocrProcessing: "Analyzing document…",
    ocrName: "Full Name",
    ocrNumber: "Document Number",
    ocrExpiry: "Expiry Date",
    premiumRequired: "Premium required to use Secure Documents",
    captureCamera: "Take photo",
    captureCameraSub: "Scan your document directly",
    captureImport: "Import from gallery",
    captureFiles: "Files",
    chooseType: "Choose Document Type",
    chooseTypeDesc: "Select the type of document you want to scan and secure.",
    emptyState: "No secured documents yet",
    emptyStateHint: "Add your ID card, passport or driving license in an ultra-secure local vault.",
    fileTooLarge: "File must be under 5MB",
    saveError: "Error saving document",
    revealImage: "Reveal specific image",
    view: "View",
    metadata: "Metadata",
    size: "Size",
    added: "Added",
    chunks: "Chunks",
    backToTypes: "Back to types",
    labelPlaceholder: "Document Name",
    documentName: "Document Name",
    manualInfo: "Manual Info (Web OCR limited)",
    saveSecure: "Save Secure Document",
    premiumFeature: "Premium Feature",
    premiumDesc: "Secure documents are encrypted and fragmented using XChaCha20-Poly1305. Upgrade to premium to store up to {MAX_SECURE_DOCUMENTS} documents.",
    maxSizeHint: "Maximum file size: 5MB",
    documentCount: "{count}/10 documents",
    downloading: "Downloading fragments…",
    noInternet: "Internet connection required to reveal documents",
    formatPrompt: "What is the document format?",
    formatNew: "New Format (With Chip)",
    formatNewSub: "Credit card size or biometric passport",
    formatOld: "Old Format (No Chip)",
    formatOldSub: "Old paper or laminated format",
    captureVersoHint: "Capture the back of the document.",
    mrzTargetHint: "Aim the MRZ band here",
    nfcScanFirst: "Please scan the document (MRZ) first to get the number.",
    nfcScanLoading: "NFC reading in progress...",
    nfcScanVerify: "Verify identity via NFC",
    ocrBirthDateReq: "Date of Birth (Required for NFC)",
    ocrPhotoExtracted: "✓ Secure Photo Extracted",
    encryptingNfcPhoto: "Encrypting NFC photo...",
    uploadNfcPhoto: "Uploading NFC photo ({current}/{total})...",
    nfcSuccessTitle: "Legal Identity (NFC)",
    nfcSuccessMsg: "The chip has been authenticated. Data saved.",
    nfcErrorTitle: "NFC Error",
    nfcErrorMsgNoChip: "Reading could not be completed. Ensure your document has an NFC chip.",
    nfcErrorMsgKeep: "Reading could not be completed. Ensure you hold the document still.",
    decrypting: "Decrypting..."
  },
  cloud: {
    title: "Cloud",
    emptyTitle: "Your Cloud is empty",
    emptySub: "Upload encrypted files securely.",
    unlockRequired: "Please unlock your vault to encrypt this file.",
    errorTooLarge: "The file is too large (25 MB max).",
    sending: "Sending to Cloud...",
    uploadingProgress: "Upload {current}/{total}",
    uploadError: "Error during upload.",
    fileDetail: "File Details",
    share: "Share",
    shareFile: "Share a file",
    security: "Security",
    modePrivate: "Private",
    modePrivateSub: "PIN required",
    modePublic: "Public",
    modePublicSub: "Direct link",
    folders: "Folders",
    createFolder: "New folder",
    createFolderHint: "Enter folder name",
    allFiles: "All files",
    upload: "Upload",
    download: "Download",
    downloading: "Downloading...",
    downloadingProgress: "Download {current}/{total}",
    viewDocument: "Preview Document",
    shareSecureLink: "Share Secure Link",
    fileNotFound: "File not found",
    decrypting: "Decrypting...",
    deleteConfirm: "Delete this file permanently?",
    sortBy: "Sort by",
    sortByDate: "By Date",
    sortByName: "By Name",
    sortBySize: "By Size",
    files: "files",
    photos: "Photos",
    documents: "Documents",
    empty: "No files yet",
    emptyStateHint: "Upload your first file to get started.",
    originalSize: "Original size",
    addedAt: "Added",
    description: "Description",
    uploading: "Uploading...",
    zeroKnowledge: "Zero-Knowledge Encryption · IPFS Fragmentation",
    encryptingData: "Securing your data...",
    ipfsTransfer: "IPFS Transfer:",
    expiration: "Expiration",
    privacy: "Privacy",
    private: "Private",
    public: "Public",
    fileName: "Name",
    fileSize: "Size",
    premiumRequired: "Premium required"
  },
  share: {
    title: "Secure Share",
    createTitle: "Create Secure Share",
    pinLabel: "Security PIN",
    pinHint: "Send this PIN via a separate channel (SMS, Signal, etc.)",
    ttl1h: "1 Hour",
    ttl24h: "24 Hours",
    ttl7d: "7 Days",
    ttlEphemeral: "Ephemeral",
    ttlStandard: "Standard",
    ttlLongTerm: "Long-term",
    maxViews: "Max views",
    unlimited: "Unlimited",
    includeTotp: "Include TOTP code",
    generating: "Generating secure share...",
    linkReady: "Share Link Ready",
    copyLink: "Copy Link",
    copyPin: "Copy PIN",
    shareVia: "Share via...",
    receiveTitle: "Secure Share",
    receiveEnterPin: "Enter the PIN code to decrypt.",
    receiveDecrypting: "Decrypting...",
    receiveExpired: "This share has expired or been revoked.",
    receiveMaxViewsReached: "This share has reached its view limit.",
    receiveInvalidPin: "Invalid PIN code.",
    receiveAddToVault: "Add to Vault",
    receiveDownload: "Download File",
    receiveAutoClearing: "Auto-clearing in {seconds}s",
    fileLabel: "File",
    fileDragDrop: "Drag and drop a file or click to select",
    fileMaxSize: "Max size: 5MB",
    noteLabel: "Secure Note",
    credentialsLabel: "Credentials",
    zkBadge: "Encrypted locally \u00b7 PIN required \u00b7 Zero-Knowledge",
    zkHint: "The server only sees an encrypted blob. Decryption happens in the recipient\u2019s browser only.",
    pinChannelHint: "Never send the link and PIN through the same channel",
    successTitle: "Share created successfully",
    successSub: "Encrypted locally \u00b7 Zero-Knowledge",
    expiration: "Expiration",
    maxViewsLabel: "Max views",
    generateLink: "Generate secure link",
    shareViaNative: "Share via iOS\u2026",
    paramError: "Parameter error",
    decryptContent: "Decrypt content",
    hasPinQuestion: "Do you have the PIN?",
    hasPinBody: "To decrypt this share without the server seeing it, the PIN received from the sender is required.",
    decryptedSuccess: "Decrypted successfully",
    decryptedZkSub: "Client-side \u00b7 Zero-Knowledge",
    decryptedZkHint: "This data was decrypted on your device only. It never transited in plaintext.",
    autoDestructed: "The share has self-destructed.",
    unsupportedType: "This type is not yet supported for sharing.",
    viewCountLabel: "View {current} of {max}",
    messageLabel: "Personal message (optional)",
    messagePlaceholder: "Add a message visible after decryption…",
    quickShareTitle: "Secure Share",
    contentType: "CONTENT TYPE",
    typeLink: "Link",
    typeNote: "Note",
    typeFile: "File",
    generate: "Generate secure link",
    premiumOnly: "Premium feature",
    premiumOnlyDesc: "Standalone secure sharing (link, note, file) is reserved for Premium members.",
    linkRequired: "URL is required.",
    noteRequired: "Note is empty.",
    fileRequired: "Please select a file.",
    linkTitlePlaceholder: "Title (optional)",
    noteTitlePlaceholder: "Title (optional)",
    noteContentPlaceholder: "Note content…",
    fileDropHint: "Drag or click to select — 50 MB max",
    createAnother: "New share",
    messageSender: "Message from sender",
    openLink: "Open link",
    fieldUrl: "URL",
    fieldUsername: "Username",
    fieldPassword: "Password",
    fieldTotp: "TOTP Secret",
    fieldFileName: "File name",
    receiveInvalidLink: "Invalid or expired link (missing key).",
    receiveFileNotFound: "File not found.",
    receiveUnsupportedType: "File type not supported by this link.",
    receiveLoadError: "Loading error.",
    receiveDownloadError: "Download error. The file might be unavailable on the IPFS network.",
    receiveLoadingPublic: "Loading public share...",
    receiveDownloadingIpfs: "Downloading (IPFS)...",
    receiveZkFooter: "End-to-End Encrypted File \u00b7 Local decryption only",
    fileTooLarge: "File too large"
  },
  pair: {
    title: "Device Sync",
    receive: "Receive",
    send: "Send",
    sendTitle: "Send to mobile",
    sendScanInstructions: "Scan this QR from VaultKeepR on your phone to receive the vault",
    sendSuccess: "Vault sent successfully!",
    receiveFromPhone: "Receive from phone",
    sendToDevice: "Send to device",
    scanInstructions: "Scan this QR from VaultKeepR on your phone (Settings > Device Sync)",
    waitingForDevice: "Waiting for connection...",
    expiresIn: "Expires in {{time}}",
    confirmSend: "Send vault?",
    confirmSendDesc: "Your encrypted vault will be securely sent to the other device.",
    sendVault: "Send vault",
    transferring: "Transferring...",
    success: "Vault synced successfully!",
    expired: "Session expired.",
    retry: "Generate new QR",
    error: "Transfer error: {{message}}",
    openQr: "QR Code",
    scanHint: "Scan a VaultKeepR QR code",
    receiveTitle: "Receive from Web",
    receiveScanInstructions: "Scan this QR from VaultKeepR on your computer or extension",
    sendInstructions: "Paste the pairing URI shown on the other device.",
    accepting: "Connecting...",
    waitingForVault: "Waiting for vault...",
    importing: "Importing vault...",
    encrypting: "Encrypting and sending..."
  },
  security: {
    passwordHealth: "Password Health",
    passwordHealthDesc: "Audit the strength of your passwords",
    breachScanner: "Breach Scanner",
    breachScannerDesc: "Check if your credentials have been compromised"
  },
  legacy: {
    title: "Digital Legacy",
    description: "Designate beneficiaries who can access your vault after a period of inactivity.",
    setup: "Set Up Legacy",
    setupDescription: "Configure your digital legacy with beneficiaries and an inactivity delay.",
    status: "Legacy Status",
    beneficiaries: "Beneficiaries",
    addBeneficiary: "Add Beneficiary",
    removeBeneficiary: "Remove",
    beneficiaryAddress: "Smart Account Address",
    beneficiaryLabel: "Label (optional)",
    delay: "Inactivity Delay",
    delayDescription: "Time without heartbeat before legacy triggers (30 days to 2 years).",
    gracePeriod: "Grace Period",
    gracePeriodDescription: "Additional time after delay expires before beneficiaries can claim (3 to 30 days).",
    heartbeat: "Heartbeat",
    lastHeartbeat: "Last Heartbeat",
    sendHeartbeat: "Send Heartbeat Now",
    daysRemaining: "days remaining",
    expired: "Expired",
    claimable: "Claimable",
    claimed: "Claimed",
    active: "Active",
    inactive: "Inactive",
    revoke: "Revoke Legacy",
    revokeConfirm: "Are you sure you want to revoke your digital legacy? Beneficiaries will no longer be able to claim your vault.",
    revokeDescription: "Permanently deactivate your digital legacy. No notification will be sent to beneficiaries.",
    qrScan: "Scan QR Code",
    pasteAddress: "Paste Address",
    inviteLink: "Generate Invite Link",
    inviteLinkCopied: "Invite link copied to clipboard",
    incomingTitle: "Incoming Legacies",
    incomingDescription: "Vaults you have been designated as a beneficiary for.",
    claimButton: "Claim Legacy",
    claimSuccess: "Legacy claimed successfully. You now have access to the vault.",
    premiumRequired: "Premium Required",
    premiumRequiredDescription: "Digital Legacy is available on Premium, Pro, and Ultimate plans.",
    days: "days",
    activate: "Activate Legacy",
    activateConfirm: "Activate your digital legacy? Your vault will be accessible to beneficiaries after the configured inactivity period.",
    errorTooManyBeneficiaries: "Maximum 5 beneficiaries allowed.",
    errorInvalidDelay: "Delay must be between 30 days and 2 years.",
    errorAlreadyActive: "A legacy is already active. Revoke it first.",
    errorNotClaimable: "This legacy is not claimable yet.",
    errorNotBeneficiary: "You are not a beneficiary of this legacy.",
    errorAlreadyClaimed: "This legacy has already been claimed.",
    statusGreen: "All good — heartbeat is recent.",
    statusYellow: "Warning — heartbeat is getting old.",
    statusRed: "Critical — legacy will trigger soon.",
    contactEmail: "Email",
    contactTelegram: "Telegram username",
    contactAddress: "Smart Account address",
    contactRequired: "At least one contact method is required",
    statusPending: "Pending",
    statusConfirmed: "Confirmed",
    inviteSent: "Invitation sent",
    inviteEmailSubject: "You've been designated as a digital legacy beneficiary",
    telegramBotRequired: "The beneficiary must message @VaultKeepRBot on Telegram first",
    errorSmartAccountNotReady: "Your Smart Account is not ready yet.",
    errorActivation: "An error occurred during activation.",
    errorRevocation: "An error occurred during revocation.",
    heartbeatCooldown: "A heartbeat was recently sent. Cooldown is active."
  },
  contentScript: {
    card: {
      title: "Payment",
      empty: "No card saved for this site"
    },
    passkey: {
      title: "Choose a passkey",
      subtitle: "Sign in with a passkey for {0}",
      empty: "No passkey available for this site",
      use: "Use"
    },
    changePassword: {
      title: "Change password",
      current: "Use current",
      generate: "Generate new"
    },
    generator: {
      title: "Password generator",
      generatedPassword: "Generated password",
      length: "Length",
      regenerate: "Regenerate",
      fill: "Fill",
      copy: "Copy",
      copied: "Copied",
      show: "Show",
      hide: "Hide",
      uppercase: "Uppercase",
      lowercase: "Lowercase",
      numbers: "Numbers",
      symbols: "Symbols",
      strength: {
        weak: "Weak",
        medium: "Medium",
        strong: "Strong"
      },
      noFocusedField: "Focus a field to fill the generated password"
    },
    identity: {
      title: "Choose an identity",
      analyzing: "Analyzing…",
      empty: "No identities saved for this site"
    },
    locked: {
      title: "Vault locked",
      body: "Unlock the extension to use your saved credentials."
    },
    login: {
      title: "Sign in",
      generate: "Generate password",
      noMatch: "No matching credential for this site",
      noName: "Unnamed",
      update: "Update",
      alias: "Use alias + password",
      aliasPremium: "Email alias requires Premium",
      aliasLocked: "Unlock the extension to create an alias",
      aliasError: "Could not create alias",
      aliasAddLicenseKey: "Add license key",
      search: "Search…"
    },
    phishing: {
      title: "Suspicious site",
      understood: "I understand"
    },
    savePrompt: {
      newTitle: "Save password?",
      save: "Save",
      generate: "Generate & save",
      update: "Update",
      updateTitle: "Update password?",
      username: "Username",
      password: "Password",
      chooseEntry: "Update which entry?",
      neverForSite: "Never for this site"
    },
    signup: {
      title: "Sign up",
      generate: "Generate password",
      alias: "Create alias + password",
      aliasPremium: "Email alias requires Premium",
      aliasLocked: "Unlock the extension to create an alias",
      aliasError: "Could not create alias",
      aliasAddLicenseKey: "Add license key"
    },
    toast: {
      generated: "Generated",
      saved: "Credentials saved",
      updated: "Credentials updated",
      filled: "Filled",
      saveError: "Could not save — try again"
    },
    tos: {
      title: "Terms of Service analysis",
      loading: "Analyzing terms of service…",
      error: "Could not analyze terms of service.",
      resultHeader: "Analysis complete",
      dataSharingSafe: "No obvious data sharing detected",
      dataSharingDanger: "This site may share your data with third parties",
      deletionSafe: "Account deletion appears to be available",
      deletionWarning: "Account deletion may be difficult",
      riskLabel: "Risk score",
      basicModeHint: "Basic analysis (offline mode)",
      closeClause: "Quoted clauses",
      trackingSafe: "No obvious cross-site tracking",
      trackingDanger: "Cross-site tracking / behavioural profiling detected",
      arbitrSafe: "No mandatory arbitration clause",
      arbitrDanger: "Binding arbitration clause present",
      unilateralSafe: "Terms appear stable",
      unilateralDanger: "Unilateral changes to terms are permitted",
      liabilitySafe: "No excessive liability limitation",
      liabilityDanger: "Limited liability / no-warranty clause present"
    },
    totp: {
      title: "Two-factor code",
      fill: "Fill",
      copy: "Copy",
      noCode: "No 2FA code saved for this site",
      hintBody: "Open a 2FA setup page to add a code"
    }
  },

  enterprise: {
    espacePersonal: "Personal",
    espaceOrg: "Organisation",
    leaveOrgMode: "Leave",
    leaveOrgModeTitle: "Leave Organisation mode (PRO keys are evicted from memory, personal vault stays unlocked)",
    sharedVaults: "Shared vaults",
    noVaults: "No organisation vault.",
    entries: "entries",
    entryCount: "entry(ies)",
    refresh: "Refresh",
    loading: "Loading…",
    joinOrg: {
      title: "Join my organisation",
      subtitle: "Enter your work email. If your domain is registered, the IT admin will receive your access request.",
      emailLabel: "Work email",
      submit: "Request to join",
      submitting: "Sending…",
      successTitle: "Request sent.",
      successBody: "Your request to join",
      successBody2: "is pending approval. The IT admin must validate your access in the console, then you will receive an invitation.",
      errorEmail: "Invalid email",
      errorSign: "Signature failed",
      noIdentity: "You must first create your vault to derive your identity (AA). Your signature will prove who you are.",
      createVaultBtn: "Create my vault",
      zkNote: "Your signature proves your identity without revealing your private key. The email is stored by domain only."
    },
    team: {
      title: "Team — Crypto tasks",
      noTasks: "No pending task. The IT admin can manage members from the dashboard.",
      execute: "Execute",
      executing: "Executing…",
      done: "Successfully executed",
      invite: "Invite a member",
      rekey: "Key rotation (revocation)",
      resign: "Re-sign manifest",
      consoleLink: "dashboard",
      zkNote: "These tasks cryptographically harden admin actions (key rotation, envelope creation). Access is already cut server-side immediately after revocation."
    }
  }
};

export const fr: Translations = {
  common: {
    save: "Enregistrer",
    cancel: "Annuler",
    loading: "Chargement",
    sync: "Synchroniser",
    unlock: "Déverrouiller",
    lock: "Verrouiller",
    wallet: "Wallet",
    walletCaps: "WALLET",
    connect: "Connecter",
    disconnect: "Déconnecter",
    back: "Retour",
    view: "Voir",
    see: "Voir",
    hide: "Masquer",
    details: "Détails",
    error: "Erreur",
    errorOccurred: "Une erreur est survenue. Veuillez réessayer.",
    success: "Succès",
    copy: "Copier",
    copied: "Copié !",
    close: "Fermer",
    mainNav: "Navigation principale",
    apply: "Appliquer",
    clear: "Effacer",
    import: "Importer",
    export: "Exporter",
    search: "Rechercher",
    add: "Ajouter",
    more: "Plus",
    newEntry: "Nouvelle entrée",
    masterPassword: "Mot de passe maître",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    passwordStrength: "Force",
    weak: "Faible",
    medium: "Moyen",
    strong: "Fort",
    generate: "Générer",
    restore: "Restaurer",
    configure: "Configurer",
    next: "Suivant",
    chooseFile: "Choisir un fichier",
    delete: "Supprimer",
    edit: "Modifier",
    deleteConfirm: "Voulez-vous vraiment supprimer cet élément ?",
    noName: "Sans nom",
    all: "Tout",
    demoUser: "Utilisateur Démo",
    demoCard: "Carte Démo",
    demoLogin: "Connexion Démo",
    demoNote: "Note Démo",
    demoPasskey: "Passkey Démo",
    hour: "h",
    minute: "min",
    backupTitle: "Sauvegarde VaultKeepR",
    yearShort: "an",
    monthShort: "mois",
    revoke: "Révoquer",
    saved: "Enregistré",
    tapToCopy: "Appuyez pour copier",
    ok: "OK",
    premium: "Premium",
    or: "OU",
    optional: "Optionnel",
    recommended: "Recommandé",
    ipfsSync: "Sync IPFS",
    featurePillNoAccount: "Aucun compte requis",
    featurePillEncryption: "Chiffrement militaire",
    featurePillMultiDevice: "Sync multi-appareils",
    create: "Cr\u00e9er",
    importTitle: "Importer depuis un autre gestionnaire",
    importDesc: "Bitwarden, Chrome, 1Password, LastPass, ProtonPass, Dashlane...",
    importBtn: "S\u00e9lectionner un fichier (.csv / .json)",
    importSuccess: "Import r\u00e9ussi",
    importSuccessDesc: "{count} entr\u00e9es import\u00e9es dans votre coffre.",
    importNoEntries: "Aucune entr\u00e9e trouv\u00e9e dans ce fichier.",
    importFormats: "Supporte CSV, JSON, 1Password PIF, PGP chiffr\u00e9",
    importModalTitle: "{count} entr\u00e9es d\u00e9tect\u00e9es",
    importModalDesc: "Choisissez comment prot\u00e9ger votre nouveau coffre :",
    importModalBiometric: "Cr\u00e9er avec biom\u00e9trie",
    importModalPassword: "Cr\u00e9er avec un mot de passe",
    importVaultDetected: "Sauvegarde VaultKeepR d\u00e9tect\u00e9e",
    importEnterOldPassword: "Entrez le mot de passe ma\u00eetre utilis\u00e9 pour cette sauvegarde :",
    show: "Afficher",
    filter: "Filtrer",
    retry: "Réessayer",
    hideDetails: "Masquer les détails",
    showDetails: "Afficher les détails"
  },
  settings: {
    title: "Paramètres",
    menuAccess: "Accès & Sécurité",
    menuSync: "Sync & Données",
    menuAccount: "Compte & Premium",
    menuAdvanced: "Avancé & Outils",
    language: "Langue",
    theme: "Thème",
    themeDark: "Sombre",
    themeLight: "Clair",
    themeSystem: "Système",
    lockVault: "Verrouiller le Vault",
    sessionDuration: "Durée de session",
    persistSession: "Garder la session après le redémarrage de l'arrière-plan",
    persistSessionDesc: "Répliquer votre mot de passe maître dans le stockage de session de l'extension afin que l'identité / l'abstraction de compte restent fonctionnelles après un redémarrage de l'arrière-plan. Désactivez pour une sécurité stricte en mémoire uniquement.",
    premium: "Premium",
    sessionDurationClose: "Jusqu'à fermeture de l'onglet",
    sessionDuration1h: "1 heure",
    sessionDuration24h: "24 heures",
    sessionDuration7d: "7 jours",
    sessionDuration30d: "30 jours",
    syncFrequency: "Fréquence de synchronisation en arrière-plan",
    syncFrequencyDesc: "Fréquence de vérification des changements inter-appareils. Désactivé/manuel supprime le contact en arrière-plan.",
    syncFrequencyOff: "Désactivé",
    syncFrequency1m: "Toutes les 1 minute",
    syncFrequency5m: "Toutes les 5 minutes",
    syncFrequency15m: "Toutes les 15 minutes",
    syncFrequencyManual: "Manuel uniquement",
    appearance: "Apparence",
    privacy: "Confidentialite",
    privacyDesc: "Controlez l'exposition des donnees et le consentement",
    tosAnalysis: "Analyse des conditions d'utilisation",
    tosAnalysisDesc: "Analyse les pages CGU / confidentialité des sites visités. S'exécute localement sur votre appareil. Désactivé par défaut.",
    sessionDescription: "Durée pendant laquelle vous restez déverrouillé après un rechargement de page. La session est toujours supprimée à la fermeture de l'onglet.",
    unlockDelegationDuration: "Cache signature wallet",
    unlockDelegationDescription: "Durée de conservation de la signature de déverrouillage. Pas de re-signature avant expiration.",
    unlockDelegation24h: "24 heures",
    unlockDelegation7d: "7 jours",
    unlockDelegation14d: "14 jours",
    unlockDelegation30d: "30 jours",
    unlockDelegationStatusNone:
    "Aucune signature de déverrouillage en cache — le wallet pourra être sollicité à la prochaine action v3 (chiffrement / sync).",
    unlockDelegationStatusExpired:
    "La signature de déverrouillage en cache a expiré — une nouvelle signature pourra être demandée.",
    unlockDelegationStatusUntil: "Signature de déverrouillage valide jusqu’au",
    unlockDelegationStatusOtherWallet:
    "Une signature est en cache pour une autre adresse wallet — connectez le bon wallet ou déverrouillez à nouveau depuis IPFS.",
    clearCache: "Vider le cache CID",
    clearCacheInProgress: "En cours…",
    about: "À propos",
    resetVault: "Réinitialiser le vault",
    resetVaultDescription: "Supprime toutes les données locales du vault (sauvegarde, session, délégations). Vous devrez déverrouiller à nouveau ou charger depuis IPFS.",
    resetVaultConfirm: "Toutes les données locales du vault seront définitivement supprimées. Continuer ?",
    resetVaultInProgress: "Réinitialisation…",
    dangerZone: "Zone dangereuse",
    deduplicateVault: "Supprimer les doublons",
    deduplicateDescription: "Analyse toutes les entrées et supprime les doublons exacts. Les entrées d'origine sont conservées.",
    deduplicateConfirm: "Supprimer tous les doublons du coffre ?",
    deduplicateResult: "{count} doublon(s) supprimé(s).",
    unpinIpfs: "Détacher d'IPFS",
    unpinIpfsDescription: "Supprime le CID du coffre du registre IPFS. Votre coffre local n'est pas affecté.",
    unpinIpfsConfirm: "Détacher le coffre d'IPFS ? Vos données locales resteront intactes.",
    deleteAllData: "Supprimer toutes les données",
    deleteAllDataDescription: "Supprime définitivement toutes les données locales ET votre coffre chiffré d'IPFS. Cette action est irréversible.",
    deleteAllDataStep1Title: "Tapez la phrase de confirmation",
    deleteAllDataStep1Hint: "Tapez exactement la phrase suivante pour continuer :",
    deleteAllDataConfirmPhraseFr: "Je confirme vouloir supprimer toutes mes données",
    deleteAllDataConfirmPhraseEn: "I confirm I want to delete all my data",
    deleteAllDataStep2Title: "Vérification par email",
    deleteAllDataEmailLabel: "Email de vérification",
    deleteAllDataEmailPlaceholder: "votre@email.com",
    deleteAllDataSendCode: "Envoyer le code",
    deleteAllDataCodeSent: "Code envoyé à {email}",
    deleteAllDataCodePlaceholder: "Code à 6 chiffres",
    deleteAllDataVerify: "Tout supprimer",
    deleteAllDataDeleting: "Suppression…",
    deleteAllDataSuccess: "Toutes les données ont été définitivement supprimées.",
    deleteAllDataError: "Une erreur est survenue. Veuillez réessayer.",
    deleteAllDataNoWallet: "Connectez d'abord votre wallet.",
    importLabel: "Importer",
    importDescription:
    "Importez votre coffre depuis une autre app. Pris en charge : JSON Bitwarden (non chiffré), JSON Proton Pass, VaultKeepR, 1PIF 1Password, CSV (plusieurs fournisseurs), PGP. Non pris en charge : export Bitwarden chiffré, fichier .1pux 1Password.",
    importFormats:
    "JSON Bitwarden, JSON Proton Pass, JSON VaultKeepR, CSV (LastPass, Chrome, 1Password…), 1PIF (1Password), PGP",
    importPgpHint: "Passphrase PGP pour déchiffrer le fichier :",
    importVaultPasswordHint: "Mot de passe maître Vault Keeper :",
    exportLabel: "Exporter",
    exportDescription: "Exportez votre coffre. Déverrouillez le coffre d'abord, puis revenez ici pour exporter.",
    exportPlain: "JSON (clair)",
    exportEncrypted: "JSON (chiffré)",
    exportPgp: "PGP",
    exportUnlockHint: "Déverrouillez le coffre d'abord, puis revenez dans Paramètres pour exporter.",
    exportEncryptedHint: "Mot de passe maître pour chiffrer l'export :",
    exportPgpHint: "Passphrase PGP pour chiffrer l'export :",
    exportSaved: "Fichier enregistré avec succès.",
    emptyFile: "Fichier vide.",
    pgpSupport: "Support PGP",
    pgpSupportBody: "L'import PGP est géré via un flux séparé. Utilisez l'application Bureau pour les imports PGP complexes.",
    tabGeneral: "Général",
    tabAccount: "Compte",
    tabSync: "Sync",
    tabData: "Données & Avancé",
    tabExportImport: "Export / Import",
    tabPremium: "Premium",
    tabAlias: "Alias",
    tabWallet: "Wallet",
    syncIpfsHint:
    "Récupère le dernier coffre chiffré sur IPFS (wallet connecté, mot de passe maître en session, signature ou délégation de déverrouillage). Utile après une modification sur un autre appareil. « Enregistrer sur IPFS » envoie depuis cet appareil.",
    syncIpfsSuccess: "Coffre mis à jour depuis IPFS.",
    syncIpfsErrWallet: "Connectez le wallet (Paramètres → Wallet) pour synchroniser depuis IPFS.",
    syncIpfsErrNoRemote: "Aucun coffre (CID) trouvé pour ce wallet sur le serveur.",
    syncIpfsErrPassword: "Déverrouillez l’extension d’abord (mot de passe maître en session).",
    syncIpfsErrSignature: "Signature wallet ou délégation de déverrouillage requise — déverrouillez depuis IPFS ou acceptez la demande de signature.",
    syncIpfsErrDecrypt: "Impossible de déchiffrer le coffre distant (mot de passe ou données invalides).",
    syncIpfsErrGeneric: "Échec de la sync IPFS. Réessayez ou consultez la console du service worker.",
    syncIpfsBusy: "Synchronisation…",
    ipfsGatewayLabel: "Passerelle IPFS personnalisée",
    ipfsGatewayPlaceholder: "https://ipfs.example.com/ipfs",
    ipfsGatewayHint: "Optionnel. Utilisez votre propre passerelle IPFS pour lire votre coffre au lieu des passerelles publiques (ipfs.io, dweb.link). Laissez vide pour utiliser les valeurs par défaut.",
    ipfsGatewaySaved: "Passerelle enregistrée ✓",
    clipboardAutoClear: "Auto-clear presse-papiers",
    clipboardAutoClearHint: "Efface le presse-papiers 30s après copie",
    connectedDevices: "Appareils connectés ({count}/5)",
    deviceLastSeen: "Vu le",
    revokeDevice: "Révoquer",
    revokeDeviceTitle: "Révoquer l’appareil",
    revokeDeviceBody: "Cet appareil ne pourra plus accéder au vault.",
    currentCid: "CID actuel",
    noCid: "Aucun CID enregistré",
    copyCid: "Copier le CID",
    ipfsSync: "Sync IPFS",
    ipfsGatewayCustom: "Gateway IPFS personnalisé",
    ipfsGatewayCustomHint: "Laissez vide pour utiliser les passerelles par défaut.",
    saveGateway: "Enregistrer",
    revokeDeviceConfirm: "Révoquer cet appareil ?",
    clearPremiumConfirm: "Supprimer le statut Premium de cet appareil ?",
    device: "Appareil",
    licenseStatus: "Statut de licence",
    linkedViaWallet: "Lié via Wallet",
    currentDevice: "Cet appareil",
    manageSubscription: "Gérer l'abonnement",
    unlinkDevice: "Détacher l'appareil",
    activationError: "Erreur d'activation",
    clearCacheConfirm: "Vider le cache de synchronisation pour ce wallet ?",
    syncSuccess: "Synchronisation réussie !",
    alreadyLatest: "Votre coffre est déjà à jour",
    saveError: "Erreur lors de la sauvegarde",
    autofillSetup: "Configuration de l'Autofill",
    autofillSetupDescription: "Activez VaultKeepR comme service de saisie automatique système sur votre appareil Android.",
    autofillSetupAction: "Ouvrir les Paramètres Autofill",
    requireBiometricAutofill: "Exiger la biométrie pour l'autofill",
    requireBiometricAutofillDesc: "Demander Face ID / Touch ID avant de remplir les identifiants, au lieu du remplissage silencieux.",
    lockedTitle: "Coffre verrouillé",
    lockedBody: "Déverrouillez votre coffre pour accéder aux paramètres.",
    goPasswordlessTitle: "Go Passwordless",
    goPasswordlessDesc: "Sécurisez votre compte avec un Passkey (Account Abstraction) et dites adieu aux mots de passe."
  },
  sync: {
    synchronize: "Synchroniser",
    saved: "Sauvegardé",
    savedLocally: "Sauvegardé localement",
    connectWallet: "Connecter le wallet",
    settings: "Paramètres",
    premium: "Premium",
    premiumActive: "Abonnement actif",
    subscribe: "S'abonner",
    security: "Sécurité",
    unlockWithFaceId: "Déverrouiller avec Face ID",
    unlockWithTouchId: "Déverrouiller avec Touch ID",
    biometricEnabled: "Le coffre peut être déverrouillé sans mot de passe.",
    biometricDisabled: "Le mot de passe maître est requis.",
    wallet: "Wallet",
    disconnect: "Déconnecter",
    openWallet: "Ouvrir le wallet",
    copyUri: "Copier l'URI",
    syncSection: "Synchronisation",
    autosave: "Sauvegarde automatique",
    activateAutosaveIpfs: "Activer le Vault Sync",
    autosaveIpfsActive: "Vault Sync actif",
    syncing: "Sauvegarde en cours…",
    syncedOnIpfs: "Sauvegardé sur IPFS",
    synced: "Synchronisé",
    passkeyUnlock: "Déverrouiller avec Biométrie",
    passkeyCreate: "Créer avec Biométrie",
    syncError: "Erreur",
    syncCrossDevice: "Sync cross-device actif",
    reset: "Réinitialisation",
    resetDescription: "Vide le cache local (vault, sync, biométrie). Après réinitialisation, récupérez le coffre depuis IPFS si besoin.",
    clearCache: "Vider le cache",
    clearCacheConfirm: "Toutes les données locales seront supprimées. Vous pourrez récupérer le coffre depuis IPFS. Continuer ?",
    clearCacheDone: "L'app a été réinitialisée.",
    clearCacheDoneTitle: "Cache vidé",
    loadFromIpfs: "Charger depuis IPFS",
    saveToIpfs: "Sauvegarder",
    importJson: "Importer un JSON",
    hideImport: "Masquer import",
    pasteJson: "Collez le JSON ici",
    decryptAndOpen: "Déchiffrer et ouvrir",
    openVault: "Ouvrir le coffre",
    entriesCount: "entrée(s)",
    waitingSignature: "En attente de signature…",
    downloading: "Téléchargement…",
    deriving: "Dérivation de clé…",
    uploading: "Envoi…",
    publishing: "Publication…",
    inProgress: "En cours…",
    syncExpired: "Sync expiré — reconnectez votre wallet",
    saving: "Sauvegarde en cours…",
    savedBanner: "Sauvegardé",
    saveErrorBanner: "Erreur de sauvegarde",
    delegationNone: "Non configurée",
    delegationLoading: "Chargement…",
    delegationActive: "✓ Active",
    delegationExpiredLabel: "Expirée",
    delegationExpireIn: "Expire dans {d}j {h}h",
    delegationRenew: "Renouveler",
    delegationSetup: "Configurer l'autosave",
    delegationHint: "L’autosave nécessite une délégation de signature wallet.",
    syncSuccess: "Synchronisation réussie !",
    alreadyLatest: "Votre coffre est déjà à jour",
    saveError: "Erreur lors de la sauvegarde",
    scannerBtn: "Scanner un QR Code de synchronisation",
    scannerTitle: "Synchroniser un appareil",
    scannerConnectedDevices: "Synchronisation d'appareils",
    scannerAccessDenied: "Accès à la caméra refusé",
    scannerFormatError: "QR Code non reconnu (pas de namespace vaultkeepr:sync).",
    scannerSuccessTitle: "Connexion réussie",
    scannerSuccessDesc: "Approuvez la demande sur l'autre appareil.",
    scannerBiometricError: "Authentification échouée ou aucun mot de passe maître enregistré.",
    scannerPasswordReadError: "Erreur lors de la lecture du mot de passe.",
    scannerTimeout: "Timeout de connexion.",
    scannerExtBtn: "Synchroniser depuis un autre appareil",
    scannerExtOverlayTitle: "Synchronisation",
    scannerExtOverlayDesc: "Scannez ce QR Code avec l'application mobile VaultKeepR",
    scannerExtFormatError: "Format de clé invalide reçu.",
    walletConnectDeprecated: "WalletConnect n'est plus supporté. Veuillez utiliser un QR code VaultKeepR.",
    vaultUpdatedFromIpfs: "Coffre mis à jour depuis IPFS.",
    transferFailed: "Échec du transfert",
    receiveFailed: "Échec de la réception"
  },
  tabs: {
    vault: "Coffre",
    totp: "2FA",
    generator: "Générateur",
    sync: "Sync",
    settings: "Réglages",
    tools: "Outils",
    share: "Partage",
    secureDocs: "Docs Sécurisés",
    cloud: "Cloud"
  },
  unlock: {
    title: "Déverrouillez votre coffre",
    subtitle: "Déverrouillez votre coffre",
    createVaultTitle: "Créez votre coffre-fort",
    unlockVault: "Déverrouillez votre coffre",
    loadFromIpfs: "Charger votre coffre depuis IPFS",
    loadFromIpfsSubtitle: "Mot de passe, wallet, puis chargez.",
    unlock: "Déverrouiller",
    createVault: "Créer le coffre",
    newVault: "Nouveau coffre",
    alreadyHaveVault: "J'ai déjà un coffre sur IPFS",
    enterPassword: "Saisissez votre mot de passe maître.",
    passwordsMismatch: "Les mots de passe ne correspondent pas.",
    minPasswordLength: "Minimum 8 caractères.",
    biometricUnlock: "Déverrouiller avec biométrie",
    biometricPromptTitle: "Déverrouiller VaultKeepR",
    biometricSyncPromptTitle: "Authentification pour la synchronisation",
    biometricHint: "Utiliser la biométrie pour déverrouiller",
    nfcChipRecognizedNoSecret: "Puce reconnue (UID : {uid}), mais aucun secret VaultKeepR (NDEF) n'est présent.",
    cameraPermissionRequired: "Autorisation caméra requise",
    authRequired: "Authentification requise",
    noVaultStored: "Aucun coffre enregistré.",
    invalidVaultFormat: "Format de coffre invalide.",
    noCachedKey: "Aucune clé en cache. Déverrouillez d'abord avec le mot de passe.",
    iapSyncFailed: "Échec sync IAP",
    iapNetworkError: "Erreur réseau IAP",
    noLicenseLinked: "Aucune licence associée",
    discoverApp: "Découvrir l’app",
    nfcUnlockBtn: "Déverrouiller via NFC",
    nfcConnectBtn: "Se connecter avec NFC",
    nfcPromptScan: "Approchez votre puce NFC VaultKeepR",
    nfcFormatInvalid: "Format NFC invalide",
    nfcPromptAuth: "Authentifiez-vous pour utiliser cette puce NFC",
    nfcFallback: "Utiliser le PIN",
    nfcAuthFailedTitle: "Échec",
    nfcAuthFailedDesc: "L'authentification a échoué. Le Vault reste verrouillé.",
    nfcNotConfiguredTitle: "Erreur",
    nfcNotConfiguredDesc: "La puce scannée n'est pas configurée pour VaultKeepR.",
    nfcDeviceSecretMissing: "Clé d'appareil introuvable. Reconfigurez la puce NFC dans les Réglages.",
    nfcPinMissing: "Code PIN introuvable. Reconfigurez la puce NFC dans les Réglages.",
    nfcUpgradeTitle: "Mise à jour de sécurité requise",
    nfcUpgradeDesc: "Votre puce NFC utilise un format obsolète. Reconfigurez-la depuis Réglages > Puce NFC pour une sécurité renforcée.",
    nfcReadError: "Erreur de lecture NFC",
    passkeyNotSupported: "Passkeys non supportés par ce navigateur.",
    passkeyError: "Erreur Passkey",
    noBiometricKey: "Aucune clé biométrique trouvée. Créez d'abord un coffre avec la Biométrie.",
    bioEnrollTitle: "Activer la Biométrie",
    bioEnrollDesc: "Entrez votre mot de passe maître une fois pour activer le déverrouillage biométrique.",
    passkeyUnlock: "Déverrouiller avec Passkey",
    passkeyCreate: "Créer un Passkey (Sans mot de passe)",
    passkeyPrfNotSupported: "PRF non supporté. Ce navigateur ne permet pas le chiffrement par Passkey.",
    passkeyReady: "Coffre Passkey prêt !",
    passkeyGenerated: "Coffre Passkey généré...",
    biometricChecking: "Vérification biométrique...",
    authCancelled: "Authentification annulée",
    biometricSuccess: "Biométrie validée !",
    encryptingInProgress: "Chiffrement en cours...",
    passKeyMigrationTitle: "Migrer le coffre vers Passkey",
    passKeyMigrationDesc: "Votre coffre est chiffré avec votre ancien mot de passe. Saisissez-le pour le re-chiffrer avec votre Passkey (opération unique).",
    passKeyMigrationOldPw: "Mot de passe ma\u00eetre actuel",
    passKeyMigrationConfirm: "Migrer & déverrouiller",
    passKeyMigrationSuccess: "Coffre migré avec succès vers Passkey !"
  },
  postSyncPrf: {
    title: "Activer Face ID / Touch ID",
    body: "Votre coffre est sans mot de passe. Enregistrez une passkey maintenant pour déverrouiller cet appareil avec votre empreinte ou votre visage — sinon vous aurez besoin de votre mot de passe maître à chaque fois.",
    unsupported: "Les passkeys ne sont pas prises en charge par ce navigateur. Vous aurez besoin de votre mot de passe maître pour déverrouiller.",
    enable: "Activer Face ID / Touch ID",
    skipFirst: "Ignorer pour cette session",
    skipWarningTitle: "Vous aurez besoin de votre mot de passe maître la prochaine fois",
    skipWarningBody: "Sans passkey, le seul moyen de déverrouiller cet appareil est votre mot de passe maître. Si vous l'oubliez, votre coffre ne pourra pas être récupéré.",
    skipConfirm: "Je comprends, ignorer"
  },
  locked: {
    title: "Vault verrouillé",
    subtitle: "Connectez le wallet puis déverrouillez.",
    wallet: "Wallet",
    unlock: "Déverrouiller",
    unlockButton: "Déverrouiller",
    localBackupAvailable: "Sauvegarde locale disponible",
    restoreLocalBackup: "Restaurer la sauvegarde locale",
    restore: "Restaurer",
    preparing: "Préparation…",
    scanWithWallet: "Scannez avec votre wallet",
    copyUri: "Copier l'URI",
    signInWallet: "Signez avec votre wallet.",
    signInWalletIpfs: "Signez avec votre wallet (Récupération IPFS)",
    enterPassword: "Entrez votre mot de passe.",
    loadingFromIpfs: "Chargement depuis IPFS…",
    extensionInactive: "Extension inactif. Réveillez-la.",
    restoring: "Restauration…",
    createVaultTitle: "Nouveau coffre",
    createVaultHint: "Coffre local sur cet appareil. Connectez le wallet dans Paramètres pour synchroniser sur IPFS plus tard.",
    createVaultButton: "Créer le coffre",
    createVaultWarning: "Ce mot de passe cryptera localement votre coffre. Il ne pourra jamais être réinitialisé par VaultKeepR.",
    createVaultChoose: "Choisissez comment protéger votre coffre.",
    passkeyCreateSubtitle: "Face ID / Touch ID / PIN de l'appareil",
    passkeyCreateSubtitlePin: "PIN de l'appareil",
    masterPasswordLocal: "Chiffrement par mot de passe",
    masterPasswordDesc: "Votre coffre est protege par un mot de passe de votre choix. Sync IPFS disponible.",
    noVaultFound: "Aucun coffre trouvé pour cette adresse. Veuillez en créer un.",
    checkingIpfs: "Vérification de la synchronisation cloud (IPFS)…",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    passwordTooShort: "Au moins 8 caractères.",
    existingVaultPrompt: "Vous avez déjà un coffre sur IPFS ?",
    openFromIpfs: "Depuis IPFS",
    passwordStrengthLabel: "Robustesse du mot de passe maître",
    passwordStrengthWeak: "Faible",
    passwordStrengthMedium: "Moyen",
    passwordStrengthStrong: "Fort",
    overwriteWarningTitle: "Attention : Coffre existant",
    overwriteWarningBody: "Un coffre local existe déjà. En créer un nouveau écrasera définitivement vos données actuelles. Voulez-vous exporter une sauvegarde chiffrée avant de continuer ?",
    exportAndOverwrite: "Exporter Sauvegarde (.json)",
    overwriteOnly: "Écraser quand même",
    cancel: "Annuler",
    active: "Actif",
    on: "ON",
    off: "OFF",
    thisDevice: "Cet appareil",
    version: "Version",
    revoke: "Révoquer",
    revokeConfirm: "Révoquer cet appareil ?",
    revokeSuccess: "Appareil révoqué",
    connectedDevices: "Appareils connectés",
    unlinkDevice: "Détacher l'appareil",
    unlinkConfirm: "Supprimer le statut Premium de cet appareil ?",
    manageSubscription: "Gérer l'abonnement",
    loggedWith: "Connecté avec :",
    security: "Sécurité",
    passwordHealth: "Santé des mots de passe",
    passwordHealthDesc: "Analyse force, réutilisation & âge",
    analyze: "Analyser",
    breachScanner: "Analyse de fuites",
    breachScannerDesc: "Vérifier via Have I Been Pwned",
    scan: "Scanner",
    autoFill: "Auto-remplissage",
    autoFillDesc: "Remplir sur chargement de page",
    clipboardTimeout: "Nettoyage presse-papiers",
    clipboardTimeoutDesc: "Effacer après 30 secondes",
    tabSync: "Stockage & Sync",
    tabGeneral: "Général",
    tabAccount: "Compte",
    tabData: "Données & Avancé",
    tabExportImport: "Export / Import",
    syncIpfsHint: "Sauvegarder & charger via IPFS",
    syncIpfsBusy: "Sync en cours…",
    ipfsGatewayLabel: "Passerelle IPFS",
    ipfsGatewayPlaceholder: "https://ipfs.io",
    clearCacheConfirm: "Vider le cache de synchronisation pour ce wallet ?",
    syncSuccess: "Synchronisation réussie !",
    alreadyLatest: "Votre coffre est déjà à jour",
    saveError: "Erreur lors de la sauvegarde",
    deviceSyncRemovedHint: "Utilisez le QR code VaultKeepR depuis Paramètres > Paire un appareil"
  },
  header: {
    searchPlaceholder: "Rechercher…",
    settings: "Paramètres",
    newEntry: "Nouvelle entrée",
    newLogin: "Nouvelle connexion",
    newIdentity: "Nouvelle identité",
    identities: "Identités",
    logins: "Connexions",
    saveToIpfs: "Enregistrer sur IPFS",
    syncIpfs: "Synchroniser (IPFS)",
    syncWebApp: "Synchroniser (app web)",
    sync: "Synchronisation",
    export: "Exporter",
    lockVault: "Verrouiller le vault",
    exportJson: "Exporter (JSON)",
    exportEncrypted: "Exporter (chiffré)",
    import: "Importer",
    premium: "Premium",
    premiumAccount: "Compte Premium",
    premiumAccountPlaceholder: "email ou 0x...",
    link: "Lier",
    unlink: "Délier",
    licenseKey: "Clé de licence",
    activateKey: "Activer la clé",
    subscribeAnnual: "S'abonner (annuel)",
    activeUntil: "Actif jusqu'au",
    saveToIpfsPlaceholder: "Mot de passe du coffre",
    saveToIpfsPlaceholderConnected: "Vide = mot de passe en cache",
    saving: "Envoi…",
    savedOnIpfs: "Enregistré sur IPFS. ID :",
    uploadFailed: "Échec de l'upload.",
    enterPassword: "Entrez votre mot de passe maître.",
    signInWallet: "Approuvez la demande de signature dans votre wallet.",
    signFailed: "Signature wallet échouée. Ouvrez votre wallet et réessayez.",
    signOverlayHint: "Ouvrez votre wallet et approuvez la signature pour chiffrer et sauvegarder votre coffre.",
    openMetaMask: "Ouvrir MetaMask"
  },
  vault: {
    unlockTitle: "Déverrouiller le coffre",
    unlockDescription: "Mot de passe + signature wallet",
    vaultSaved: "Vault sauvegardé pour cette adresse",
    setMasterPassword: "Définir le mot de passe maître",
    continue: "Continuer",
    newVault: "Nouveau vault",
    signatureRequired: "Signature requise",
    unlockRequired: "Veuillez d'abord déverrouiller votre coffre",
    loading: "Chargement…",
    saveToIpfs: "Sauvegarder",
    syncIpfs: "Synchroniser",
    syncWebApp: "Synchroniser (app web)",
    add: "Ajouter",
    save: "Sauvegarder",
    saveInProgress: "Sauvegarde...",
    sync: "Synchroniser",
    syncing: "Synchronisation…",
    importBitwarden: "Import Bitwarden",
    importCsv: "Import CSV",
    importPgp: "Import PGP",
    exportJson: "Exporter (JSON)",
    exportEncrypted: "Exporter (chiffré)",
    import: "Importer",
    newEntry: "Nouvelle entrée",
    group: "Groupe",
    site: "Site",
    username: "Identifiant",
    password: "Mot de passe",
    totp: "2FA",
    notes: "Notes",
    notesMasked: "Masquer la note par défaut (affichage ••••• jusqu'à « Révéler »)",
    saveEntry: "Enregistrer",
    savedSuccess: "Vault sauvegardé",
    savedLocally: "localement (IPFS non disponible)",
    savedLocallyShort: "localement",
    savedViaIpfs: "via IPFS",
    noResult: "Aucun résultat",
    unnamedEntry: "Compte sans nom",
    noEntries: "Aucun identifiant enregistré",
    addFirstEntry: "Ajoutez vos premiers sites (ex. github.com, gmail.com) avec leurs identifiants et mots de passe.",
    searchPlaceholder: "Rechercher un site ou un identifiant...",
    newVersionAvailable: "Nouvelle version disponible (autre appareil)",
    reload: "Recharger",
    later: "Plus tard",
    close: "Fermer",
    syncPasswordPrompt: "Synchroniser",
    syncPasswordDescription: "Mot de passe maître",
    autosaveReunlockHint: "Sauvegarde auto désactivée. Verrouillez puis déverrouillez le coffre pour l'activer.",
    backToLanding: "Site & présentation",
    tags: "Tags",
    navigation: "Navigation",
    favorites: "Favoris",
    allEntries: "Toutes les entrées",
    categories: "Catégories",
    settings: "Paramètres",
    noEntrySelected: "Sélectionnez une entrée pour voir les détails",
    search: "Rechercher...",
    securityTools: "Outils de Sécurité",
    generator: "Générateur",
    securityHealth: "Santé Sécurité",
    breachScanner: "Scanner de Fuites",
    newEntryShort: "Nouveau",
    groups: "Groupes",
    group_identifiants: "Identifiants",
    group_cartes: "Cartes bancaires",
    group_notes: "Notes",
    group_identites: "Identités",
    group_seeds: "Crypto Seed",
    entryAdded: "Entrée ajoutée !",
    entryUpdated: "Mise à jour réussie !",
    tagsPlaceholder: "ex: travail, perso, banque",
    favoriteLabel: "Favori",
    favoriteYes: "Oui",
    favoriteNo: "Non",
    subscribe: "S'abonner",
    reveal: "Révéler",
    totpCode: "Code 2FA (TOTP)",
    premiumRequiredTotp: "Le plan Premium est requis pour utiliser les codes TOTP.",
    sort: "Trier",
    sortLastModified: "Récemment modifié",
    sortLastAdded: "Récemment ajouté",
    sortBy: "Tri : ",
    backupExportSuccess: "Backup exporté avec succès !",
    exportFilename: "sauvegarde-coffre",
    sortAz: "A → Z",
    sortZa: "Z → A"
  },
  entry: {
    username: "Identifiant",
    url: "URL",
    notes: "Notes",
    totp: "2FA",
    unknownTitle: "Entrée sans titre",
    noEntriesFound: "Aucune entrée trouvée",
    type: {
      identity: "Identité",
      password: "Mot de passe",
      unknown: "Inconnu"
    }
  },
  card: {
    number: "Numéro de carte",
    expiry: "Expiration",
    cvv: "CVV",
    holder: "Titulaire",
    holderPlaceholder: "NOM PRÉNOM",
    defaultName: "Carte"
  },
  note: {
    title: "Titre",
    titlePlaceholder: "Ma note secrète",
    content: "Contenu",
    contentPlaceholder: "...",
    defaultName: "Note sans titre"
  },
  identity: {
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    emailPlaceholder: "email@exemple.com",
    phone: "Téléphone",
    birthDate: "Date de naissance",
    address: "Adresse",
    postalCode: "Code postal",
    city: "Ville",
    country: "Pays",
    defaultName: "Nouvelle identité",
    noIdentityFound: "Aucune identité.",
    createFirstIdentityHint: "Créez une identité via le menu +."
  },
  favorite: {
    toggle: "Marquer comme favori"
  },
  addForm: {
    title: "Nouvelle entrée",
    group: "Groupe",
    site: "Site",
    username: "Identifiant",
    password: "Mot de passe",
    totp: "2FA",
    totpSecretPlaceholder: "Secret fourni par le site",
    totpEditPlaceholder: "Laisser vide pour ne pas modifier",
    totpPremiumOnly: "Réservé aux abonnés Premium",
    notes: "Notes",
    notesPlaceholder: "Notes ou remarques",
    notesMasked: "Masquer la note par défaut",
    cardNumber: "Numéro de carte",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiry: "Expiration",
    expiryPlaceholder: "12/28",
    cvv: "CVV",
    cvvPlaceholder: "123",
    cardholder: "Titulaire de la carte",
    cardholderPlaceholder: "NOM Prénom",
    cardTitle: "Titre (optionnel)",
    cardTitlePlaceholder: "Ex: Monabanq, N26...",
    noteTitle: "Titre",
    noteTitlePlaceholder: "Titre de la note",
    content: "Contenu",
    contentPlaceholder: "Contenu de la note…",
    save: "Sauvegarder",
    customGroupLabel: "Groupe personnalisé",
    newGroup: "Nouveau groupe",
    groupNamePlaceholder: "Nom du groupe",
    groupNameRequired: "Saisissez un nom de groupe",
    groupExists: "Ce groupe existe déjà",
    fillAtLeastOne: "Remplissez au moins un champ.",
    invalidCardNumber: "Numéro de carte invalide (13 à 19 chiffres).",
    invalidExpiry: "Format expiration invalide.",
    noteContentRequired: "Saisissez au moins le contenu de la note.",
    noteContentEmpty: "Le contenu de la note ne peut pas être vide.",
    groupIdentifiants: "Identifiants",
    groupCartes: "Cartes bancaires",
    groupNotes: "Notes",
    groupIdentites: "Identités",
    groupSeeds: "Crypto Seeds",
    favorite: "Favori",
    masked: "Masquer par défaut",
    usernamePlaceholder: "user@exemple.com",
    sitePlaceholder: "exemple.com",
    addUri: "Ajouter une URI",
    uriPlaceholder: "https://exemple.com",
    matchType: "Type de correspondance",
    matchExact: "Exacte",
    matchHostname: "Nom d'hôte",
    matchBaseDomain: "Domaine de base",
    matchNever: "Jamais",
    removeUri: "Supprimer l'URI"
  },
  editForm: { title: "Modifier l'entrée" },
  identityForm: {
    title: "Modifier l'identité",
    newTitle: "Nouvelle identité",
    firstName: "Prénom",
    lastName: "Nom",
    civility: "Civilité",
    email: "Email",
    phone: "Téléphone",
    birthDate: "Date de naissance",
    address: "Adresse",
    postalCode: "Code postal",
    city: "Ville",
    country: "Pays",
    save: "Enregistrer l'identité",
    saveError: "Impossible d'enregistrer. Ouvrez l'app et réessayez.",
    civilityMr: "M.",
    civilityMrs: "Mme",
    civilityNone: "—"
  },
  detailPane: {
    selectEntry: "Sélectionnez une entrée dans la liste",
    identity: "Identité",
    credentials: "Identifiants",
    card: "Carte bancaire",
    note: "Note",
    site: "Site",
    siteUrl: "Adresse du site",
    fillForm: "Remplir le formulaire",
    fill: "Remplir",
    filled: "Rempli",
    filling: "Remplissage…",
    openSite: "Ouvrir le site",
    edit: "Modifier",
    delete: "Supprimer",
    deleteIdentity: "Supprimer cette identité ?",
    deleteCard: "Supprimer cette carte ?",
    deleteNote: "Supprimer cette note ?",
    noTotp: "Aucun code TOTP disponible",
    addTotpHelp: "Ajoutez un secret TOTP à une entrée pour le voir ici.",
    deleteLogin: "Supprimer cet identifiant ?",
    copyUsername: "Copier l'identifiant",
    copyPassword: "Copier le mot de passe",
    copyTotp: "Copier le code TOTP",
    copySite: "Copier le site",
    noName: "Sans nom",
    noTitle: "Sans titre",
    premiumRequired: "Réservé Premium",
    totpInPremium: "Codes 2FA inclus dans Premium.",
    number: "Numéro",
    expiration: "Expiration",
    cardholder: "Titulaire",
    code: "Code",
    content: "Contenu",
    passwordHistory: "Historique du mot de passe",
    previousPasswords: "Mots de passe precedents",
    changedOn: "Modifie le {date}",
    noPasswordHistory: "Aucun changement de mot de passe enregistre"
  },
  seed: {
    walletName: "Identité du portefeuille",
    walletNamePlaceholder: "ex: Ledger Nano S, MetaMask...",
    derivationPath: "Chemin de Dérivation",
    derivedAddress: "Adresse Dérivée",
    bip39Phrase: "Phrase BIP-39",
    wordsCount: "{count} mots",
    invalidPhrase: "Phrase invalide (mot ou checksum incorrect)",
    appPasswordPlaceholder: "Mot de passe de l'application...",
    bip39Alert: "V\u00e9rification BIP-39 termin\u00e9e avec succ\u00e8s.",
    deleteConfirm: "Supprimer cette seed phrase ?",
    cryptoSeedTitle: "Identifiants Crypto"
  },
  listPane: {
    noCredentialsForSite: "Aucun identifiant pour ce site",
    viewAll: "Voir tous les identifiants",
    favorites: "Favoris",
    noResult: "Aucun résultat",
    thisSite: "Ce site",
    thisSiteOnly: "Ce site uniquement",
    sortDefault: "Par défaut",
    sortMostUsed: "Plus utilisés",
    sortRecentlyUsed: "Utilisés récemment",
    sortLastSaved: "Derniers enregistrés",
    customGroup: "Groupe personnalisé",
    allGroups: "Tous les groupes",
    selectEntry: "Sélectionnez une entrée"
  },
  generator: {
    desc: "Génère des mots de passe forts et personnalisés",
    length: "Longueur",
    chars: "caractères",
    options: "Options",
    uppercase: "Majuscules (A-Z)",
    lowercase: "Minuscules (a-z)",
    numbers: "Chiffres (0-9)",
    symbols: "Symboles (!@#$…)",
    generate: "Générer un mot de passe",
    result: "Résultat",
    char: "caractère",
    charsPlural: "caractères",
    title: "Générateur de mots de passe",
    subtitle: "Créez des mots de passe robustes et sécurisés",
    history: "Historique",
    clearHistory: "Effacer l'historique",
    clearHistoryConfirm: "Effacer tout l'historique des mots de passe générés ?",
    noHistory: "Aucun historique",
    justNow: "À l'instant",
    minutesAgo: "Il y a {n} min",
    hoursAgo: "Il y a {n} h",
    strength: "Force",
    veryStrong: "Très fort",
    strong: "Fort",
    medium: "Moyen",
    fair: "Correct",
    weak: "Faible",
    veryWeak: "Très faible",
    generateNew: "Générer un nouveau",
    passphraseMode: "Phrase de passe",
    passwordMode: "Mot de passe",
    wordCount: "Mots",
    separator: "Separateur",
    capitalize: "Capitaliser",
    passphrase: "Phrase de passe"
  },
  securityHealthDetails: {
    title: "Santé Sécurité",
    subtitle: "Analyse complète de la robustesse de vos identifiants",
    score: "Score",
    vaultStatus: "État du Coffre",
    statusExcellent: "Félicitations ! Vos mots de passe sont globalement excellents.",
    statusGood: "Bon résultat, mais quelques optimisations sont recommandées.",
    statusWarning: "Attention : plusieurs mots de passe présentent des risques.",
    statusCritical: "Danger critique : votre sécurité globale est compromise !",
    critical: "Critique",
    weak: "Faible",
    reused: "Réutilisés",
    strong: "Fort",
    fair: "Correct",
    all: "Tous",
    noIssues: "Aucun problème détecté dans cette catégorie",
    noData: "Aucune entrée à analyser",
    noDataHint: "Ajoutez des identifiants avec mots de passe pour voir l'analyse.",
    issueEmpty: "Mot de passe vide",
    issueTooShort: "Trop court (< 8 caractères)",
    issueDiversity: "Pas assez de types de caractères",
    issueNoDigitSymbol: "Chiffre ou symbole manquant",
    issueRepeated: "Trop de caractères répétés",
    issueCommon: "Mot de passe commun (connu dans une fuite)",
    issuePattern: "Caractère unique répété",
    issueReused: "Réutilisé sur {count} autre(s) site(s)",
    issueOld: "Ancien mot de passe ({months} mois)",
    issueExpired: "Mot de passe expire ({months} mois, max {days} jours)",
    expired: "Expires"
  },
  autosave: {
    savedToast: "Identifiants sauvegardes dans VaultKeepR",
    edit: "Modifier"
  },
  breachScanner: {
    title: "Scanner de Fuites",
    subtitle: "Vérifiez si vos identifiants apparaissent dans des bases de données piratées",
    dataSecurity: "Sécurité des Données",
    hibpNotice: "Nous utilisons le service Have I Been Pwned via un système de hachage sécurisé (k-anonymity).",
    hibpNoticeNoPassword: "Aucun mot de passe ne quitte jamais votre appareil.",
    startScan: "Lancer l'analyse",
    scanning: "Analyse en cours...",
    stopScan: "Arrêter",
    scanComplete: "Scan terminé !",
    scanError: "Une erreur est survenue lors du scan.",
    breachedCount: "{count} identifiants compromis",
    noBreaches: "Aucune fuite détectée",
    changeImmediately: "Changez ces mots de passe immédiatement.",
    resultsTitle: "Résultats de l'analyse",
    foundBreaches: "Fuites",
    safeEntries: "Sains",
    startHint: "Commencez le scan pour voir les résultats",
    retry: "Relancer l'analyse",
    emailSection: "Surveillance des e-mails",
    emailSectionDesc: "Vérifiez vos adresses e-mail contre les fuites de données connues.",
    emailPlaceholder: "Ajouter une adresse e-mail",
    emailAdd: "Ajouter",
    emailNoemails: "Aucun e-mail surveillé pour le moment.",
    emailScan: "Scanner les e-mails",
    emailScanning: "Scan des e-mails en cours...",
    emailConsentTitle: "Avis de confidentialité",
    emailConsentBody: "Pour vérifier les fuites, vos adresses e-mail complètes sont envoyées à leakcheck.io (un service tiers). Aucune autre donnée n'est transmise.",
    emailConsentAgree: "J'accepte",
    emailBreachedCount: "{count} e-mail(s) compromis",
    emailNoBreaches: "Aucun e-mail compromis",
    emailRemove: "Retirer"
  },
  tools: {
    servicesTitle: "Services",
    servicesSubtitle: "Partage et stockage sécurisé",
    shareHint: "Liens, notes et fichiers chiffrés avec PIN",
    docsHint: "Stockez vos documents sensibles chiffrés"
  },
  totp: {
    title: "2FA (TOTP)",
    lockedText: "Passez en Premium pour afficher et utiliser vos codes 2FA ici.",
    viewPremium: "Voir Premium",
    noCodes: "Aucun code 2FA.",
    addHint: "Ajoutez un secret TOTP à une entrée (détail → TOTP) pour le voir ici.",
    premiumDesc: "L'authentification TOTP est réservée aux membres Premium.",
    showAll: "Tous",
    showMatching: "Ce site",
    previous: "Compte précédent",
    next: "Compte suivant"
  },
  premium: {
    back: "Retour",
    title: "Premium",
    badgeTitle: "VaultKeepR Premium",
    badgeSub: "2FA inclus",
    activeUntil: "Premium actif jusqu'au",
    status: "Abonnement",
    connectedDevices: "Appareils connectés",
    lastSeen: "Vu le",
    thisDevice: "Cet appareil",
    yourLicenseKey: "Votre clé de licence",
    licenseCrossPlatformDesc: "Utilisez cette clé pour activer Premium sur la webapp et l'extension.",
    revokeDeviceTitle: "Supprimer l'appareil",
    revokeDeviceConfirm: "Cet appareil perdra l'accès au Premium. Continuer ?",
    syncLicense: "Synchroniser la licence IAP",
    subscribe: "S'abonner",
    subscribePrice: "S'abonner — {price}/an",
    subscribePriceMonthly: "S'abonner — {price}/mois",
    planYearly: "Annuel",
    planMonthly: "Mensuel",
    bestValue: "Meilleur rapport qualité/prix",
    productUnavailable: "Produit indisponible. Réessayez plus tard.",
    restorePurchases: "Restaurer mes achats",
    licenseTitle: "Licence web (e-mail)",
    licenseDesc:
    "Achat sur le site ? Saisissez votre clé VK-… Utilisez le même wallet que sur le web et dans l’extension.",
    licensePlaceholder: "VK-XXXX-XXXX-XXXX-XXXX",
    activateLicense: "Activer la clé",
    planPremiumName: "Premium",
    planProName: "Pro",
    planUltimateName: "Ultimate",
    planPremiumDesc: "TOTP, Alias, Shamir + 1 Go cloud",
    planProDesc: "50 Go cloud chiffré, 25 Mo/fichier",
    planUltimateDesc: "Stockage illimité*, toutes les fonctionnalités",
    planPremiumPrice: "2,49\u20ac/mois",
    planPremiumPriceYearly: "17,99\u20ac/an",
    planProPrice: "3,99\u20ac/mois",
    planProPriceYearly: "39,99\u20ac/an",
    planUltimatePrice: "6,99\u20ac/mois",
    planUltimatePriceYearly: "69,99\u20ac/an",
    choosePlan: "Choisir ce plan",
    cloudStorage: "cloud",
    perFile: "/fichier",
    allPremiumFeatures: "Toutes les fonctions Premium",
    unlimitedStorage: "Stockage illimite*",
    termsOfUse: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialite",
    legalFooter: "En vous abonnant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialite. Les abonnements sont geres par Apple et se renouvellent automatiquement sauf annulation au moins 24h avant la fin de la periode en cours.",

    successTitle: "Bienvenue en Premium",
    successDesc: "Toutes les fonctionnalites Premium sont desormais actives. Merci pour votre soutien.",
    successContinue: "Continuer",
    googlePlayActive: "Abonnement Google Play",
    googlePlayActiveDesc: "Votre acces Premium est gere par Google Play. Vous pouvez gerer ou annuler votre abonnement depuis le Play Store.",
    appStoreActive: "Abonnement App Store",
    appStoreActiveDesc: "Votre acces Premium est gere par l'App Store. Vous pouvez gerer ou annuler votre abonnement depuis Reglages > Abonnements."
  },
  errorBoundary: { title: "Erreur" },
  mainTabs: {
    newVersionTitle: "Nouvelle version disponible",
    newVersionMessage: "Le coffre a été mis à jour. Synchroniser ?",
    newVersionMessageAlt: "Le coffre a été mis à jour sur un autre appareil. Synchroniser ?",
    later: "Plus tard",
    sync: "Synchroniser"
  },
  syncBanner: {
    unlockExpired: "Session expirée. Veuillez redéverrouiller pour synchroniser.",
    expired: "Synchronisation IPFS expirée. Réactivez-la pour synchroniser vos appareils.",
    expiringSoon: "La synchronisation expire dans {time}",
    renew: "Renouveler"
  },
  syncAlerts: {
    connectWallet: "Connectez le wallet.",
    remoteNewer: "Une version plus récente existe sur un autre appareil. Rechargez la page pour synchroniser.",
    remoteOlder: "La version distante est plus ancienne que vos données locales. Aucune synchronisation nécessaire.",
    enterPassword: "Saisissez votre mot de passe maître.",
    faceIdRequired: "Authentification Face ID requise ou annulée.",
    noRemoteVault: "Aucun coffre distant pour ce wallet. Sauvegardez depuis un autre appareil d'abord.",
    noRecord: "Aucun enregistrement.",
    timeout: "Timeout. Réessayez.",
    signatureTimeout: "Signature non reçue. Ouvrez le wallet et réessayez.",
    vaultUnlockedWalletRequired: "Coffre déverrouillé et wallet connecté requis.",
    faceIdOrPassword: "Authentification Face ID requise ou mot de passe maître.",
    pasteJson: "Collez le JSON d'export.",
    enterMasterPassword: "Saisissez le mot de passe.",
    enterPgpPassphrase: "Passphrase PGP :",
    chooseMasterPassword: "Choisissez un mot de passe maître.",
    formatUnknown: "Format non reconnu.",
    encryptedExportDetected: "Export chiffré détecté.",
    entriesCountChoosePassword: "{count} entrée(s). Choisissez un mot de passe.",
    faceIdOrPasswordBelow: "Face ID ou mot de passe ci-dessous.",
    uriCopied: "URI copié. Collez dans votre wallet.",
    syncSuccess: "Synchronisé. Coffre mis à jour.",

    syncConflictTitle: "Conflit de synchronisation",
    syncConflictBody: "Une version plus récente de votre coffre existe sur un autre appareil. Vos modifications locales n'ont PAS été écrasées. Cliquez ci-dessous pour tirer la version distante et la fusionner en 3-way avec vos modifications locales.",
    syncConflictPullRemote: "Tirer la distante (fusion 3-way)",
    syncConflictDismiss: "Garder le local pour l'instant",
    vaultLoaded: "Coffre chargé depuis IPFS.",
    saveSuccess: "Succès. Sauvegardé sur IPFS.",
    saveSuccessWebapp: "Sauvegardé sur IPFS. La webapp et l'extension pourront récupérer cette version.",
    sessionExpired: "Session wallet expirée",
    reconnectWallet: "Reconnectez le wallet puis réessayez.",
    sessionExpiredInvalid: "Session wallet expirée ou invalide. Reconnectez le wallet (bouton Connecter), puis réessayez Sauvegarder.",
    openWalletRetry: "Ouvrez le wallet et réessayez.",
    biometricEnabledTitle: "Face ID activé",
    biometricDisabledTitle: "Face ID désactivé",
    biometricEnabled: "Face ID activé. Vous pourrez déverrouiller le coffre avec Face ID.",
    biometricDisabled: "Le mot de passe maître sera requis à chaque ouverture.",
    autosaveActivated: "Vault Sync activé. Les modifications seront sauvegardées automatiquement sur IPFS."
  },
  fragmented: {
    title: "Vault fragmenté",
    setupTitle: "Vault fragmenté",
    setupDesc: "Divisez votre vault en 5 parts (3 requises). Recovery ID indépendante du wallet.",
    recoveryTitle: "Récupérer le vault fragmenté",
    recoveryDesc: "Récupérez votre coffre avec la Recovery ID et au moins 3 parts (device, contact ou IPFS).",
    recoveryIdLabel: "Recovery ID (32 hex)",
    generateRecoveryId: "Générer",
    saveRecoveryId: "Enregistrer la Recovery ID",
    devicePartSaved: "Part device enregistrée",
    partsUploaded: "Parts uploadées sur IPFS",
    contactPartExport: "Donnez cette part à un contact de confiance pour la récupération",
    scanContactPart: "Scannez avec le contact pour transmettre la part",
    pasteContactPart: "Copier la part contact",
    recoverVault: "Récupérer le coffre",
    needThreeParts: "3 parts requises pour récupérer",
    activate3of5: "Activer 3-of-5",
    placeholderGenerateOrPaste: "Générez ou collez",
    copyRecoveryId: "Copier la Recovery ID",
    recoveryIdPlaceholder: "Ex : a1b2c3d4...",
    passwordPlaceholder: "Mot de passe pour déverrouiller",
    contactPartLabel: "Part contact (base64, optionnel)",
    contactPartPlaceholder: "Collez la part reçue du contact",
    errorRecoveryIdRequired: "Entrez la Recovery ID (32 hex).",
    recoveryIdCopiedAlert: "Recovery ID copiée. Conservez-la en lieu sûr.",
    contactPartCopiedAlert: "Part contact copiée. Envoyez-la à un proche de confiance.",
    errorPasswordRequired: "Entrez le mot de passe maître.",
    errorRecoveryIdInvalid: "Recovery ID invalide (32 caractères hexadécimaux).",
    errorContactPartInvalid: "Part contact invalide (base64).",
    errorPartsInsufficient: "Parts insuffisantes : {have}/{need}. Fournissez la part contact.",
    errorPersistence: "Erreur de persistance",
    recoverLink: "Récupérer vault fragmenté",
    storeOnChain: "Stocker la part on-chain (Base)",
    storeOnChainDone: "Part stockée on-chain",
    storeOnChainConfigHint: "Pour activer le stockage on-chain, déployez le contrat et ajoutez fragmentContractAddress dans config.json.",
    viewTransaction: "Voir la transaction",
    connectWalletToStore: "Connectez le wallet pour stocker on-chain",
    errorWcReconnectBase:
    "Cette session WalletConnect n’inclut pas Base (chaîne 8453). Déconnectez le wallet dans Paramètres → Wallet, puis reconnectez-vous en approuvant Ethereum et Base.",
    storeOnChainQrHint:
    "Scannez ce QR avec votre wallet pour cette transaction uniquement. Approuvez Ethereum et Base, puis validez la transaction sur l’appareil.",
    storeOnChainSecondPrompt:
    "Après la connexion : gardez l’app wallet ouverte — une deuxième demande doit apparaître pour signer la transaction sur Base (ce n’est pas seulement la connexion).",
    storeOnChainTimeout: "Délai dépassé en attendant le wallet. Réessayez.",
    storeOnChainNoUri: "URI WalletConnect indisponible.",
    errorFragmentWcApproveBase:
    "Ce pairing doit inclure le réseau Base (chaîne 8453). Scannez à nouveau le QR et approuvez Base sur l’écran WalletConnect. Si le wallet refuse une connexion réservée à Base, mettez l’app à jour.",
    tooltipRecoveryIdSetup:
    "Gardez cette Recovery ID secrète et sauvegardée (papier ou gestionnaire de mots de passe de confiance). Elle sert à récupérer le coffre sur un autre appareil. Ce n’est ni l’adresse wallet ni le mot de passe maître. Elle dérive les clés qui déchiffrent les parts stockées : la perdre peut rendre la récupération impossible même s’il reste des parts.",
    tooltipRecoveryIdAfterSetup:
    "Copiez ou notez exactement cette Recovery ID et conservez-la hors ligne en lieu sûr. Sans elle, vous ne pourrez pas récupérer ce vault fragmenté, même avec la part contact ou on-chain. Le mot de passe maître seul ne suffit pas.",
    tooltipContactPart:
    "Ce QR est une part Shamir (3 sur 5). Ne la donnez qu’à un contact de confiance pour la récupération. Elle ne révèle ni le mot de passe maître ni le coffre complet sans les autres parts et votre Recovery ID.",
    tooltipStoreOnChain:
    "Enregistre une part chiffrée sur Base via votre wallet. Vous aurez toujours besoin de cette Recovery ID et du mot de passe maître pour ouvrir le coffre ; cela ajoute seulement un emplacement de plus pour une part.",
    tooltipActivate3of5:
    "Crée 5 parts chiffrées ; 3 suffisent pour reconstituer la clé. Les parts partent vers IPFS, cet appareil, le contact, optionnellement Base, et le canal API. Lancez l’activation seulement si la Recovery ID est sauvegardée : la changer impose de refaire le setup.",
    tooltipRecoveryIdRecover:
    "Doit être exactement la Recovery ID 32 caractères du setup fragmenté (même orthographe et casse). Elle dérive la clé de recherche du manifeste et déchiffre les parts stockées. Une seule erreur et la récupération échoue.",
    tooltipMasterPasswordRecover:
    "Le mot de passe maître du coffre que vous récupérez — pas la Recovery ID. Une fois assez de parts combinées, il déchiffre le contenu du coffre.",
    tooltipContactPartRecover:
    "Optionnel si vous avez déjà assez de parts (appareil, IPFS, chaîne). Collez la part base64 reçue du contact quand il vous faut une part de plus pour atteindre le seuil (ex. 3 sur 5).",
    recoverySuccessBody: "Votre coffre fragmenté a été restauré.",
    onChainDeprecated: "Le stockage on-chain via WalletConnect est obsolète. Les fragments sont stockés sur le relais API."
  },
  nfcSetup: {
    title: "Configurer une Puce NFC",
    notSupportedTitle: "NFC Non Supporté",
    notSupportedDesc: "Votre appareil ne possède pas le matériel nécessaire pour NFC.",
    pinDesc: "Choisissez un code PIN de sécurité (4-6 chiffres). Il sera demandé en plus de la puce si la biométrie (FaceID) échoue.",
    pinPlaceholder: "Code PIN",
    btnContinue: "Continuer",
    writeDesc: "Le code PIN est sécurisé. Générons maintenant la cryptographie et écrivons-la sur votre puce physique.",
    btnWrite: "Écrire sur la puce NFC",
    errorTitle: "Erreur",
    errorPinShort: "Le code PIN doit faire au moins 4 chiffres.",
    errorNoPassword: "Impossible de récupérer la clé locale pour l'encodage.",
    errorWriteFailed: "Impossible d'écrire sur la puce.",
    successTitle: "Succès",
    successDesc: "Puce NFC configurée avec succès ! Vous pouvez maintenant l'utiliser pour vous connecter.",
    promptFaceId: "Autoriser l'utilisation de FaceID pour cette puce NFC",
    promptFallback: "Utiliser le PIN",
    promptNfcScan: "Approchez votre puce NTAG213 pour la lier",
    errorAnonymousSignature: "Vault password introuvable pour la signature anonyme."
  },
  vaultAlerts: {
    authCancelled: "Authentification annulée ou indisponible.",
    saveError: "Erreur de sauvegarde",
    autoSaveError: "Erreur de sauvegarde automatique"
  },
  walletAlerts: {
    connectToSign: "Connectez votre wallet pour signer (WalletConnect).",
    walletNotDetectedSave: "Wallet non détecté. Connectez un wallet pour sauvegarder.",
    walletNotDetectedSync: "Wallet non détecté. Connectez un wallet pour synchroniser.",
    connectWalletSync: "Connectez votre wallet pour synchroniser."
  },
  premiumAlerts: {
    iapOnlyNative: "Achats in-app disponibles uniquement sur l'app native (pas dans Expo Go).",
    noRestore: "Aucun achat à restaurer.",
    purchaseError: "Erreur d'achat",
    needWalletForLicense: "Connectez d’abord le wallet (même adresse que sur le web / l’extension).",
    licenseApiUnavailable: "URL du serveur premium non configurée dans le build de l’app.",
    licenseEmpty: "Saisissez la clé de licence.",
    licenseInvalid: "Clé invalide ou déjà utilisée.",
    licenseActivated: "Licence activée. Premium synchronisé sur vos appareils.",
    keyCopied: "Clé de licence copiée."
  },
  listScreen: {
    all: "Tous",
    login: "Login",
    cards: "Cartes",
    notes: "Notes",
    identities: "Identités",
    searchPlaceholder: "Rechercher…",
    entry: "entrée",
    entries: "entrées",
    sortAz: "Tri : A→Z",
    sortZa: "Tri : Z→A",
    noResult: "Aucun résultat",
    emptyHint: "Aucune entrée.\nAppuyez sur + pour ajouter.",
    quickSearchTitle: "⌘ Recherche rapide",
    noResults: "Aucun résultat",
    noRecentEntries: "Aucune entrée récente",
    recent: "Récents"
  },
  detailScreen: {
    back: "Retour",
    edit: "Modifier",
    delete: "Supprimer",
    deleteShort: "Suppr.",
    deleteConfirm: "Supprimer « {title} » ?",
    show: "Afficher",
    hide: "Masquer",
    credentials: "Identifiants",
    civility: "Civilité",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    phone: "Téléphone",
    birthDate: "Date de naissance",
    address: "Adresse",
    postalCode: "Code postal",
    city: "Ville",
    country: "Pays",
    cardNumber: "Numéro de carte",
    expiration: "Expiration",
    cardholder: "Titulaire",
    content: "Contenu",
    site: "Site",
    username: "Identifiant",
    premiumRequired: "Premium requis",
    subscribe: "S'abonner",
    noName: "Sans nom",
    card: "Carte"
  },
  addEntryScreen: {
    cancel: "Annuler",
    edit: "Modifier",
    newEntry: "Nouvelle entrée",
    save: "Enregistrer",
    site: "Site",
    sitePlaceholder: "ex : github.com",
    username: "Identifiant",
    usernamePlaceholder: "email ou nom d'utilisateur",
    password: "Mot de passe",
    passwordPlaceholder: "Saisir ou générer",
    totp: "2FA",
    totpPlaceholder: "Secret",
    totpPremiumRequired: "Premium requis pour ajouter un code 2FA — S'abonner",
    notes: "Notes",
    notesPlaceholder: "Notes",
    tags: "Tags",
    tagsPlaceholder: "ex: travail, perso, banque",
    cardNumber: "Numéro de carte",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiry: "Expiration",
    expiryPlaceholder: "12/28",
    cvv: "CVV",
    cvvPlaceholder: "123",
    cardholder: "Titulaire de la carte",
    cardholderPlaceholder: "NOM Prénom",
    cardTitle: "Titre (optionnel)",
    cardTitlePlaceholder: "Ex: Monabanq, N26...",
    noteTitle: "Titre",
    noteTitlePlaceholder: "Titre de la note",
    noteContent: "Contenu",
    noteContentPlaceholder: "Contenu de la note…",
    maskedByDefault: "Masquer par défaut",
    civility: "Civilité",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    emailPlaceholder: "email@exemple.com",
    phone: "Téléphone",
    phonePlaceholder: "+33 6 12 34 56 78",
    birthDate: "Date de naissance",
    birthDatePlaceholder: "JJ/MM/AAAA",
    address: "Adresse",
    addressPlaceholder: "Numéro et rue",
    postalCode: "Code postal",
    postalCodePlaceholder: "75001",
    city: "Ville",
    cityPlaceholder: "Paris",
    country: "Pays",
    countryPlaceholder: "France",
    login: "Login",
    card: "Carte",
    note: "Note",
    identity: "Identité",
    favorite: "Favori",
    favoriteYes: "Oui",
    favoriteNo: "☆ Non",
    newGroup: "Nouveau groupe",
    groupNamePlaceholder: "Nom du groupe"
  },
  settingsPage: {
    back: "Retour",
    loading: "Chargement",
    premiumDescription: "Un abonnement Premium actif sur iOS, l'extension ou la webapp est valable sur tous les appareils (même compte wallet ou email).",
    premiumFeaturesTitle: "Inclus avec Premium :",
    activateKeyHint: "Activer une clé reçue par email ou après achat.",
    buyLicense: "Acheter une licence",
    keyActivated: "Clé activée. Rechargez la page coffre pour voir le Premium.",
    connectWalletPremium: "Connectez votre wallet pour voir le statut Premium ou activer une clé.",
    syncCidDescription: "Vider le cache du CID pour forcer une récupération fraîche depuis l'API.",
    connectWallet: "Connectez votre wallet.",
    aboutDescription: "Vault Keeper stocke vos mots de passe de manière décentralisée. Aucune donnée n'est envoyée à nos serveurs. Votre vault chiffré est stocké sur IPFS.",
    langEn: "English",
    langFr: "Français",
    import: "Importer",
    importDescription:
    "Importez votre coffre depuis une autre app. Pris en charge : JSON Bitwarden (non chiffré), JSON Proton Pass, VaultKeepR, 1PIF 1Password, CSV (plusieurs fournisseurs), PGP. Non pris en charge : export Bitwarden chiffré, fichier .1pux 1Password.",
    importFormats:
    "JSON Bitwarden, JSON Proton Pass, JSON VaultKeepR, CSV (LastPass, Chrome, 1Password…), 1PIF (1Password), PGP",
    importSuccess: "{count} entrée(s) importée(s). Retournez au coffre pour les voir.",
    importPgpHint: "Passphrase PGP pour déchiffrer le fichier :",
    importVaultPasswordHint: "Mot de passe maître Vault Keeper :",
    export: "Exporter",
    exportDescription: "Exportez votre coffre. Déverrouillez le coffre d'abord, puis revenez ici pour exporter.",
    exportPlain: "JSON (clair)",
    exportEncrypted: "JSON (chiffré)",
    exportPgp: "PGP",
    exportUnlockHint: "Déverrouillez le coffre d'abord, puis revenez dans Paramètres pour exporter.",
    exportEncryptedHint: "Mot de passe maître pour chiffrer l'export :",
    exportPgpHint: "Passphrase PGP pour chiffrer l'export :",
    exportSaved: "Fichier enregistré avec succès.",
    premiumLegacyHint: "Vous utilisez le Premium via votre Wallet. Pour utiliser le Premium sur d'autres appareils (iOS, Firefox), générez une clé de licence sur la Web App.",
    manageOnWeb: "Gérer sur le Web",
    migrateHint: "Migrez votre abonnement mobile existant vers VaultKeepR.",
    migrateButton: "Migrer VaultKeepR Go"
  },
  walletConnect: {
    wallet: "Wallet",
    disconnect: "Déconnecter",
    scanWithWallet: "Scannez avec votre wallet mobile",
    copyUri: "Copier l'URI",
    connect: "Connecter le wallet",
    connecting: "Connexion…",
    openExtensions: "Ouvrir Extensions",
    lastVaultCid: "Dernier CID du coffre",
    viewOnIpfs: "Ouvrir sur ipfs.io",
    noVaultCid: "Aucun CID pour l'instant. Enregistrez sur IPFS depuis l'en-tête ou activez le Vault Sync."
  },
  autosaveDelegation: {
    autosaveIpfs: "Vault Sync",
    syncDays: "Délégation signée ~7 jours",
    autosaveActive: "Vault Sync actif",
    renew: "Renouveler",
    activate: "Activer",
    connectAndActivate: "Connecter et activer",
    orViaApp: "Ou via l'app"
  },
  autosaveQr: {
    title: "Vault Sync",
    preparing: "Préparation…",
    scanWithWallet: "Scannez avec votre wallet",
    copyUri: "Copier l'URI",
    activated: "Activé",
    close: "Fermer",
    cancel: "Annuler",
    openWalletRetry: "Ouvrez le wallet sur votre téléphone, acceptez la demande de signature, puis réessayez.",
    signatureRejected: "Signature refusée dans le wallet.",
    unknownError: "Erreur inconnue",
    walletSign: "Ouvrez votre wallet et approuvez la signature",
    walletSignHint: "Une notification a été envoyée à votre wallet connecté"
  },
  alias: {
    title: "Alias email",
    description: "Créez des alias xxx@vaultkeepr.xyz qui redirigent vers votre email. Désactivez à tout moment.",
    destinationEmail: "Rediriger vers",
    destinationPlaceholder: "vous@example.com",
    create: "Créer un alias",
    mainAddress: "Adresse principale",
    empty: "Aucun alias pour l'instant.",
    enable: "Activer",
    disable: "Désactiver",
    inactive: "Désactivé",
    premiumRequired: "L'alias email nécessite Premium.",
    walletRequired: "Déverrouillez votre coffre pour gérer les alias.",
    deleteConfirm: "Supprimer cet alias ? Les mails ne seront plus redirigés."
  },
  vaultContext: {
    saveToIpfsConfirm: "Enregistrer sur IPFS maintenant ?",
    masterPasswordPrompt: "Mot de passe maître :",
    vaultSavedIpfs: "Vault enregistré sur IPFS.",
    saveFailed: "Échec.",
    openAppUnlock: "Ouvrez l'application, déverrouillez le coffre, puis réessayez.",
    deleteError: "Erreur : impossible de supprimer",
    saveError: "Erreur : impossible d'enregistrer",
    noLoginForm: "Aucun formulaire de connexion détecté sur cette page.",
    fillErrorPrefix: "Impossible de remplir : ",
    reloadRetry: "Rechargez la page puis réessayez.",
    exportEncryptedPrompt: "Mot de passe maître pour chiffrer l'export (à retenir pour importer ailleurs) :",
    exportDownloaded: "Export chiffré téléchargé.",
    importEncryptedPrompt: "Mot de passe maître de l'export chiffré :",
    importPgpPrompt: "Passphrase PGP pour déchiffrer le fichier :",
    entriesImported: "{count} entrée(s) importée(s).",
    unknownFormat: "Format JSON non reconnu.",
    noEntriesFound: "Aucune entrée trouvée.",
    entriesImportedOpenApp: "{count} entrée(s) importée(s). Ouvrez l'app et enregistrez pour les ajouter au coffre.",
    importAdded: "ajoutée(s)",
    importSkipped: "doublon(s) ignoré(s)",
    importEnriched: "enrichie(s) (2FA ajouté)",
    savedIpfs: "Enregistré sur IPFS (sync cross-device)",
    savedLocally: "Enregistré localement",
    remoteNewerForce: "Forcer l'enregistrement",
    fillDemo: "[Demo] Remplissage : {username}",
    fillIdentityDemo: "[Demo] Remplissage identité : {name}",
    zeroDuplicates: "0 doublon",
    licenseKeyCopied: "Clé de licence copiée",
    deviceRevoked: "Appareil révoqué",
    cidUnpinned: "CID IPFS détaché"
  },
  passwordGenerator: {
    placeholder: "Saisir ou générer",
    generate: "Générer",
    length: "Longueur",
    uppercase: "Majuscules",
    lowercase: "Minuscules",
    numbers: "Chiffres",
    symbols: "Car. spéciaux",
    char: "caractère",
    chars: "caractères"
  },
  pwnedPassword: {
    found: "Ce mot de passe apparaît {{count}} fois dans des fuites de données connues (Have I Been Pwned).",
    checkFailed: "Impossible de vérifier la base des fuites (réseau).",
    attribution: "Vérification : Have I Been Pwned (k-anonymité)"
  },
  productGuide: {
    webWalletCalloutTitle: "Clé matérielle NFC ou Wallet (sync)",
    webWalletCalloutBody:
    "Votre coffre est chiffré sur l'appareil avec votre mot de passe maître. L'utilisation d'une puce NFC ou d'un portefeuille Web3 permet d'associer une adresse à vos sauvegardes chiffrées sur IPFS. Vous pouvez vous connecter quand vous le souhaitez.",
    tooltipWhyWallet:
    "Votre portefeuille Web3 ou votre puce NFC crée une signature cryptographique pour lier vos données à votre adresse. Vos clés et mots de passe ne quittent jamais votre appareil.",
    tooltipLocalFirst:
    "Vous pouvez créer un coffre 100% local. Plus tard, utilisez votre clé NFC ou connectez un wallet via les Paramètres pour chiffrer et envoyer une copie sur IPFS.",
    tooltipIpfsEncrypted:
    "Seul le contenu chiffré est archivé sur IPFS. Le déchiffrement nécessite votre mot de passe maître ET la signature (NFC/Wallet) générée sur votre appareil.",
    hintLinkWallet: "NFC & Wallet",
    hintLinkLocal: "Mode Local",
    hintLinkIpfs: "Sauvegarde IPFS",
    importBlockTitle: "Importer depuis un autre gestionnaire",
    importBlockBody:
    "Importez JSON Bitwarden, JSON Proton Pass, JSON VaultKeepR, export 1Password au format 1PIF (une ligne JSON par enregistrement), CSV type LastPass / Chrome / 1Password / Dashlane, ou fichier enveloppé PGP. Tout est analysé localement. Le format .1pux (ZIP chiffré 1Password) n’est pas pris en charge — exportez en CSV ou 1PIF depuis 1Password.",
    tooltipImportFormats:
    "Bitwarden JSON non chiffré, Proton Pass JSON, VaultKeepR JSON/chiffré, 1Password 1PIF, CSV avec colonnes URL / identifiant / mot de passe, fichiers OpenPGP. Export Bitwarden chiffré non supporté. .1pux non supporté.",
    importStep1: "Exportez depuis votre ancienne appli (JSON, 1PIF, CSV ou fichier PGP).",
    importStep2: "Choisissez le fichier ci-dessous. Le déchiffrement est local dans le navigateur.",
    importStep3: "Déverrouillez avec le mot de passe maître VaultKeepR si l’import est chiffré.",
    importStep4: "Enregistrez le coffre — les entrées sont fusionnées avec le coffre ouvert.",
    importPrivacyTip: "Après un import réussi, supprimez le fichier d’export de votre appareil.",
    tooltipImportFileButton: "Sélectionnez un export Bitwarden, Proton Pass, VaultKeepR, CSV, .1pif ou PGP sur votre ordinateur.",
    autofillTitle: "Remplissage automatique dans le navigateur",
    autofillBody:
    "Sur les sites, ouvrez cette extension pour remplir identifiant et mot de passe. Avec Premium, les codes TOTP sont générés localement à partir du secret enregistré sur l’entrée.",
    tooltipAutofillFields:
    "La détection dépend du HTML de chaque site. Si aucune suggestion n’apparaît, copiez le mot de passe depuis le coffre.",
    tooltipAutofillTotp:
    "Les mots de passe à usage unique sont calculés sur votre appareil à partir du secret TOTP ; rien ne nous est envoyé.",
    autofillQualityNote: "Les formulaires de connexion atypiques peuvent nécessiter un copier-coller — c’est normal.",
    hintAutofillFields: "Détection des champs",
    hintAutofillTotp: "2FA / TOTP",
    tooltipExtTabIpfs:
    "Chargez un coffre déjà sauvegardé sur IPFS : connectez le même wallet, saisissez le mot de passe maître, puis déverrouillez.",
    tooltipExtTabLocalVault:
    "Créez d’abord un coffre stocké uniquement dans ce navigateur. Connectez un wallet dans Paramètres plus tard pour synchroniser des sauvegardes chiffrées sur IPFS.",
    extLockedAutofillHint:
    "Astuce : après déverrouillage, utilisez l’extension sur les pages de connexion pour l’autofill — ou copiez depuis une entrée si le site est particulier."
  },
  downloadPage: {
    title: "Obtenir VaultKeepR",
    subtitle: "Disponible sur Chrome et iOS. Même coffre, même chiffrement, partout.",
    extensionTitle: "Extension Chrome",
    extensionDesc: "Remplissage auto, codes TOTP, synchronisation du coffre — directement dans votre navigateur.",
    extensionCta: "Ajouter à Chrome",
    iosTitle: "Application iOS",
    iosDesc: "Face ID, AutoFill, Account Abstraction — votre coffre toujours dans votre poche.",
    iosCta: "App Store",
    webTitle: "Application Web",
    webDesc: "Coffre complet dans votre navigateur. Aucune installation — connectez votre wallet et c'est parti.",
    webCta: "Ouvrir l'app web",
    privacyTitle: "Aucun tracking. Aucun log.",
    privacyDesc: "VaultKeepR ne collecte aucune donnée analytique, aucune télémétrie, aucune donnée utilisateur. Votre coffre est chiffré de bout en bout et vous seul détenez les clés.",
    recommended: "Recommandé",
    backHome: "Retour à l'accueil"
  },
  landing: {
    shopBanner: "Nouveauté : Sécurisez votre coffre avec notre <a href='/shop/fr' class='underline underline-offset-2 font-bold hover:text-white/80 transition-colors'>Porte-clés NFC VaultKeepR</a> exclusif !",
    navHow: "Comment ça marche",
    navFeatures: "Fonctionnalités",
    navTerms: "CGU",
    navPrivacy: "Confidentialité",
    chromeExtension: "Extension Chrome",
    firefoxAddon: "Add-on Firefox",
    appStore: "App Store",
    navPremium: "Premium",
    navDownload: "Télécharger",
    navTurboTest: "Test Turbo",
    navOpenApp: "Ouvrir l'app",
    heroSubtitle: "Protégez vos mots de passe, identités et documents sans jamais nous les confier. Connectez-vous avec votre empreinte, votre visage, ou un appareil sécurisé que vous possédez déjà. Extension, iOS, Android.",
    heroCta: "Essayer gratuitement",
    trustBadge: "Vie privée par conception",
    trustTitle: "Personne ne voit vos mots de passe. Même pas nous.",
    trustSubtitle: "Vos mots de passe sont verrouillés sur votre appareil avant même d'en sortir. Votre coffre chiffré est stocké sur le réseau décentralisé IPFS, illisible sans votre clé.",
    pillar1Title: "Vos données restent chez vous",
    pillar1Desc: "Vos mots de passe sont verrouillés sur votre appareil avant d'être stockés. Même en cas de panne, le stockage décentralisé P2P préserve votre coffre.",
    pillar2Title: "Pas de compte, pas d'email",
    pillar2Desc: "Connectez-vous avec votre empreinte ou votre visage. Nous ne demandons ni nom, ni email, ni mot de passe. Personne ne peut pirater un compte qui n'existe pas.",
    pillar3Title: "Vous n'êtes jamais prisonnier",
    pillar3Desc: "Vos données ne sont pas enfermées chez nous. Si notre service disparaît demain, vos mots de passe restent accessibles. Vous pouvez partir quand vous voulez.",
    howTitle: "Comment ça marche",
    howSubtitle: "De l'installation à la sauvegarde chiffrée, en quelques étapes simples.",
    step1Title: "Créez votre coffre",
    step1Desc: "Une identité sécurisée est créée automatiquement via votre Smart Account intégré. Pas d'inscription, pas d'app externe, pas de portefeuille requis.",
    step2Title: "Choisissez votre verrou",
    step2Desc: "Choisissez un mot de passe maître, utilisez votre empreinte, ou un Passkey. Votre clé de coffre en est dérivée et n'est jamais stockée nulle part.",
    step3Title: "Sauvegarde automatique",
    step3Desc: "Votre coffre chiffré est sauvegardé sur IPFS automatiquement. Aucun point de défaillance unique, aucune base de données centrale.",
    step4Title: "Utilisez partout",
    step4Desc: "Application mobile, extension navigateur avec auto-remplissage, Face ID, biométrie. Même coffre, tous vos appareils.",
    featuresTitle: "Pensé pour l'usage réel",
    featuresSubtitle: "Synchronisez, récupérez et protégez vos identifiants—sans nous confier vos mots de passe.",
    feat1Title: "Invisible pour nous",
    feat1Desc: "Vos mots de passe ne sont déchiffrés que sur votre appareil. Nous ne voyons jamais vos mots de passe, cartes ou notes — par conception.",
    feat2Title: "Aucun compte requis",
    feat2Desc: "Pas d'email, pas de formulaire d'inscription. Votre Smart Account est votre identité. Un vecteur d'attaque en moins.",
    feat3Title: "Identité souveraine",
    feat3Desc: "Votre identité est un Smart Account sur la blockchain. Aucun serveur centralisé ne conserve d'historique de qui vous êtes.",
    feat4Title: "Sauvegarde IPFS",
    feat4Desc: "Coffre chiffré stocké sur IPFS. Jamais rien en clair de notre côté. Vous contrôlez votre CID.",
    feat5Title: "Biométrie + PRF",
    feat5Desc: "WebAuthn PRF dérive la clé de votre empreinte ou de votre visage. Un véritable chiffrement sans mot de passe ni portefeuille externe.",
    feat6Title: "Chiffrement moderne",
    feat6Desc: "Dérivation Argon2id et chiffrement XChaCha20-Poly1305. Les meilleurs standards de l'industrie pour votre coffre.",
    feat7Title: "Extension, iOS, Android",
    feat7Desc: "Autofill navigateur, AutoFill iOS et Android, interface coffre complète : groupes, identités, TOTP.",
    feat8Title: "Import & export",
    feat8Desc: "Bitwarden, CSV, JSON, PGP. Export clair, chiffré ou enveloppe PGP pour vos propres sauvegardes.",
    feat9Title: "Pas de pub, pas de tracking",
    feat9Desc: "Aucune publicité, aucun profilage comportemental. Premium et alias : flux standards uniquement si vous y consentez.",
    feat10Title: "Vault Sync",
    feat10Desc: "Après déverrouillage, vos modifications sont synchronisées de manière transparente sur IPFS et mettent à jour le registre on-chain.",
    feat11Title: "Récupération fragmentée (Premium)",
    feat11Desc: "Divisez votre coffre en 5 fragments (Shamir 3-of-5). La récupération est autonome et indépendante de votre appareil.",
    feat12Title: "Alias email (Premium)",
    feat12Desc: "Adresses de relais pour masquer votre vraie boîte aux inscriptions et fuites.",
    feat13Title: "Auth multimodale",
    feat13Desc: "Déverrouillez avec des passkeys biométriques, un mot de passe maître ou des clés de sauvegarde NFC physiques.",
    feat14Title: "Documents sécurisés",
    feat14Desc: "Stockez vos pièces d'identité, fragmentées et chiffrées avant la synchronisation IPFS.",
    feat15Title: "Surveillance de sécurité",
    feat15Desc: "Suivez vos approbations DApps, scannez les brèches et recevez des alertes quand quelque chose mérite votre attention.",
    feat16Title: "Cloud chiffré",
    feat16Desc: "Stockez vos fichiers dans un cloud chiffré (S3). De 10 Mo (gratuit) à Illimité selon votre plan.",
    feat17Title: "Quick Share",
    feat17Desc: "Partagez vos identifiants via des liens éphémères zero-knowledge. Le destinataire n'a pas besoin de compte.",
    feat18Title: "Analyse TOS IA",
    feat18Desc: "L'IA analyse les CGU pour identifier le partage de donnees et les droits de suppression, et detecte le phishing.",
    feat19Title: "Santé des mots de passe",
    feat19Desc: "Scanner de brèches, audit de robustesse et détection de réutilisation. Identifiez vos mots de passe faibles.",
    ctaTitle: "Prêt à protéger ce qui compte ?",
    ctaSubtitle: "Démarrez en quelques secondes. Aucun compte requis, aucune donnée collectée.",
    ctaButton: "Essayer gratuitement",
    techTitle: "Sous le capot",
    techSubtitle: "Pour les développeurs et auditeurs de sécurité : les technologies derrière VaultKeepR.",
    tech1Name: "IPFS",
    tech1Desc: "Stockage adressé par contenu pour les blobs de coffre chiffrés",
    tech2Name: "Open source",
    tech2Desc: "Cœur et clients vérifiables par la communauté",
    tech3Name: "Smart Wallet",
    tech3Desc: "Signature wallet standard (EIP-191), sans custodian",
    tech4Name: "Argon2id",
    tech4Desc: "Dérivation de clé coûteuse en mémoire",
    tech5Name: "S3 Cloud",
    tech5Desc: "Stockage de fichiers chiffré zero-knowledge",
    privacyBadgeLabel: "Zéro données collectées",
    privacyBadgeTitle: "Votre vie privée n'est pas un réglage. C'est notre fondation.",
    privacyBadgeSubtitle: "VaultKeepR ne collecte aucune donnée analytique, aucune télémétrie, aucune donnée utilisateur. Nous sommes dans l'incapacité de voir ce que vous stockez.",
    privacyBadge1Title: "Zéro tracking",
    privacyBadge1Desc: "Aucune analyse, aucun cookie, aucun traceur. Nous ne savons pas qui vous êtes et ne le saurons jamais.",
    privacyBadge2Title: "Rien à voler",
    privacyBadge2Desc: "Vos mots de passe sont chiffrés sur votre appareil avant stockage. Nous ne détenons que des coffres scellés — il n'y a rien à pirater.",
    privacyBadge3Title: "Verrouillé avant de partir",
    privacyBadge3Desc: "Chiffré de bout en bout avec des algorithmes de grade militaire. Votre mot de passe maître ne quitte jamais votre appareil.",
    heroH1Prefix: "Le",
    heroH1Main: "Gestionnaire Zero-Knowledge",
    heroH1Suffix: "qui n'a pas besoin de votre email.",
    heroCtaDetailed: "Essayer VaultKeepR gratuit — Aucun email requis",
    heroReassurance: "Gratuit pour toujours  •  Open source  •  2 minutes d'installation",
    heroSecondaryCta: "ou voir comment ça marche",
    heroGitHubStars: "étoiles sur GitHub",
    trustSignalNoEmail: "Aucun email requis",
    trustSignalOpenSource: "Open source",
    trustSignalAuditable: "100% auditable",
    trustSignalFreeForever: "Gratuit pour toujours",
    miniPricingTitle: "Gratuit pour tous. Premium pour la commodité.",
    miniPricingSubtitle: "Toutes les fonctionnalités de sécurité sont gratuites, pour toujours. Premium ajoute la sauvegarde cloud chiffrée, l'authentificateur TOTP et la récupération Shamir.",
    miniPricingFreeTitle: "Gratuit",
    miniPricingFreePrice: "0 €",
    miniPricingFreePeriod: "pour toujours",
    miniPricingFreeCta: "Commencer",
    miniPricingFreeFeat1: "Mots de passe & cartes illimités",
    miniPricingFreeFeat2: "Chiffrement XChaCha20 + Argon2id",
    miniPricingFreeFeat3: "Chrome, Firefox, iOS, Android",
    miniPricingFreeFeat4: "Sync décentralisé IPFS",
    miniPricingFreeFeat5: "Pas d'email, pas de compte",
    miniPricingPremiumTitle: "Premium",
    miniPricingPremiumPrice: "2,49 €",
    miniPricingPremiumPeriod: "/mois",
    miniPricingPremiumCta: "Passer à Premium",
    miniPricingPremiumFeat1: "Tout ce qui est dans Gratuit",
    miniPricingPremiumFeat2: "Sauvegarde cloud chiffrée (1 Go)",
    miniPricingPremiumFeat3: "Authentificateur TOTP",
    miniPricingPremiumFeat4: "Récupération Shamir (3-sur-5)",
    miniPricingPremiumFeat5: "Support prioritaire",
    miniPricingPremiumFeat6: "Paiement crypto anonyme",
    miniPricingCompareAll: "Comparer tous les plans",
    stickyNavFeatures: "Fonctionnalités",
    stickyNavHowItWorks: "Comment ça marche",
    stickyNavSecurity: "Sécurité",
    stickyNavCompare: "Comparer",
    stickyNavPricing: "Tarifs",
    stickyNavFaq: "FAQ",
    comparePreviewTitle: "Comment VaultKeepR se compare-t-il ?",
    comparePreviewSubtitle: "En face à face avec les gestionnaires les plus populaires. Mêmes fonctionnalités, philosophie différente.",
    bannerCloseAria: "Fermer l'annonce",
    footerTerms: "CGU",
    footerPrivacy: "Politique de confidentialité",
    footerDocs: "Documentation",
    footerSecurity: "Sécurité",
    footerChangelog: "Changelog",
    footerGithub: "GitHub",
    footerSocialGithubAria: "Dépôt vaultkeepr-core sur GitHub",
    footerSocialXAria: "VaultKeepR sur X (@vaultkeepr_xyz)",
    footerContact: "Contact",
    contactTitle: "Nous contacter",
    contactIntro:
    "Nous lisons chaque message. N’envoyez jamais votre mot de passe maître ni le contenu de votre coffre ici.",
    contactName: "Nom",
    contactEmail: "E-mail",
    contactMessage: "Message",
    contactSubmit: "Envoyer",
    contactSending: "Envoi…",
    contactSuccess: "Merci. Nous vous répondrons dès que possible.",
    contactError: "Une erreur s’est produite. Réessayez plus tard.",
    contactClose: "Fermer",
    contactRequired: "Veuillez remplir tous les champs.",
    contactInvalidEmail: "Adresse e-mail invalide.",
    contactResendError: "L’envoi depuis ce formulaire est indisponible pour le moment. Réessayez plus tard ou utilisez un autre canal indiqué dans la politique de confidentialité.",
    contactInboxError:
    "Nous ne pouvons pas encore recevoir de messages via ce formulaire. Essayez la page Sécurité ou les contacts indiqués dans la politique de confidentialité.",
    contactConfigError: "Le formulaire de contact n’est pas disponible sur cette instance.",
    footerCopyright: "Tous droits réservés.",
    loading: "Chargement…",
    comingSoonTitle: "Bientôt disponible",
    comingSoonSubtitle:
    "Nous préparons le lancement public de VaultKeepR. Merci de votre patience — à très bientôt.",
    comingSoonCountdownTitle: "Compte à rebours",
    comingSoonUnitDays: "Jours",
    comingSoonUnitHours: "Heures",
    comingSoonUnitMinutes: "Minutes",
    comingSoonUnitSeconds: "Secondes",
    comingSoonLive: "Le compteur est terminé — l’ouverture publique arrive très bientôt.",
    comingSoonEmailPlaceholder: "Votre email pour un accès anticipé",
    comingSoonEmailCta: "Rejoindre la waitlist",
    comingSoonEmailSuccess: "Vous êtes sur la liste ! On vous préviendra au lancement.",
    comingSoonFeat1Title: "Zéro-connaissance",
    comingSoonFeat1Desc: "Chiffré sur votre appareil avec Argon2id + XChaCha20. Impossible de lire vos données — par design.",
    comingSoonFeat2Title: "Connexion Wallet",
    comingSoonFeat2Desc: "Connectez-vous via un Smart Wallet intégré avec Account Abstraction. Pas d'email, pas de mot de passe.",
    comingSoonFeat3Title: "Sauvegarde IPFS",
    comingSoonFeat3Desc: "Votre coffre chiffré est synchronisé entre vos appareils via IPFS. Décentralisé et résilient.",
    comingSoonFeat4Title: "Multi-plateforme",
    comingSoonFeat4Desc: "App web, extension Chrome et iOS. Un seul coffre, partout.",
    heroTagIpfs: "Sauvegarde IPFS",
    heroTagWallet: "Aucun compte requis",
    heroTagE2e: "Chiffré de bout en bout",
    heroTagCloud: "Cloud chiffré",
    heroTagAndroid: "Android & iOS",
    playStore: "Play Store",
    langSwitchToEn: "Switch to English",
    langSwitchToFr: "Passer en français"
  },
  vaultAppEntry: {
    subtitle: "Connectez votre wallet pour ouvrir votre coffre sur ce domaine.",
    backToMarketing: "Site & présentation"
  },
  premiumPage: {
    title: "Choisissez votre offre",
    subtitle: "De l'essentiel gratuit au cloud illimité — trouvez l'offre qui vous correspond.",
    featureCol: "Fonctionnalité",
    freeCol: "Gratuit",
    premiumCol: "Premium",
    ultimateCol: "Ultimate",
    proCol: "Pro",
    featPrice: "Tarif",
    priceFree: "0 €",
    pricePremium: "14,99 € / an · 2,49 € / mois",
    priceUltimate: "69,99 € / an · 6,99 € / mois",
    pricePro: "39,99 € / an · 3,99 € / mois",
    billingLabel: "Formule",
    billingYearly: "Annuel — jusqu'à 40 % d'économie",
    billingMonthly: "Mensuel — résiliable à tout moment",
    featLogins: "Identifiants & mots de passe (illimités)",
    featCards: "Cartes bancaires & notes",
    featIdentities: "Identités & auto-remplissage",
    featIpfs: "Sauvegarde IPFS chiffrée",
    featExtension: "Extension navigateur",
    featIos: "Apps iOS & Android",
    featAndroid: "App Android",
    featExport: "Export (JSON, PGP)",
    featBreachScanner: "Scanner de brèches & santé des mots de passe",
    featQuickShare: "Quick Share (Zero-Knowledge)",
    featTosAi: "Analyse IA des CGU & anti-phishing",
    featNoEmail: "Pas d'email, pas de compte, pas de pistage",
    featTotp: "Codes TOTP (2FA authenticator)",
    featAlias: "Alias email avec redirection",
    featEarlyAccess: "Accès anticipé aux nouvelles fonctions",
    featDocuments: "Documents sécurisés",
    featDocumentsFree: "1 document",
    featDocumentsPremium: "2 documents",
    featDocumentsPro: "5 documents",
    featDocumentsUltimate: "Illimité",
    featCloudQuota: "Cloud chiffré",
    featCloudQuotaFree: "10 Mo",
    featCloudQuotaPremium: "1 Go",
    featCloudQuotaPro: "50 Go",
    featCloudQuotaUltimate: "Illimité*",
    featCloudFileSize: "Taille max par fichier",
    featCloudFileSizeFree: "5 Mo",
    featCloudFileSizePremium: "25 Mo",
    featCloudFileSizePro: "25 Mo",
    featCloudFileSizeUltimate: "50 Mo",
    featFragmented: "Vault fragmenté (Shamir 3-of-5)",
    featSupport: "Support prioritaire",
    featStorage: "Stockage chiffré illimité",
    successTitle: "Paiement réussi",
    successMessage: "Votre clé de licence a été envoyée à l'adresse email indiquée.",
    successSpam: "Vérifiez vos spams si vous ne la trouvez pas.",
    activateKey: "Activer la clé dans Paramètres",
    canceled: "Paiement annulé.",
    retry: "Réessayer",
    licenceTitle: "S'abonner maintenant",
    licenceDesc:
    "Facturation annuelle ou mensuelle. Paiement par carte via Stripe. La clé est envoyée par email après validation ; les renouvellements prolongent la même clé.",
    emailLabel: "Email pour recevoir la clé",
    emailPlaceholder: "vous@exemple.com",
    buyBtn: "S'abonner — Paiement sécurisé",
    getStarted: "Commencer",
    redirecting: "Redirection vers le paiement…",
    paymentNote: "Abonnement Stripe. Clé envoyée après paiement ; les renouvellements mettent à jour la date de fin de licence.",
    backHome: "Retour à l'accueil",
    emailRequired: "Email requis",
    paymentError: "Erreur lors du paiement",
    serverError: "Réponse invalide du serveur",
    networkError: "Erreur réseau",
    proAddon: "VaultKeepR Pro",
    proAddonDesc: "Passez à 50 Go de stockage cloud chiffré IPFS.",
    ultimateBundle: "VaultKeepR Ultimate",
    ultimateBundleDesc: "Premium + Cloud Illimité en un seul forfait. Économisez 0,49 €/mois vs achat séparé.",
    ultimateSaving: "Économisez 17 %",
    planPremium: "Premium",
    planPremiumPrice: "2,49 €/mois",
    planPremiumPriceYearly: "17,99 €/an",
    planPro: "Pro",
    planProPrice: "3,99 €/mois",
    planProPriceYearly: "39,99 €/an",
    planProRequires: "Le plus populaire",
    planUltimate: "Ultimate",
    planUltimatePrice: "6,99 €/mois",
    planUltimatePriceYearly: "69,99 €/an",
    planUltimateIncludes: "Inclut Premium + Cloud Illimité",
    cryptoTitle: "Payer en crypto",
    cryptoSubtitle: "−10 % avec USDC sur Polygon",
    cryptoLifetime: "À vie",
    cryptoAnnual: "Annuel",
    cryptoMonthly: "Mensuel",
    cryptoDiscount: "−10 %",
    cryptoLifetimeExclusive: "Exclusivité crypto"
  },
  onboarding: {
    welcomeTitle: "Bienvenue sur VaultKeepR",
    welcomeBody: "Votre coffre-fort zero-knowledge. Tout est chiffré localement — aucun serveur n'a accès à vos données.",
    vaultTitle: "Créez votre coffre-fort",
    vaultBody: "Choisissez comment stocker vos mots de passe :",
    vaultLocal: "Vault local — chiffré sur cet appareil uniquement",
    vaultLocalDesc: "Accès rapide, stockage local",
    vaultIpfs: "Sync IPFS — chiffré et synchronisé entre appareils via votre wallet",
    vaultIpfsDesc: "Décentralisé, accès partout",
    saveTitle: "Enregistrez votre premier mot de passe",
    saveBody: "Connectez-vous à n'importe quel site — VaultKeepR proposera de sauvegarder vos identifiants automatiquement.",
    skip: "Passer",
    next: "Suivant",
    done: "C'est parti !",
    replaySettings: "Revoir l'introduction",
    step1Title: "Zéro connaissance",
    step1Desc: "Vos mots de passe sont chiffrés sur votre appareil avant toute synchronisation. Aucun serveur ne voit vos données en clair.",
    step2Title: "Connexion par wallet",
    step2Desc: "Accédez via un Smart Wallet intégré sécurisé. Pas d'email ni de mot de passe de compte nécessaire.",
    step3Title: "Ajoutez vos identifiants",
    step3Desc: "Cliquez sur le bouton + pour enregistrer un identifiant, une identité ou générer un mot de passe fort. VaultKeepR détecte aussi les formulaires et propose de les sauvegarder automatiquement.",
    step4Title: "Sync IPFS",
    step4Desc: "Votre coffre est sauvegardé automatiquement après chaque modification. Ce bouton permet de forcer une synchronisation manuelle vers IPFS — votre backup chiffré, décentralisé et toujours accessible.",
    step5Title: "Votre coffre est prêt",
    step5Desc: "Explorez le générateur de mots de passe, le scanner de fuites et le partage sécurisé. Tout est à portée de main.",
    tabBarTitle: "Votre centre de commande",
    tabBarDesc: "Naviguez entre votre coffre, les codes TOTP, les outils, le partage sécurisé et le cloud.",
    searchTitle: "Recherche rapide",
    searchDesc: "Trouvez n'importe quel identifiant en un instant. Recherchez par nom, URL, pseudo ou tag.",
    start: "Commencer",
    connectCta: "Connecter mon wallet",
    doNotShowAgain: "Ne plus afficher",
    lockTabsTitle: "Deux modes de stockage",
    lockTabsDesc: "IPFS synchronise votre coffre chiffré sur tous vos appareils via votre wallet. Local le conserve uniquement sur cet appareil.",
    lockPasskeyTitle: "D\u00e9verrouillage en 1 touche",
    lockPasskeyDesc: "Créez votre coffre en quelques secondes avec Face ID, Touch ID ou le code PIN de votre appareil. Aucun mot de passe à retenir.",
    lockPasswordTitle: "Mot de passe maître",
    lockPasswordDesc: "Vous préférez le contrôle total ? Définissez un mot de passe maître — la seule clé de votre coffre. Choisissez-le soigneusement : il ne peut pas être récupéré.",
    lockOption1Title: "Option 1 — Passkey (recommandée)",
    lockOption1Desc: "1 touche avec Face ID, Touch ID ou le code PIN de votre appareil. Aucun mot de passe à retenir. Appuyez sur le bouton ci-dessus pour continuer.",
    lockOption2Title: "Option 2 — Mot de passe maître",
    lockOption2Desc: "Vous gardez le contrôle total. Choisissez un mot de passe robuste — c'est l'unique clé de votre coffre, non récupérable. Remplissez les champs ci-dessus.",
    lockNewVaultTitle: "Créez votre coffre chiffré",
    lockNewVaultDesc: "Vos mots de passe sont chiffrés localement et ne quittent jamais votre appareil sans protection. Appuyez sur le bouton pour commencer.",
    landingCreateBtn: "Créer mon coffre",
    landingUnlockBtn: "J'ai déjà un coffre",
    landingSubtitle: "Votre gestionnaire de mots de passe zero-knowledge.",
    landingDeviceSync: "Synchroniser depuis un autre appareil",
    loadingVault: "Chargement de votre coffre…",
    loadingVaultDesc: "Vérification du stockage chiffré",
    welcomeBack: "Bon retour",
    welcomeBackDesc: "Déverrouillez votre coffre pour continuer.",
    firstTime: "Première fois ici ?",
    advancedOptions: "Options avancées",
    hideAdvanced: "Masquer les options avancées",
    methodsDivider: "Ou utilisez votre mot de passe maître",
    noVaultYet: "Aucun coffre sur cet appareil",
    noVaultYetDesc: "Créez-en un en 30 secondes, ou restaurez un coffre existant.",
    createVaultIntro: "Choisissez une méthode — vous pourrez toujours changer plus tard.",
    primerTitle: "Avant de commencer",
    primerSubtitle: "VaultKeepR fonctionne differemment des autres gestionnaires de mots de passe. 3 choses a savoir.",
    primerSlide1Title: "Personne ne peut recuperer vos donnees",
    primerSlide1Desc: "Pas de serveur, pas de bouton 'mot de passe oublie'. Votre passkey ou mot de passe maitre est la seule cle qui existe. Si vous la perdez, vos donnees sont perdues -- sauf si vous configurez une methode de recuperation (backup NFC ou Shamir Secret) au prealable.",
    primerSlide2Title: "Vos donnees restent sur votre appareil",
    primerSlide2Desc: "Tout est chiffre ici meme, sur cet appareil. Meme le backup IPFS optionnel est chiffre avant de quitter l'appareil — personne ne peut le lire, pas meme nous.",
    primerSlide3Title: "Pas de compte. Juste vous.",
    primerSlide3Desc: "Pas d'email, pas d'inscription. Votre identite est votre passkey (biometrique) ou votre wallet Ethereum. C'est la seule chose necessaire pour acceder a votre coffre.",
    primerQuizTitle: "Verifions que vous avez compris",
    primerQ1: "Si vous perdez votre mot de passe maitre, que se passe-t-il ?",
    primerQ1a1: "VaultKeepR peut le reinitialiser par email",
    primerQ1a2: "Mes donnees sont perdues definitivement",
    primerQ1Wrong: "Incorrect. Il n'y a ni serveur ni email sur VaultKeepR. Votre mot de passe maitre ou passkey est le SEUL moyen de dechiffrer votre coffre. Personne ne peut le recuperer a votre place.",
    primerQ2: "Ou sont stockes vos mots de passe ?",
    primerQ2a1: "Sur les serveurs de VaultKeepR",
    primerQ2a2: "Chiffres sur mon appareil uniquement",
    primerQ2Wrong: "Incorrect. VaultKeepR n'a aucun serveur. Vos mots de passe sont chiffres et stockes localement sur votre appareil. Le backup IPFS est aussi chiffre avant de quitter l'appareil.",
    primerQ3: "Le backup IPFS est-il lisible par d'autres ?",
    primerQ3a1: "Oui, n'importe qui avec le lien peut le lire",
    primerQ3a2: "Non, il est chiffre avant de quitter mon appareil",
    primerQ3Wrong: "Incorrect. Votre backup IPFS est entierement chiffre sur votre appareil avant d'etre envoye. Meme si quelqu'un le trouve, il ne peut pas le lire sans votre cle.",
    primerQ4: "Comment cree-t-on un compte sur VaultKeepR ?",
    primerQ4a1: "Avec un email et un mot de passe comme toute autre app",
    primerQ4a2: "Il n'y a pas de compte -- juste une passkey ou un wallet",
    primerQ4Wrong: "Incorrect. VaultKeepR n'a pas de comptes, pas d'emails, pas d'inscription. Votre identite est votre passkey (biometrique) ou votre wallet Ethereum.",
    primerAllCorrect: "Vous avez tout compris.",
    primerContinue: "Creer mon coffre",
    primerIUnderstand: "Je comprends les risques, continuer"
  },
  saveBanner: {
    loginFormDetected: "Formulaire de connexion détecté",
    saveCredentials: "Sauvegarder ces identifiants",
    fillFormFirst: "Remplissez d'abord le formulaire de connexion.",
    cannotCollect: "Impossible de collecter les identifiants"
  },
  passwordFeedback: {
    tooShort: "Le mot de passe est trop court",
    addUppercase: "Ajoutez des majuscules",
    addLowercase: "Ajoutez des minuscules",
    addNumbers: "Ajoutez des chiffres",
    addSpecialChars: "Ajoutez des caractères spéciaux",
    avoidRepeated: "Évitez les caractères répétés",
    useMultipleTypes: "Utilisez plusieurs types de caractères",
    veryWeak: "Mot de passe très faible"
  },
  passwordHealth: {
    noEntries: "Aucun identifiant à analyser.",
    noEntriesHint: "Ajoutez des entrées au coffre pour voir le rapport de santé.",
    vaultHealth: "Santé du coffre",
    scoreGood: "Bon niveau de sécurité ! Quelques améliorations restent possibles.",
    scoreFair: "Niveau de sécurité correct. Renforcez les mots de passe faibles.",
    scoreWeak: "Sécurité insuffisante. Plusieurs mots de passe doivent être changés.",
    scoreCritical: "Sécurité critique. Changez immédiatement vos mots de passe les plus faibles.",
    statCritical: "Critiques",
    statWeak: "Faibles",
    statFair: "Corrects",
    statStrong: "Forts",
    statReused: "Réutilisés",
    filterAll: "Tout",
    filterReused: "Réutilisés",
    showAll: "Voir tout",
    issueEmpty: "Mot de passe vide",
    issueTooShort: "Trop court (< 8 caractères)",
    issueNoCharTypes: "Pas assez de types de caractères",
    issueNoDigitSymbol: "Aucun chiffre ni symbole",
    issueRepeated: "Trop de caractères répétés",
    issueCommon: "Mot de passe courant (fuite connue)",
    issueSingleChar: "Un seul caractère répété",
    issueSequence: "Séquence prévisible",
    issueReused: "Réutilisé sur {count} autre(s) site(s)",
    issueOld: "Ancien mot de passe ({months} mois)",
    statExpired: "Expires",
    filterExpired: "Expires",
    statTwoFactorMissing: "2FA Manquant",
    filterTwoFactorMissing: "2FA Manquant",
    statUnsecureWebsites: "Non sécurisé",
    filterUnsecureWebsites: "Non sécurisé",
    issueTwoFactorMissing: "Double authentification non configurée",
    issueUnsecureUrl: "Le site n'utilise pas HTTPS"
  },
  commandPalette: {
    searchPlaceholder: "Rechercher un site, identifiant, note... (Ctrl+K)",
    noResults: "Aucun résultat pour",
    open: "Ouvrir",
    navigateWith: "Naviguer avec",
    selectWith: "Sélectionner avec",
    results: "résultats",
    bankCard: "Carte Bancaire",
    noteLabel: "Note",
    untitled: "Sans titre",
    noResultsFound: "Aucun résultat pour « {query} »",
    typeToSearch: "Tapez pour rechercher…",
    resultsCount: "{count} résultat",
    resultsCountPlural: "{count} résultats",
    copyPassword: "Copier le mot de passe",
    copyUsername: "Copier l'identifiant",
    openUrl: "Ouvrir l'URL",
    shortcutNavigate: "naviguer",
    shortcutOpen: "ouvrir",
    shortcutClose: "fermer"
  },
  socialProof: {
    sectionBadge: "Sécurité prouvée",
    sectionTitle: "Conçu pour ceux qui prennent la sécurité au sérieux",
    sectionSubtitle: "Chiffrement de niveau entreprise, zéro complexité. Vos identifiants, vos clés, vos règles.",
    stat1Value: "496",
    stat1Label: "Tests cryptographiques validés (0 échec)",
    stat2Value: "0 Octet",
    stat2Label: "Métadonnées personnelles collectées sur nos serveurs",
    stat3Value: "XChaCha20",
    stat3Label: "Chiffrement client-side AEAD à temps constant",
    stat4Value: "ERC-4337",
    stat4Label: "Smart accounts provisionnés sans portefeuille externe",
    techTitle: "Construit avec des technologies éprouvées et auditées",
    testimonialTitle: "Open source, conçu pour être vérifié",
    testimonial1Text: "Le code source est entièrement ouvert et auditable sur GitHub — aucun de nos engagements ne se cache derrière une build propriétaire.",
    testimonial1Author: "Équipe VaultKeepR",
    testimonial1Role: "Dépôt source public",
    testimonial2Text: "La cryptographie s'exécute entièrement sur votre appareil avec la dérivation Argon2id et le chiffrement XChaCha20-Poly1305 — aucun serveur ne voit jamais votre secret maître.",
    testimonial2Author: "Équipe VaultKeepR",
    testimonial2Role: "Cryptographie côté client",
    testimonial3Text: "Pas d'e-mail, pas de compte, pas de base de données centrale. Votre coffre est chiffré localement et synchronisé pair-à-pair, donc il n'y a aucun pot de miel à pirater.",
    testimonial3Author: "Équipe VaultKeepR",
    testimonial3Role: "Architecture zéro-connaissance"
  },
  passkey: {
    folder: "Passkeys",
    savePromptTitle: "Enregistrer ce passkey ?",
    savePromptBody: "Stocker ce passkey pour {{rpName}} ({{userName}}) dans VaultKeepR",
    saveButton: "Enregistrer le Passkey",
    useNative: "Utiliser le navigateur",
    authPromptTitle: "Se connecter avec un passkey",
    authPromptBody: "Choisir un passkey pour {{rpName}}",
    noPasskeys: "Aucun passkey enregistré pour ce site",
    counter: "Nombre d'utilisations",
    credentialId: "Identifiant du passkey",
    rpId: "Site",
    created: "Créé le",
    lastUsed: "Dernière utilisation",
    deleteConfirm: "Supprimer ce passkey ? Vous ne pourrez plus l'utiliser pour vous connecter.",
    vaultLocked: "Déverrouillez VaultKeepR pour utiliser les passkeys",
    providerActive: "Fournisseur de passkeys actif",
    providerDescription: "VaultKeepR peut stocker et utiliser les passkeys pour les sites compatibles.",
    noEnrollment: "Aucune clé biométrique enregistrée",
    unlockFailed: "Échec du déverrouillage biométrique",
    biometricFailed: "Échec de la vérification biométrique",
    fingerprint: "Empreinte digitale",
    touchId: "Touch ID",
    faceId: "Face ID",
    windowsHello: "Windows Hello",
    securityKey: "Clé de sécurité",
    notSupported: "WebAuthn non supporté",
    enrollmentCancelled: "Enregistrement annulé",
    cancelledByUser: "Annulé par l'utilisateur",
    enrollmentFailed: "Échec de l'enregistrement",
    label: "Passkey",
    syncPrompt: "Avez-vous déjà un compte Passkey (ex: synchronisé via iCloud/Google) ?\n\n- OK : Se connecter à mon compte existant\n- Annuler : Créer un nouveau compte Passkey",
    notFoundOrCancelled: "Aucun Passkey trouvé ou annulé.",
    creating: "Création du Passkey...",
    createdToast: "Passkey créé !",
    passkeyCreateSuccess: "Passkey configuré avec succès ! Migration du vault en cours...",
    passkeyPrfError: "Votre appareil ne supporte pas l'extension PRF nécessaire pour sécuriser le vault.",
    goPasswordlessTitle: "Go Passwordless (Account Abstraction)",
    goPasswordlessDesc: "Sécurisez votre compte avec un Passkey (FaceID / TouchID). Vous n'aurez plus jamais besoin de taper votre mot de passe, et votre identité Web3 sera gérée par un Smart Contract."
  },
  backupPassword: {
    title: "Mot de passe de secours",
    description: "Récupérez votre vault si Touch ID / Face ID est perdu",
    recommended: "Recommandé",
    warning: "Sans mot de passe de secours, la perte de votre authenticateur (Touch ID / Face ID) rendra votre vault irrécupérable.",
    set: "Définir un mot de passe de secours",
    change: "Changer le mot de passe de secours",
    remove: "Supprimer le mot de passe de secours",
    setSuccess: "Mot de passe de secours configuré",
    removed: "Mot de passe de secours supprimé",
    recover: "Mot de passe de secours",
    incorrect: "Mot de passe de secours incorrect.",
    notConfigured: "Aucun mot de passe de secours configuré.",
    unlockHint: "Saisissez votre mot de passe de secours pour récupérer le coffre"
  },
  reUnlock: {
    title: "Ré-authentification",
    body: "Votre session en arrière-plan a été réinitialisée. Ré-authentifiez-vous pour restaurer votre identité et l'abstraction de compte.",
    biometric: "Utiliser la biométrie",
    usePassword: "Utiliser le mot de passe",
    later: "Plus tard",
    unlock: "Déverrouiller",
    passwordPlaceholder: "Mot de passe maître"
  },
  securityBadge: {
    title: "Badge de Sécurité"
  },
  dapps: {
    title: "dApps & Approbations",
    settingsDesc: "Suivez vos connexions dApp et approbations de tokens",
    dappsTracked: "dApps suivies",
    totalVisits: "visites totales",
    noVisits: "Aucune visite dApp enregistrée",
    noVisitsHint: "Parcourez des dApps crypto et elles apparaîtront ici automatiquement",
    visits: "visites",
    refresh: "Actualiser",
    revokeApprovals: "Révoquer sur revoke.cash",
    clearHistory: "Effacer l'historique",
    confirmClear: "Confirmer",
    connectWallet: "Connectez un wallet d'abord",
    connectWalletHint: "Liez votre wallet dans les Param\u00e8tres pour scanner les approbations on-chain",
    scanning: "Scan des approbations on-chain…",
    scanningHint: "V\u00e9rification sur Ethereum mainnet via Etherscan",
    retry: "R\u00e9essayer",
    noApprovals: "Aucune approbation active",
    noApprovalsHint: "Votre wallet n'a aucune approbation de token sur Ethereum mainnet",
    rescan: "Scanner \u00e0 nouveau",
    unlimitedApprovals: "approbation(s) illimit\u00e9e(s)",
    allSafe: "Toutes les approbations sont limit\u00e9es",
    totalApprovals: "approbation(s) active(s)",
    revokeAdvice: "Envisagez de r\u00e9voquer celles inutilis\u00e9es",
    revoke: "R\u00e9voquer"
  },
  secureDocuments: {
    title: "Documents S\u00e9curis\u00e9s",
    subtitle: "Stockage chiffr\u00e9 et fragment\u00e9",
    addDocument: "Ajouter un document",
    limitReached: "Maximum 10 documents atteint",
    typeCni: "Carte d'identit\u00e9",
    typePassport: "Passeport",
    typePermit: "Permis de conduire",
    typeRib: "RIB / IBAN",
    typeInsurance: "Carte d'assurance",
    typeOther: "Autre document",
    revealed: "R\u00e9v\u00e9l\u00e9",
    reveal: "R\u00e9v\u00e9ler",
    revealHint: "Authentifiez-vous pour voir ce document",
    autoHide: "Masquage auto dans {seconds}s",
    encrypting: "Chiffrement\u2026",
    fragmenting: "Upload du fragment {n}/{total}\u2026",
    saved: "Document sauvegard\u00e9 de fa\u00e7on s\u00e9curis\u00e9e",
    deleteConfirm: "Supprimer d\u00e9finitivement ce document ?",
    deleteWarning: "Les fragments chiffr\u00e9s seront supprim\u00e9s d'IPFS.",
    deleted: "Document supprim\u00e9",
    ocrProcessing: "Analyse du document\u2026",
    ocrName: "Nom complet",
    ocrNumber: "Num\u00e9ro de document",
    ocrExpiry: "Date d'expiration",
    premiumRequired: "Premium requis pour les Documents S\u00e9curis\u00e9s",
    captureCamera: "Prendre une photo",
    captureCameraSub: "Scanner votre document en direct",
    captureImport: "Importer depuis la galerie",
    captureFiles: "Fichiers",
    chooseType: "Choisir le type de document",
    chooseTypeDesc: "S\u00e9lectionnez le type de document que vous souhaitez scanner et s\u00e9curiser.",
    emptyState: "Aucun document s\u00e9curis\u00e9 pour le moment",
    emptyStateHint: "Ajoutez votre carte d'identit\u00e9, passeport ou permis de conduire dans un coffre local ultra-s\u00e9curis\u00e9.",
    fileTooLarge: "Le fichier doit faire moins de 5 Mo",
    saveError: "Erreur lors de la sauvegarde du document",
    revealImage: "R\u00e9v\u00e9ler l'image",
    view: "Voir",
    metadata: "M\u00e9tadonn\u00e9es",
    size: "Taille",
    added: "Ajout\u00e9 le",
    chunks: "Fragments",
    backToTypes: "Retour aux types",
    labelPlaceholder: "Nom du document",
    documentName: "Nom du document",
    manualInfo: "Infos manuelles (OCR web limit\u00e9)",
    saveSecure: "Sauvegarder le document s\u00e9curis\u00e9",
    premiumFeature: "Fonctionnalit\u00e9 Premium",
    premiumDesc: "Les documents s\u00e9curis\u00e9s sont chiffr\u00e9s et fragment\u00e9s via XChaCha20-Poly1305. Passez au premium pour stocker jusqu'\u00e0 {MAX_SECURE_DOCUMENTS} documents.",
    maxSizeHint: "Taille max du fichier : 5 Mo",
    documentCount: "{count}/10 documents",
    downloading: "T\u00e9l\u00e9chargement des fragments\u2026",
    noInternet: "Connexion internet requise pour afficher les documents",
    formatPrompt: "Quel est le format du document ?",
    formatNew: "Nouveau Format (Avec Puce)",
    formatNewSub: "Format carte bancaire ou passeport biom\u00e9trique",
    formatOld: "Ancien Format (Sans Puce)",
    formatOldSub: "Ancien format papier ou plastifi\u00e9",
    captureVersoHint: "Prenez le verso du document en photo.",
    mrzTargetHint: "Visez la bande MRZ ici",
    nfcScanFirst: "Veuillez d'abord scanner le document (MRZ) pour obtenir le num\u00e9ro.",
    nfcScanLoading: "Lecture NFC en cours...",
    nfcScanVerify: "V\u00e9rifier l'identit\u00e9 via NFC",
    ocrBirthDateReq: "Date de Naissance (Requis pour NFC)",
    ocrPhotoExtracted: "\u2713 Photo S\u00e9curis\u00e9e Extraite",
    encryptingNfcPhoto: "Chiffrement de la photo NFC...",
    uploadNfcPhoto: "Upload photo NFC ({current}/{total})...",
    nfcSuccessTitle: "Identit\u00e9 L\u00e9gale (NFC)",
    nfcSuccessMsg: "La puce a \u00e9t\u00e9 authentifi\u00e9e. Donn\u00e9es enregistr\u00e9es.",
    nfcErrorTitle: "Erreur NFC",
    nfcErrorMsgNoChip: "La lecture n'a pas pu \u00eatre effectu\u00e9e. Assurez-vous que votre document poss\u00e8de bien une puce NFC.",
    nfcErrorMsgKeep: "La lecture n'a pas pu \u00eatre effectu\u00e9e. Assurez-vous que de maintenir le document.",
    decrypting: "Déchiffrement..."
  },
  cloud: {
    title: "Cloud",
    emptyTitle: "Votre Cloud est vide",
    emptySub: "Envoyez des fichiers chiffrés de bout en bout.",
    unlockRequired: "Veuillez déverrouiller le coffre pour chiffrer ce fichier.",
    errorTooLarge: "Le fichier est trop volumineux (25 Mo max).",
    sending: "Envoi au Cloud...",
    uploadingProgress: "Upload {current}/{total}",
    uploadError: "Erreur lors de l'upload vers le réseau.",
    fileDetail: "Détails du fichier",
    share: "Partager",
    shareFile: "Partager un fichier",
    security: "Sécurité",
    modePrivate: "Privé",
    modePrivateSub: "PIN requis",
    modePublic: "Public",
    modePublicSub: "Lien direct",
    folders: "Dossiers",
    createFolder: "Nouveau dossier",
    createFolderHint: "Entrez le nom du dossier",
    allFiles: "Tous les fichiers",
    upload: "Envoyer",
    download: "Télécharger",
    downloading: "Téléchargement...",
    downloadingProgress: "Téléchargement {current}/{total}",
    viewDocument: "Apercevoir le document",
    shareSecureLink: "Partager le lien sécurisé",
    fileNotFound: "Fichier non trouvé",
    decrypting: "Déchiffrement...",
    deleteConfirm: "Supprimer ce fichier définitivement ?",
    sortBy: "Trier par",
    sortByDate: "Par date",
    sortByName: "Par nom",
    sortBySize: "Par taille",
    files: "fichier(s)",
    photos: "Photos",
    documents: "Documents",
    empty: "Aucun fichier",
    emptyStateHint: "Envoyez votre premier fichier pour commencer.",
    originalSize: "Taille originale",
    addedAt: "Ajouté le",
    description: "Description",
    uploading: "Envoi en cours...",
    zeroKnowledge: "Chiffrement Zero-Knowledge · Fragmentation IPFS",
    encryptingData: "Sécurisation de vos données...",
    ipfsTransfer: "Transfert IPFS :",
    expiration: "Expiration",
    privacy: "Confidentialité",
    private: "Privé",
    public: "Public",
    fileName: "Nom",
    fileSize: "Taille",
    premiumRequired: "Premium requis"
  },
  share: {
    title: "Partage S\u00e9curis\u00e9",
    createTitle: "Cr\u00e9er un Partage S\u00e9curis\u00e9",
    pinLabel: "Code PIN S\u00e9curis\u00e9",
    pinHint: "Envoyez ce PIN par un canal s\u00e9par\u00e9 (SMS, Signal, etc.)",

    ttl1h: "1 Heure",
    ttl24h: "24 Heures",
    ttl7d: "7 Jours",
    ttlEphemeral: "\u00c9ph\u00e9m\u00e8re",
    ttlStandard: "Standard",
    ttlLongTerm: "Long terme",
    maxViews: "Vues max",
    unlimited: "Illimit\u00e9",
    includeTotp: "Inclure le code TOTP",
    generating: "Cr\u00e9ation du partage s\u00e9curis\u00e9...",
    linkReady: "Lien de partage pr\u00eat",
    copyLink: "Copier le lien",
    copyPin: "Copier le PIN",
    shareVia: "Partager via...",
    receiveTitle: "Partage S\u00e9curis\u00e9",
    receiveEnterPin: "Entrez le code PIN pour déchiffrer.",
    receiveDecrypting: "Déchiffrement en cours...",
    receiveExpired: "Ce partage a expiré ou a été révoqué.",
    receiveMaxViewsReached: "Ce partage a atteint sa limite de vues.",
    receiveInvalidPin: "Code PIN invalide.",
    receiveAddToVault: "Ajouter au Vault",
    quickShareTitle: "Partage Sécurisé",
    contentType: "TYPE DE CONTENU",
    typeLink: "Lien",
    typeNote: "Note",
    typeFile: "Fichier",
    generate: "Générer le lien sécurisé",
    premiumOnly: "Fonctionnalité Premium",
    premiumOnlyDesc: "Le partage standalone (lien, note, fichier) est réservé aux membres Premium.",
    linkRequired: "URL requise.",
    noteRequired: "La note est vide.",
    fileRequired: "Sélectionnez un fichier.",
    linkTitlePlaceholder: "Titre (optionnel)",
    noteTitlePlaceholder: "Titre (optionnel)",
    noteContentPlaceholder: "Contenu de la note…",
    fileDropHint: "Glisser ou cliquer pour sélectionner — 50 Mo max",
    createAnother: "Nouveau partage",
    messageSender: "Message de l’expéditeur",
    openLink: "Ouvrir le lien",
    fieldUrl: "URL",
    fieldUsername: "Identifiant",
    fieldPassword: "Mot de passe",
    fieldTotp: "Secret TOTP",
    fieldFileName: "Nom du fichier",
    receiveDownload: "T\u00e9l\u00e9charger le fichier",
    receiveAutoClearing: "Effacement automatique dans {seconds}s",
    fileLabel: "Fichier",
    fileDragDrop: "Glissez un fichier ou cliquez pour s\u00e9lectionner",
    fileMaxSize: "Taille max : 5 Mo",
    noteLabel: "Note S\u00e9curis\u00e9e",
    credentialsLabel: "Identifiants",
    zkBadge: "Chiffr\u00e9 localement \u00b7 PIN requis \u00b7 Zero-Knowledge",
    zkHint: "Le serveur ne voit qu\u2019un blob chiffr\u00e9. Le d\u00e9chiffrement se fait uniquement dans le navigateur du destinataire.",
    pinChannelHint: "Ne transmettez jamais le lien et le PIN via le m\u00eame canal",
    successTitle: "Partage cr\u00e9\u00e9 avec succ\u00e8s",
    successSub: "Chiffr\u00e9 localement \u00b7 Zero-Knowledge",
    expiration: "Expiration",
    maxViewsLabel: "Vues maximum",
    generateLink: "G\u00e9n\u00e9rer le lien s\u00e9curis\u00e9",
    shareViaNative: "Partager via iOS\u2026",
    paramError: "Erreur de param\u00e8tre",
    decryptContent: "D\u00e9chiffrer le contenu",
    hasPinQuestion: "Avez-vous le PIN\u00a0?",
    hasPinBody: "Pour d\u00e9chiffrer ce partage sans que le serveur n\u2019y ait acc\u00e8s, le code PIN re\u00e7u est requis.",
    decryptedSuccess: "D\u00e9chiffr\u00e9 avec succ\u00e8s",
    decryptedZkSub: "C\u00f4t\u00e9 client \u00b7 Zero-Knowledge",
    decryptedZkHint: "Ces donn\u00e9es ont \u00e9t\u00e9 d\u00e9chiffr\u00e9es uniquement dans votre appareil. Elles ne transitent jamais en clair.",
    autoDestructed: "Le partage s\u2019est auto-d\u00e9truit.",
    unsupportedType: "Ce type n\u2019est pas encore support\u00e9 pour le partage.",
    viewCountLabel: "Vue {current} sur {max}",
    messageLabel: "Message personnel (optionnel)",
    messagePlaceholder: "Ajoutez un message visible apr\u00e8s d\u00e9chiffrement\u2026",
    receiveInvalidLink: "Lien invalide ou expiré (clé manquante).",
    receiveFileNotFound: "Fichier introuvable.",
    receiveUnsupportedType: "Type de fichier non supporté par ce lien.",
    receiveLoadError: "Erreur de chargement.",
    receiveDownloadError: "Erreur lors du téléchargement. Le fichier est peut-être indisponible sur le réseau IPFS.",
    receiveLoadingPublic: "Chargement du partage public...",
    receiveDownloadingIpfs: "Téléchargement en cours (IPFS)...",
    receiveZkFooter: "Fichier chiffré de bout en bout \u00b7 Décryptage local uniquement",
    fileTooLarge: "Fichier trop volumineux"
  },
  pair: {
    title: "Sync inter-appareils",
    receive: "Recevoir",
    send: "Envoyer",
    sendTitle: "Envoyer vers mobile",
    sendScanInstructions: "Scannez ce QR depuis VaultKeepR sur votre téléphone pour recevoir le vault",
    sendSuccess: "Vault envoyé avec succès !",
    receiveFromPhone: "Recevoir depuis le téléphone",
    sendToDevice: "Envoyer vers un appareil",
    scanInstructions: "Scannez ce QR depuis VaultKeepR sur votre téléphone (Paramètres > Device Sync)",
    waitingForDevice: "En attente de connexion...",
    expiresIn: "Expire dans {{time}}",
    confirmSend: "Envoyer le vault ?",
    confirmSendDesc: "Votre vault chiffré sera envoyé de façon sécurisée à l'autre appareil.",
    sendVault: "Envoyer le vault",
    transferring: "Transfert en cours...",
    success: "Vault synchronisé avec succès !",
    expired: "Session expirée.",
    retry: "Générer un nouveau QR",
    error: "Erreur de transfert : {{message}}",
    openQr: "QR Code",
    scanHint: "Scannez un QR VaultKeepR",
    receiveTitle: "Recevoir depuis le Web",
    receiveScanInstructions: "Scannez ce QR depuis VaultKeepR sur votre ordinateur ou extension",
    sendInstructions: "Collez l'URI de pairing affiché sur l'autre appareil.",
    accepting: "Connexion...",
    waitingForVault: "En attente du vault...",
    importing: "Import du vault...",
    encrypting: "Chiffrement et envoi..."
  },
  security: {
    passwordHealth: "Santé des mots de passe",
    passwordHealthDesc: "Audit de la robustesse de vos mots de passe",
    breachScanner: "Breach Scanner",
    breachScannerDesc: "Vérifie si vos identifiants ont été compromis"
  },
  legacy: {
    title: "Héritage Numérique",
    description: "Désignez des bénéficiaires qui pourront accéder à votre coffre après une période d'inactivité.",
    setup: "Configurer l'héritage",
    setupDescription: "Configurez votre héritage numérique avec des bénéficiaires et un délai d'inactivité.",
    status: "Statut de l'héritage",
    beneficiaries: "Bénéficiaires",
    addBeneficiary: "Ajouter un bénéficiaire",
    removeBeneficiary: "Supprimer",
    beneficiaryAddress: "Adresse Smart Account",
    beneficiaryLabel: "Libellé (optionnel)",
    delay: "Délai d'inactivité",
    delayDescription: "Durée sans heartbeat avant déclenchement de l'héritage (30 jours à 2 ans).",
    gracePeriod: "Période de grâce",
    gracePeriodDescription: "Délai supplémentaire après expiration avant que les bénéficiaires puissent réclamer (3 à 30 jours).",
    heartbeat: "Heartbeat",
    lastHeartbeat: "Dernier heartbeat",
    sendHeartbeat: "Envoyer un heartbeat",
    daysRemaining: "jours restants",
    expired: "Expiré",
    claimable: "Réclamable",
    claimed: "Réclamé",
    active: "Actif",
    inactive: "Inactif",
    revoke: "Révoquer l'héritage",
    revokeConfirm: "Voulez-vous vraiment révoquer votre héritage numérique ? Les bénéficiaires ne pourront plus réclamer votre coffre.",
    revokeDescription: "Désactive définitivement votre héritage numérique. Aucune notification ne sera envoyée aux bénéficiaires.",
    qrScan: "Scanner un QR Code",
    pasteAddress: "Coller l'adresse",
    inviteLink: "Générer un lien d'invitation",
    inviteLinkCopied: "Lien d'invitation copié dans le presse-papiers",
    incomingTitle: "Héritages reçus",
    incomingDescription: "Coffres pour lesquels vous êtes désigné comme bénéficiaire.",
    claimButton: "Réclamer l'héritage",
    claimSuccess: "Héritage réclamé avec succès. Vous avez maintenant accès au coffre.",
    premiumRequired: "Premium requis",
    premiumRequiredDescription: "L'héritage numérique est disponible sur les plans Premium, Pro et Ultimate.",
    days: "jours",
    activate: "Activer l'héritage",
    activateConfirm: "Activer votre héritage numérique ? Votre coffre sera accessible aux bénéficiaires après la période d'inactivité configurée.",
    errorTooManyBeneficiaries: "Maximum 5 bénéficiaires autorisés.",
    errorInvalidDelay: "Le délai doit être entre 30 jours et 2 ans.",
    errorAlreadyActive: "Un héritage est déjà actif. Révoquez-le d'abord.",
    errorNotClaimable: "Cet héritage n'est pas encore réclamable.",
    errorNotBeneficiary: "Vous n'êtes pas bénéficiaire de cet héritage.",
    errorAlreadyClaimed: "Cet héritage a déjà été réclamé.",
    statusGreen: "Tout va bien — le heartbeat est récent.",
    statusYellow: "Attention — le heartbeat vieillit.",
    statusRed: "Critique — l'héritage se déclenchera bientôt.",
    contactEmail: "Email",
    contactTelegram: "Pseudo Telegram",
    contactAddress: "Adresse Smart Account",
    contactRequired: "Au moins une méthode de contact est requise",
    statusPending: "En attente",
    statusConfirmed: "Confirmé",
    inviteSent: "Invitation envoyée",
    inviteEmailSubject: "Vous êtes bénéficiaire d'un héritage numérique",
    telegramBotRequired: "Le bénéficiaire doit d'abord envoyer /start à @VaultKeepRBot sur Telegram",
    errorSmartAccountNotReady: "Votre Smart Account n'est pas encore prêt.",
    errorActivation: "Une erreur est survenue lors de l'activation.",
    errorRevocation: "Une erreur est survenue lors de la révocation.",
    heartbeatCooldown: "Un heartbeat a été envoyé récemment. Le cooldown est actif."
  },
  contentScript: {
    card: {
      title: "Paiement",
      empty: "Aucune carte enregistrée pour ce site"
    },
    passkey: {
      title: "Choisir une clé d'accès",
      subtitle: "Se connecter avec une clé d'accès pour {0}",
      empty: "Aucune clé d'accès disponible pour ce site",
      use: "Utiliser"
    },
    changePassword: {
      title: "Changer le mot de passe",
      current: "Actuel",
      generate: "Générer"
    },
    generator: {
      title: "Générateur de mot de passe",
      generatedPassword: "Mot de passe généré",
      length: "Longueur",
      regenerate: "Régénérer",
      fill: "Remplir",
      copy: "Copier",
      copied: "Copié",
      show: "Afficher",
      hide: "Masquer",
      uppercase: "Majuscules",
      lowercase: "Minuscules",
      numbers: "Chiffres",
      symbols: "Symboles",
      strength: {
        weak: "Faible",
        medium: "Moyen",
        strong: "Fort"
      },
      noFocusedField: "Cliquez sur un champ pour y coller le mot de passe"
    },
    identity: {
      title: "Identité",
      analyzing: "Analyse en cours…",
      empty: "Aucune identité enregistrée pour ce site"
    },
    locked: {
      title: "Coffre verrouillé",
      body: "Déverrouillez l'extension pour utiliser vos identifiants enregistrés."
    },
    login: {
      title: "Connexion",
      generate: "Générer un mot de passe",
      noMatch: "Aucun identifiant enregistré pour ce site",
      noName: "Sans nom",
      update: "Mettre à jour",
      alias: "Utiliser un alias + mot de passe",
      aliasPremium: "L'alias email nécessite Premium",
      aliasLocked: "Déverrouillez l'extension pour créer un alias",
      aliasError: "Impossible de créer l'alias",
      aliasAddLicenseKey: "Ajouter une clé de licence",
      search: "Rechercher…"
    },
    phishing: {
      title: "Site suspect",
      understood: "Compris"
    },
    savePrompt: {
      newTitle: "Enregistrer le mot de passe ?",
      save: "Enregistrer",
      generate: "Générer et enregistrer",
      update: "Mettre à jour",
      updateTitle: "Mettre à jour le mot de passe ?",
      username: "Identifiant",
      password: "Mot de passe",
      chooseEntry: "Mettre à jour quelle entrée ?",
      neverForSite: "Ne jamais enregistrer pour ce site"
    },
    signup: {
      title: "Inscription",
      generate: "Générer un mot de passe",
      alias: "Utiliser un alias + mot de passe",
      aliasPremium: "L'alias email nécessite Premium",
      aliasLocked: "Déverrouillez l'extension pour créer un alias",
      aliasError: "Impossible de créer l'alias",
      aliasAddLicenseKey: "Ajouter une clé de licence"
    },
    toast: {
      generated: "Généré",
      saved: "Identifiants enregistrés",
      updated: "Identifiants mis à jour",
      filled: "Rempli",
      saveError: "Échec de l'enregistrement — réessayez"
    },
    tos: {
      title: "Analyse des CGU",
      loading: "Analyse des CGU en cours…",
      error: "Impossible d'analyser les CGU.",
      resultHeader: "Analyse terminée",
      dataSharingSafe: "Aucun partage de données évident détecté",
      dataSharingDanger: "Ce site semble partager vos données avec des tiers",
      deletionSafe: "La suppression de compte semble possible",
      deletionWarning: "La suppression de compte pourrait être complexe",
      riskLabel: "Score de risque",
      basicModeHint: "Analyse de base (mode hors ligne)",
      closeClause: "Clauses citées",
      trackingSafe: "Aucun suivi inter-site évident",
      trackingDanger: "Suivi inter-site / profilage comportemental détecté",
      arbitrSafe: "Aucune clause d'arbitrage obligatoire",
      arbitrDanger: "Clause d'arbitrage contraignant présente",
      unilateralSafe: "Conditions apparemment stables",
      unilateralDanger: "Modification unilatérale des conditions autorisée",
      liabilitySafe: "Absence de limitation de responsabilité excessive",
      liabilityDanger: "Clause de responsabilité limitée / sans garantie présente"
    },
    totp: {
      title: "Code de double authentification",
      fill: "Remplir",
      copy: "Copier",
      noCode: "Aucun code 2FA enregistré pour ce site",
      hintBody: "Ouvrez une page de configuration 2FA pour ajouter un code"
    }
  },

  enterprise: {
    espacePersonal: "Personnel",
    espaceOrg: "Organisation",
    leaveOrgMode: "Quitter",
    leaveOrgModeTitle: "Quitter le mode Organisation (les clés PRO sont évincées de la mémoire, le vault perso reste déverrouillé)",
    sharedVaults: "Shared vaults",
    noVaults: "Aucun vault organisation.",
    entries: "entrées",
    entryCount: "entrée(s)",
    refresh: "Rafraîchir",
    loading: "Chargement…",
    joinOrg: {
      title: "Rejoindre mon organisation",
      subtitle: "Saisissez votre email professionnel. Si votre domaine est enregistré, l'admin IT recevra votre demande d'accès.",
      emailLabel: "Email professionnel",
      submit: "Demander à rejoindre",
      submitting: "Envoi…",
      successTitle: "Demande envoyée.",
      successBody: "Votre demande pour rejoindre",
      successBody2: "est en attente d'approbation. L'admin IT doit valider votre accès dans la console, puis vous recevrez une invitation.",
      errorEmail: "Email invalide",
      errorSign: "Signature échouée",
      noIdentity: "Vous devez d'abord créer votre vault pour dériver votre identité (AA). Votre signature prouvera qui vous êtes.",
      createVaultBtn: "Créer mon vault",
      zkNote: "Votre signature prouve votre identité sans révéler votre clé privée. L'email n'est stocké que par domaine."
    },
    team: {
      title: "Team — Crypto tasks",
      noTasks: "Aucune task en attente. L'admin IT peut gérer les membres depuis le dashboard.",
      execute: "Exécuter",
      executing: "Exécution…",
      done: "Exécuté avec succès",
      invite: "Inviter un membre",
      rekey: "Rotation de clé (révocation)",
      resign: "Re-signer le manifest",
      consoleLink: "dashboard",
      zkNote: "Ces tasks durcissent cryptographiquement les actions admin (rotation de clé, création d'envelope). L'accès est déjà coupé côté serveur immédiatement après révocation."
    }
  }
};