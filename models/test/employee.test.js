const Employee = require('../employee.model.js');
const Department = require('../department.model.js');
const expect = require('chai').expect;

describe('Employee', () => {

  it('should throw an error if no args exists', () => {
    const emp = new Employee({}); // create new Employee, but don't set any attr value
  
    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if any of args is not a string', () => {
    let data = {
      firstName: 'firstName',
      lastName: 'lastName',
      department: 'department'
    };

    const cases = [{}, []];
  
    for(let nString of cases) {
      data.firstName = nString;
      const emp = new Employee( { ...data } );
      emp.validate(err => { expect(err.errors.firstName).to.exist; });
    }

    for(let nString of cases) {
      data.lastName = nString;
      const emp = new Employee( { ...data } );
      emp.validate(err => { expect(err.errors.lastName).to.exist; });
    }

    for(let nString of cases) {
      data.department = nString;
      const emp = new Employee( { ...data } );
      emp.validate(err => { expect(err.errors.department).to.exist; });
    }
  });

  it('should not throw an error if args are okey', () => {
    const cases = [
      {
        firstName: 'firstName',
        lastName: 'lastName',
        department: 'department'
      },
      {
        firstName: 'firstName',
        lastName: 'lastName',
        department: 'department'
      },
    ];
    
    cases.map(data => {
      const emp = new Employee({ ...data });
    emp.validate(err => { expect(err).to.not.exist; });
    });
  });
});