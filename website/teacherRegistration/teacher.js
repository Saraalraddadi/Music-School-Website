function Teacher(firstName = '', middleName = '', lastName = '', birthday = '', address = '', phoneNumber = '', email = '', password = '', description = '', languages = [], instruments = [], grades = [], gender = '') {
  this.firstName = firstName;
  this.middleName = middleName;
  this.lastName = lastName;
  this.birthday = birthday;
  this.address = address;
  this.phoneNumber = phoneNumber;
  this.email = email;
  this.password = password;
  this.description = description;
  this.languages = languages;
  this.instrumentTypeIds = instruments;
  this.instrumentTypeGrades = grades;
  this.gender = gender;
}