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
    tosModelDownloading: string;
    tosModelReady: string;
    tosModelError: string;
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
    contactSupport: string;
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
    sortDomain: string;
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
    storeOnChainQrHint: string;
    storeOnChainSecondPrompt: string;
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
    sortDomain: string;
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
    techPillarLink: string;
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
    footerSocialLinkedinAria: string;
    footerSocialMastodonAria: string;
    footerSocialFarcasterAria: string;
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
    landingDemoBtn: string;
    landingDemoDesc: string;
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
    autoSaveOrg: string;
    autoSaveOrgTitle: string;
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
      ssoDivider: string;
      ssoGoogle: string;
      ssoMicrosoft: string;
      ssoSaml: string;
      ssoVerified: string;
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
    tosModelDownloading: "Downloading analysis model…",
    tosModelReady: "Analysis model ready — neural mode active",
    tosModelError: "Model download failed — basic analysis",
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
    goPasswordlessDesc: "Secure your account with a Passkey (Account Abstraction) and say goodbye to passwords.",
    contactSupport: "Contact Support"
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
    sortZa: "Z → A",
    sortDomain: "Domain"
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
    storeOnChainQrHint:
    "Scan with your wallet to pair for this transaction only. Approve Ethereum and Base, then confirm the transaction on your device.",
    storeOnChainSecondPrompt:
    "After connecting: keep the wallet app open — a second prompt should appear to sign the transaction on Base (not only the connection).",
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
    sortDomain: "Sort: Domain",
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
    techPillarLink: "Zero-knowledge encryption explained: read the guide",
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
    footerSocialGithubAria: "vaultkeepr-public repository on GitHub",
    footerSocialXAria: "VaultKeepR on X (@vaultkeepr_xyz)",
    footerSocialMastodonAria: "VaultKeepR on Mastodon (@vaultkeepr@infosec.exchange)",
    footerSocialFarcasterAria: "VaultKeepR on Farcaster (@vaultkeepr.eth)",
    footerSocialLinkedinAria: "VaultKeepR on LinkedIn",
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
    landingDemoBtn: "Try the demo vault",
    landingDemoDesc: "Fake data, premium included. Perfect for videos and screenshots.",
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
    leaveOrgModeTitle: "Leave Organisation mode (Organisation keys are evicted from memory, personal vault stays unlocked)",
    autoSaveOrg: "Auto-save to org",
    autoSaveOrgTitle: "On whitelisted domains, passwords captured by autosave go to the Organisation space (executed at next unlock if needed)",
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
      zkNote: "Your signature proves your identity without revealing your private key. The email is stored by domain only.",
      ssoDivider: "or verify instantly via",
      ssoGoogle: "Continue with Google",
      ssoMicrosoft: "Continue with Microsoft",
      ssoSaml: "Continue with SAML (enterprise IdP)",
      ssoVerified: "Email verified via your company SSO provider"
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
