function TeacherApplication(firstName = '', middleName = '', lastName = '', 
							birthday = '', phoneNumber = '', email = '', gender = '',
							coverLetter = '', reference1name = '', reference1number = '', 
							reference2name = '', reference2number = '', reference3name = '', 
							reference3number = '', instruments = '', hours = '', languages = []) {
  this.firstName = firstName;
  this.middleName = middleName;
  this.lastName = lastName;
  this.birthday = birthday;
  this.phoneNumber = phoneNumber;
  this.gender = gender;
  this.email = email;
  this.reference1name = reference1name;
  this.reference1number = reference1number;
  this.reference2name = reference2name;
  this.reference2number = reference2number;
  this.reference3name = reference3name;
  this.reference3number = reference3number;
  this.instruments = instruments;
  this.languages = languages;
  this.coverLetter = coverLetter;
  this.hours = hours;
}