const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee CRUD', () => {

  before(async () => {
    // connects our backend code with real test database
    mongoose.connect('mongodb://localhost:27017/companyDBTest', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;

    db.once('open', () => { console.log('Connected to the database'); });
    db.on('error', err => console.log('Error ' + err));
  });

  describe('Employee - Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'firstNameFirst', lastName: 'lastNameFirst', department:  'department1' });
      await testEmpOne.save();
      const testEmpTwo = new Employee({ firstName: 'firstNameTwo', lastName: 'lastNameTwo', department:  'department2' });
      await testEmpTwo.save();
    });

    after(async () => {
      await Employee.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "firstName" with "findOne" method', async () => {
      let employee = await Employee.findOne({ firstName: 'firstNameFirst' });
      let expectedValue = 'firstNameFirst';
      expect(employee.firstName).to.be.equal(expectedValue);

      employee = await Employee.findOne({ firstName: 'firstNameTwo' });
      expectedValue = 'firstNameTwo';
      expect(employee.firstName).to.be.equal(expectedValue);

      employee = await Employee.findOne({ lastName: 'lastNameTwo' });
      expectedValue = 'firstNameTwo';
      expect(employee.firstName).to.be.equal(expectedValue);
      
      employee = await Employee.findOne({ department: 'department1' });
      expectedValue = 'firstNameFirst';
      expect(employee.firstName).to.be.equal(expectedValue);
    });
  });

  describe('Employee - Creating data', () => {
    after(async () => {
        await Employee.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
        const employee = new Employee({ firstName: 'firstNameThird', lastName: 'lastNameThird', department: 'department3' });
        await employee.save();
        const savedEmployee = await Employee.findOne({ firstName: 'firstNameThird' });
        expect(savedEmployee).to.not.be.null;
    });
  });
  
  describe('Employee - Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'firstNameFirst', lastName: 'lastNameFirst', department: 'department1' });
      await testEmpOne.save();
      const testEmpTwo = new Employee({ firstName: 'firstNameTwo', lastName: 'lastNameTwo', department: 'department2' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
          await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
          await Employee.updateOne({ firstName: 'firstNameFirst' }, { $set: { lastName: 'ChangedLastName' }});
          const updatedEmployee = await Employee.findOne({ lastName: 'ChangedLastName' });
          expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
          const employee = await Employee.findOne({ firstName: 'firstNameFirst' });
          employee.department = 'departmentChanged';
          await employee.save();
        
          const updatedEmployee = await Employee.findOne({ department: 'departmentChanged' });
          expect(updatedEmployee).to.not.be.null;
    });
    
    it('should properly update multiple documents with "updateMany" method', async () => {
          await Employee.updateMany({}, { $set: { department: 'Updated!' }});
          const employees = await Employee.find();
          expect(employees[0].department).to.be.equal('Updated!');
          expect(employees[1].department).to.be.equal('Updated!');
    });
  });

  describe('Employee - Removing data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'firstNameFirst', lastName: 'lastNameFirst', department: 'department1' });
      await testEmpOne.save();
      const testEmpTwo = new Employee({ firstName: 'firstNameTwo', lastName: 'lastNameTwo', department: 'department2' });
      await testEmpTwo.save();
    });
    
    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ department: 'department1' });
      const removeEmployee = await Employee.findOne({ department: 'department1' });
      expect(removeEmployee).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'firstNameTwo' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'firstNameTwo' });
      expect(removedEmployee).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
  });
});