export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const personalDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "aol.com",
      "protonmail.com",
      "icloud.com",
      "zoho.com"
    ];
  
    if (!emailRegex.test(email)) return false;
  
    const domain = email.split("@")[1].toLowerCase();
    return !personalDomains.includes(domain);
  };
