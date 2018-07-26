import ICustomer from "./../models/ICustomer"

export default class MockCustomersService {
  static getCustomers: () => ICustomer[] = function() {
    return [ 
      {CustomerId:1, FirstName: "Ted", LastName: "Pattison"},
      {CustomerId:2, FirstName: "Charles", LastName: "Sterling"},
      {CustomerId:3, FirstName: "Christina", LastName: "Wheeler"},
      {CustomerId:4, FirstName: "Paul", LastName: "Turley"},
      {CustomerId:5, FirstName: "Todd", LastName: "Baginski"}
    ];
  } 
}