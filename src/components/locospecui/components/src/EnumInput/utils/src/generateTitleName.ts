const generateTitleName = (str: string) => {
  return str
    .replace(/_/g, " ") // Replace underscores with spaces
    .split(" ") // Split the string into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join the words back into a single string
};

generateTitleName.displayName = "generateTitleName";

export { generateTitleName };
