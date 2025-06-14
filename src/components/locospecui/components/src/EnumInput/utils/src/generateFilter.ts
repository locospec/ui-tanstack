const generateFilter = (
  formData: Record<string, string>,
  dependsOn: string[]
) => {
  if (!formData || dependsOn.length < 1) {
    return {};
  }
  const dependencyFilters: any = [];
  dependsOn.forEach((key: string) => {
    if (key in formData) {
      dependencyFilters.push({
        attribute: key,
        op: "is_any_of",
        value: [formData[key]],
      });
    }
  });
  if (dependencyFilters.length < 1) {
    return {};
  }
  return {
    op: "and",
    conditions: dependencyFilters,
  };
};
generateFilter.displayName = "generateFilter";

export { generateFilter };
