export function buildJobSearchFilter(defaultFilter:any) {
  return {
    page: 1,

    locationTagIds: defaultFilter.locations.map(
      location => location.id
    ),

    remoteCompanyLocationTagIds:
      defaultFilter.remoteCompanyLocations.map(
        location => location.id
      ),

    roleTagIds: defaultFilter.roles.map(
      role => role.id
    ),

    equity: {
      min: defaultFilter.equity.min,
      max: defaultFilter.equity.max
    },

    jobTypes: defaultFilter.jobTypes,

    remotePreference: defaultFilter.remotePreference,

    salary: {
      min: defaultFilter.salary.min,
      max: defaultFilter.salary.max
    },

    yearsExperience: {
      min: defaultFilter.yearsExperience.min,
      max: defaultFilter.yearsExperience.max
    }
  };
}